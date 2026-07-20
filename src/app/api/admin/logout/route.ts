import { NextResponse } from "next/server";
import { destroySession, isSameOrigin } from "@/server/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/logout — завершает текущую сессию. Идемпотентно.
export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN", message: "Запрос отклонён." }, { status: 403 });
    }
    await destroySession();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("POST /api/admin/logout failed:", (e as Error)?.message);
    return NextResponse.json(
      { ok: false, error: "INTERNAL_ERROR", message: "Не удалось выполнить выход." },
      { status: 500 },
    );
  }
}
