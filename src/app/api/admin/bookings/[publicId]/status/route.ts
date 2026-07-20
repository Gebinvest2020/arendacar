import { NextResponse } from "next/server";
import { requireAdmin, isSameOrigin } from "@/server/admin/session";
import { publicIdSchema, statusUpdateSchema } from "@/lib/validation/admin";
import { updateBookingStatus } from "@/server/admin/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1024;

// PATCH /api/admin/bookings/[publicId]/status — сменить ТОЛЬКО статус.
export async function PATCH(req: Request, ctx: { params: Promise<{ publicId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED", message: "Требуется вход." }, { status: 401 });
  }
  try {
    // Мутация → same-origin.
    if (!isSameOrigin(req)) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN", message: "Запрос отклонён." }, { status: 403 });
    }
    if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
      return NextResponse.json({ ok: false, error: "UNSUPPORTED_MEDIA_TYPE", message: "Ожидается application/json." }, { status: 415 });
    }
    const declared = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "PAYLOAD_TOO_LARGE", message: "Слишком большой запрос." }, { status: 413 });
    }
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "PAYLOAD_TOO_LARGE", message: "Слишком большой запрос." }, { status: 413 });
    }

    const { publicId } = await ctx.params;
    const idParsed = publicIdSchema.safeParse(publicId);
    if (!idParsed.success) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Некорректный идентификатор." }, { status: 400 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Некорректный формат запроса." }, { status: 400 });
    }
    // strict: разрешено только поле status.
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Недопустимый статус." }, { status: 400 });
    }

    const updated = await updateBookingStatus(admin, idParsed.data, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND", message: "Заявка не найдена." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking: updated }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/admin/bookings/[publicId]/status failed:", (e as Error)?.message);
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR", message: "Ошибка сервера." }, { status: 500 });
  }
}
