import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { CatalogCarCard } from "@/components/cars/CatalogCarCard";
import { cars } from "@/data/cars";

export function PopularCars() {
  // На главной показываем несколько популярных авто; полный список — в каталоге.
  const featured = cars.filter((c) => c.featured);
  const list = (featured.length >= 3 ? featured : cars).slice(0, 6);

  return (
    <section id="cars" className="bg-muted py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Популярные автомобили"
            subtitle="Часто выбирают наши клиенты. Полный каталог с фильтрами — на отдельной странице."
          />
          <Link
            href="/cars"
            className="text-sm font-semibold text-accent-dark transition-colors hover:text-ink"
          >
            Смотреть весь каталог →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((car) => (
            <CatalogCarCard key={car.id} car={car} />
          ))}
        </div>
      </Container>
    </section>
  );
}
