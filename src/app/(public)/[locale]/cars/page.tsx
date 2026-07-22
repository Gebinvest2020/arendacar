import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CatalogSearch } from "@/components/cars/CatalogSearch";
import { CarsCatalog } from "@/components/cars/CarsCatalog";
import { parseFilters } from "@/lib/car-filters";
import { getAllCars, getAllCategories } from "@/server/catalog";
import { assertCarContentComplete, translateCity } from "@/lib/car-content";
import { site } from "@/data/site";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: buildAlternates(locale as Locale, "/cars"),
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CarsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const sp = await searchParams;
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") usp.set(key, value);
    else if (Array.isArray(value) && value[0]) usp.set(key, value[0]);
  }
  const initialFilters = parseFilters(usp);

  const [cars, categories] = await Promise.all([getAllCars(), getAllCategories()]);

  // Строгая проверка: у всех активных машин есть переводы описания/комплектации.
  assertCarContentComplete(cars);

  const availableCount = cars.filter((c) => c.available).length;

  return (
    <div className="bg-graphite text-milk">
      <section className="border-b border-white/10 bg-graphite-2">
        <Container className="py-12 sm:py-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
            <span aria-hidden="true" className="h-px w-6 bg-champagne/70" />
            <span aria-hidden="true">◈</span> {translateCity(site.defaultCity, locale as Locale)}
          </span>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight tracking-tight text-milk sm:text-5xl">
            {t("categories.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-milk/70">
            {t("categories.subtitle")}
          </p>
          <p className="mt-4 text-sm text-milk-dim" aria-live="polite">
            {t("catalog.found")} <span className="font-semibold text-milk">{availableCount}</span>
          </p>

          <div className="mt-6">
            <CatalogSearch />
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <CarsCatalog cars={cars} categories={categories} initialFilters={initialFilters} />
      </Container>
    </div>
  );
}
