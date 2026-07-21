import { NextResponse, after } from "next/server";
import { z } from "zod";
import { bookingInputSchema } from "@/lib/validation/booking";
import { createBooking } from "@/server/bookings";
import { sendBookingNotification } from "@/server/telegram/send-booking-notification";

// POST /api/bookings — создание заявки на аренду.
// Всегда динамический (пишет в БД), без кэша.
export const dynamic = "force-dynamic";

// Лимит размера тела запроса (~10 KB). Заявка маленькая; больше — подозрительно.
const MAX_BODY_BYTES = 10 * 1024;

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    // 1. Только application/json.
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json(
        {
          ok: false,
          error: "UNSUPPORTED_MEDIA_TYPE",
          message: "Ожидается application/json.",
        },
        415,
      );
    }

    // 2. Ранняя проверка размера по заголовку Content-Length.
    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return json(
        {
          ok: false,
          error: "PAYLOAD_TOO_LARGE",
          message: "Слишком большой запрос.",
        },
        413,
      );
    }

    // 3. Читаем тело и повторно проверяем фактический размер.
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json(
        {
          ok: false,
          error: "PAYLOAD_TOO_LARGE",
          message: "Слишком большой запрос.",
        },
        413,
      );
    }

    // 4. Разбор JSON. Тело запроса НЕ логируем.
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "Некорректный формат запроса.",
        },
        400,
      );
    }

    // 5. Honeypot: если скрытое поле website заполнено — это бот.
    //    Возвращаем нейтральный ответ, запись не создаём и настоящий publicId
    //    не отдаём. Механизм антиспама не раскрываем.
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as { website?: unknown }).website === "string" &&
      (parsed as { website: string }).website.trim() !== ""
    ) {
      return json(
        {
          ok: true,
          booking: {
            publicId: "",
            reference: "",
            carName: "",
            pickupDate: null,
            returnDate: null,
            rentalDays: 0,
            dailyRate: 0,
            rentalTotal: 0,
            depositAmount: 0,
          },
        },
        201,
      );
    }

    // 6. Валидация Zod (строгая: лишние поля отклоняются).
    const result = bookingInputSchema.safeParse(parsed);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      const fields: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
        if (msgs && msgs.length > 0) fields[key] = msgs[0];
      }
      return json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          message: "Проверьте правильность заполнения формы.",
          fields,
        },
        400,
      );
    }

    // 7. Бизнес-логика: расчёт на сервере + сохранение.
    const created = await createBooking(result.data);

    if (!created.ok) {
      const statusByCode = {
        CAR_NOT_FOUND: 404,
        CAR_UNAVAILABLE: 409,
        VALIDATION_ERROR: 400,
      } as const;
      return json(
        {
          ok: false,
          error: created.code,
          message: created.message,
          ...(created.fields ? { fields: created.fields } : {}),
        },
        statusByCode[created.code],
      );
    }

    // Telegram — ТОЛЬКО при реальном создании (created === true). Повтор по
    // idempotencyKey и гонка дают created === false → уведомление не шлём.
    // after() выполняет отправку ПОСЛЕ ответа клиенту, не задерживая его.
    if (created.created && created.notify) {
      const payload = created.notify;
      after(async () => {
        try {
          await sendBookingNotification(payload);
        } catch (e) {
          // Ошибка Telegram не влияет на уже отправленный ответ клиенту.
          console.error("after(sendBookingNotification) failed:", (e as Error)?.name ?? "Error");
        }
      });
    }

    // 201 — новая заявка, 200 — повтор по idempotencyKey.
    return json({ ok: true, booking: created.booking }, created.created ? 201 : 200);
  } catch (e) {
    // Наружу — общий текст, без stack trace и без тела запроса.
    console.error("POST /api/bookings failed:", (e as Error)?.message);
    return json(
      {
        ok: false,
        error: "INTERNAL_ERROR",
        message: "Не удалось создать заявку. Попробуйте позже.",
      },
      500,
    );
  }
}
