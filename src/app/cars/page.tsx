import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogSearch } from "@/components/cars/CatalogSearch";
import { CarsCatalog } from "@/components/cars/CarsCatalog";
import { parseFilters } from "@/lib/car-filters";
import { cars } from "@/data/cars";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Каталог автомобилей — аренда в городе ${site.defaultCity} | ${site.brand}`,
  description:
    "Каталог автомобилей для аренды: эконом, комфорт, бизнес, SUV, минивэн и премиум. Фильтры, сортировка и прозрачные цены.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") usp.set(key, value);
    else if (Array.isArray(value) && value[0]) usp.set(key, value[0]);
  }
  const initialFilters = parseFilters(usp);

  return (
    <>
      <section className="border-b border-line bg-muted/50">
        <Container className="py-10 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Аренда автомобилей в Одессе
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60">
            Выберите автомобиль под ваши задачи и бюджет. Прозрачные цены, честный
            залог и понятные условия аренды. Даты в поиске пока носят
            демонстрационный характер.
          </p>

          <div className="mt-6">
            <CatalogSearch />
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <CarsCatalog cars={cars} initialFilters={initialFilters} />
      </Container>
    </>
  );
}
