import "server-only";

// Серверная логика создания заявки на аренду.
// КРИТИЧНО: все деньги и количество суток считаются здесь, из данных БД.
// Ценам, присланным клиентом, доверять нельзя — они в расчёте не участвуют.

import { prisma } from "@/lib/db";
import { getRentalDays, selectPriceTier } from "@/lib/pricing";
import { normalizePhone, PRIVACY_VERSION, formatBookingReference } from "@/lib/booking";
import { localeToEnum, enumToLocale, type Locale, type BookingLocaleEnum } from "@/lib/locale";
import type { BookingInput } from "@/lib/validation/booking";

// Что безопасно отдавать клиенту (без внутренних id, телефона, ключей).
export type PublicBooking = {
  publicId: string;
  reference: string;
  carName: string;
  pickupDate: string; // ISO
  returnDate: string; // ISO
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  withDriver: boolean;
  locale: Locale; // lowercase для клиента
};

// Отдельный безопасный payload для Telegram (НЕ отправляется клиенту).
export type BookingNotification = {
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  carName: string;
  cityName: string;
  pickupDate: string; // ISO
  returnDate: string; // ISO
  rentalDays: number;
  withDriver: boolean;
  bookingLocale: BookingLocaleEnum;
  rentalTotal: number;
  depositAmount: number;
  comment: string | null;
};

export type CreateBookingResult =
  | { ok: true; created: boolean; booking: PublicBooking; notify?: BookingNotification }
  | {
      ok: false;
      code: "CAR_NOT_FOUND" | "CAR_UNAVAILABLE" | "VALIDATION_ERROR";
      message: string;
      fields?: Record<string, string>;
    };

// Дуб-тайп проверки Prisma unique-конфликта (гонка по idempotencyKey).
function isUniqueViolation(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: unknown }).code === "P2002"
  );
}

function toPublic(b: {
  publicId: string;
  carName: string;
  pickupDate: Date;
  returnDate: Date;
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  withDriver: boolean;
  bookingLocale: BookingLocaleEnum;
}): PublicBooking {
  return {
    publicId: b.publicId,
    reference: formatBookingReference(b.publicId),
    carName: b.carName,
    pickupDate: b.pickupDate.toISOString(),
    returnDate: b.returnDate.toISOString(),
    rentalDays: b.rentalDays,
    dailyRate: b.dailyRate,
    rentalTotal: b.rentalTotal,
    depositAmount: b.depositAmount,
    withDriver: b.withDriver,
    locale: enumToLocale(b.bookingLocale),
  };
}

export async function createBooking(input: BookingInput): Promise<CreateBookingResult> {
  // 1. Идемпотентность: если заявка с таким ключом уже есть — вернуть её (повтор).
  const existing = await prisma.booking.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) {
    return { ok: true, created: false, booking: toPublic(existing) };
  }

  // 2. Машина — ПРЯМОЙ запрос к БД (без UI-mapper). Берём только нужные поля
  //    и тарифы, отсортированные по minDays (для корректного подбора тарифа).
  const car = await prisma.car.findUnique({
    where: { slug: input.carSlug },
    select: {
      id: true,
      fullName: true,
      slug: true,
      available: true,
      dailyPrice: true,
      deposit: true,
      cityId: true,
      city: { select: { name: true } },
      priceTiers: {
        select: { minDays: true, maxDays: true, pricePerDay: true },
        orderBy: { minDays: "asc" },
      },
    },
  });

  if (!car) {
    return { ok: false, code: "CAR_NOT_FOUND", message: "Автомобиль не найден." };
  }
  if (!car.available) {
    return {
      ok: false,
      code: "CAR_UNAVAILABLE",
      message: "Этот автомобиль сейчас недоступен для бронирования.",
    };
  }

  // 3. Даты. Zod уже проверил, что строки парсятся; здесь бизнес-правила.
  const pickup = new Date(input.pickupDate);
  const ret = new Date(input.returnDate);
  if (ret.getTime() <= pickup.getTime()) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Дата возврата должна быть позже даты получения.",
      fields: { returnDate: "Дата возврата должна быть позже получения." },
    };
  }

  // 4. Количество суток — на сервере (округление вверх, минимум 1).
  const rentalDays = getRentalDays(pickup, ret);
  if (rentalDays < 1) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Некорректный период аренды.",
      fields: { returnDate: "Некорректный период аренды." },
    };
  }

  // 5. Тариф и суммы — из БД. Клиентские значения игнорируются полностью.
  const tier = selectPriceTier(car.priceTiers, rentalDays);
  if (!tier) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Не удалось подобрать тариф для выбранного периода.",
    };
  }
  const dailyRate = tier.pricePerDay;
  const rentalTotal = dailyRate * rentalDays;
  const depositAmount = car.deposit; // залог отдельно, НЕ входит в rentalTotal

  // 6. Телефон — нормализация + проверка длины.
  const phone = normalizePhone(input.customerPhone);
  if (!phone) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Некорректный номер телефона.",
      fields: { customerPhone: "Укажите корректный номер (8–15 цифр)." },
    };
  }

  // 7. Создание заявки. consentAcceptedAt и privacyVersion ставит сервер.
  const data = {
    idempotencyKey: input.idempotencyKey,
    carId: car.id,
    cityId: car.cityId,
    carName: car.fullName,
    carSlug: car.slug,
    customerName: input.customerName.trim(),
    customerPhone: phone,
    customerEmail: input.customerEmail ?? null,
    pickupDate: pickup,
    returnDate: ret,
    rentalDays,
    dailyRate,
    rentalTotal,
    depositAmount,
    comment: input.comment?.trim() ? input.comment.trim() : null,
    consentAcceptedAt: new Date(),
    privacyVersion: PRIVACY_VERSION,
    // Фаза 6: водитель и язык заявки. Суммы (rentalTotal/dailyRate/deposit)
    // от этих полей НЕ зависят — цена водителя не добавляется.
    withDriver: input.withDriver,
    bookingLocale: localeToEnum(input.locale),
    // status NEW и source WEBSITE — из default'ов схемы.
  };

  try {
    const created = await prisma.booking.create({ data });
    // Безопасный payload для Telegram — только при реальном создании.
    const notify: BookingNotification = {
      reference: formatBookingReference(created.publicId),
      customerName: created.customerName,
      customerPhone: created.customerPhone,
      customerEmail: created.customerEmail,
      carName: created.carName,
      cityName: car.city.name,
      pickupDate: created.pickupDate.toISOString(),
      returnDate: created.returnDate.toISOString(),
      rentalDays: created.rentalDays,
      withDriver: created.withDriver,
      bookingLocale: created.bookingLocale as BookingLocaleEnum,
      rentalTotal: created.rentalTotal,
      depositAmount: created.depositAmount,
      comment: created.comment,
    };
    return { ok: true, created: true, booking: toPublic(created), notify };
  } catch (e) {
    // Гонка: параллельный запрос с тем же idempotencyKey успел создать заявку.
    // Не отдаём 500 и не создаём дубль — возвращаем уже существующую заявку.
    if (isUniqueViolation(e)) {
      const raced = await prisma.booking.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (raced) {
        return { ok: true, created: false, booking: toPublic(raced) };
      }
    }
    throw e;
  }
}
