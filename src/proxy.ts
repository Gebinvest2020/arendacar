import { NextResponse, type NextRequest } from "next/server";

// Next.js 16: proxy заменяет middleware. Это ТОЛЬКО быстрый барьер по наличию
// cookie. Здесь НЕТ Prisma и обращений к БД. Настоящая проверка доступа —
// всегда через requireAdmin()/requireAdminPage() на сервере (Node).

const COOKIE = "admin_session";

// Публично доступны (без cookie): вход и API входа/выхода.
const PUBLIC_PATHS = new Set<string>([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const hasCookie = Boolean(req.cookies.get(COOKIE)?.value);
  if (hasCookie) {
    // Cookie есть — пропускаем. Настоящая проверка будет на сервере.
    return NextResponse.next();
  }

  // Нет cookie:
  if (pathname.startsWith("/api/admin/")) {
    // API → 401 JSON.
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED", message: "Требуется вход." },
      { status: 401 },
    );
  }

  // Страница → redirect на /admin/login с безопасным next (только внутренние /admin/*).
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  if (pathname.startsWith("/admin/")) {
    url.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(url);
}

// Узкий matcher: только админка и её API. Публичный сайт, ассеты, /api/bookings
// и изображения не затрагиваются.
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
