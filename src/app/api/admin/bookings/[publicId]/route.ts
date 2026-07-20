import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/admin/session";
import { publicIdSchema } from "@/lib/validation/admin";
import { getBookingByPublicId } from "@/server/admin/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/bookings/[publicId] — одна заявка.
export async function GET(_req: Request, ctx: { params: Promise<{ publicId: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED", message: "Требуется вход." }, { status: 401 });
  }
  try {
    const { publicId } = await ctx.params;
    const parsed = publicIdSchema.safeParse(publicId);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Некорректный идентификатор." }, { status: 400 });
    }
    const booking = await getBookingByPublicId(admin, parsed.data);
    if (!booking) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND", message: "Заявка не найдена." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking }, { status: 200 });
  } catch (e) {
    console.error("GET /api/admin/bookings/[publicId] failed:", (e as Error)?.message);
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR", message: "Ошибка сервера." }, { status: 500 });
  }
}
