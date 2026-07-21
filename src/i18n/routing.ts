import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locale";

// Маршрутизация next-intl. Префикс locale всегда виден: /ru, /en, /uk, /he.
// Cookie ручного выбора — NEXT_LOCALE. Валидный locale в URL — источник языка.
export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  },
});
