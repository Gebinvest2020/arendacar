import type { Metadata } from "next";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/locale";

// Базовый адрес production для canonical/hreflang.
export const SITE_URL = "https://arendacar.vercel.app";

// Строит alternates (canonical + languages + x-default) для locale-страницы.
// path — путь БЕЗ locale-сегмента: "" (главная), "/cars", "/cars/bmw-5-series".
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  };
}
