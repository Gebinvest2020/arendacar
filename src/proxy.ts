import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

// Next.js 16: единый proxy. Совмещает:
//   A. быстрый барьер админки (по наличию cookie, без Prisma);
//   B. next-intl locale routing для публичного сайта;
//   C. legacy-redirects старых URL (/, /cars, /cars/[slug]) на /{locale}/…
// Настоящая авторизация админки — всегда через requireAdmin() в БД.

const intlMiddleware = createIntlMiddleware(routing);

const COOKIE = "admin_session";
// Публично доступны без cookie (админка НЕ локализуется).
const ADMIN_PUBLIC = new Set<string>([
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Админка и её API: барьер по cookie, без локализации ---
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (ADMIN_PUBLIC.has(pathname)) return NextResponse.next();

    const hasCookie = Boolean(req.cookies.get(COOKIE)?.value);
    if (hasCookie) return NextResponse.next();

    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json(
        { ok: false, error: "UNAUTHORIZED", message: "Требуется вход." },
        { status: 401 },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    if (pathname.startsWith("/admin/")) url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // --- Прочие API (в т.ч. публичный /api/bookings): без локализации ---
  if (pathname.startsWith("/api")) return NextResponse.next();

  // --- Публичный сайт: next-intl (определение языка + legacy-redirects) ---
  // localePrefix:"always" → / и /cars автоматически ведут на /{detectedLocale}/…
  return intlMiddleware(req);
}

// Матчер: всё, кроме служебных путей и файлов с расширением. Админка и её API
// покрыты явно. _next/_vercel/файлы (favicon, robots, sitemap, изображения) — нет.
export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
