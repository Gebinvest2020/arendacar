import type { MetadataRoute } from "next";
import { getAllCarSlugs } from "@/server/catalog";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/locale";
import { SITE_URL } from "@/lib/seo";

// Sitemap со всеми locale-URL: главная, каталог и 8 машин × 4 языка.
// hreflang-альтернативы указываются в поле alternates.languages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllCarSlugs();

  // Пути без locale-сегмента.
  const paths = ["", "/cars", ...slugs.map((s) => `/cars/${s}`)];

  function languagesFor(path: string): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${path}`;
    return languages;
  }

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        alternates: { languages: languagesFor(path) },
        priority: path === "" ? 1 : path === "/cars" ? 0.8 : 0.6,
      });
    }
  }
  // x-default (главная на дефолтном языке) уже покрыт /{DEFAULT_LOCALE}.
  void DEFAULT_LOCALE;
  return entries;
}
