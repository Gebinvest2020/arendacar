import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CatalogSearch } from "@/components/cars/CatalogSearch";
import { CarsCatalog } from "@/components/cars/CarsCatalog";
import { parseFilters } from "@/lib/car-filters";
import { getAllCars, getAllCategories } from "@/server/catalog";
import { assertCarContentComplete } from "@/lib/car-content";
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

  return (
    <>
      <section className="border-b border-line bg-muted/50">
        <Container className="py-10 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t("categories.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60">
            {t("categories.subtitle")}
          </p>

          <div className="mt-6">
            <CatalogSearch />
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <CarsCatalog cars={cars} categories={categories} initialFilters={initialFilters} />
      </Container>
    </>
  );
}
