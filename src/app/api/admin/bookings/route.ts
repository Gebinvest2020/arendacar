import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/admin/session";
import { bookingsQuerySchema } from "@/lib/validation/admin";
import { listBookings } from "@/server/admin/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/bookings — список заявок. Сначала авторизация, потом данные.
export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED", message: "Требуется вход." }, { status: 401 });
  }
  try {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = bookingsQuerySchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Некорректные параметры." }, { status: 400 });
    }
    const data = await listBookings(admin, parsed.data);
    return NextResponse.json({ ok: true, ...data }, { status: 200 });
  } catch (e) {
    console.error("GET /api/admin/bookings failed:", (e as Error)?.message);
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR", message: "Ошибка сервера." }, { status: 500 });
  }
}
