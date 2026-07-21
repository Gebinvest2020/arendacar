// Общие константы локалей (клиент-безопасно, без server-only).
// Внутренний код украинского — "uk" (в UI-переключателе показываем как "UA").

export const LOCALES = ["ru", "en", "uk", "he"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

// he — единственный RTL-язык.
export const RTL_LOCALES: Locale[] = ["he"];

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}

// Соответствие locale (lowercase) ↔ Prisma-enum BookingLocale (uppercase).
export type BookingLocaleEnum = "RU" | "EN" | "UK" | "HE";

export function localeToEnum(l: Locale): BookingLocaleEnum {
  return l.toUpperCase() as BookingLocaleEnum;
}

export function enumToLocale(e: BookingLocaleEnum): Locale {
  return e.toLowerCase() as Locale;
}
