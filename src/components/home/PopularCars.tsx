import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { CatalogCarCard } from "@/components/cars/CatalogCarCard";
import type { Car } from "@/types/car";

export function PopularCars({ cars }: { cars: Car[] }) {
  const t = useTranslations();
  return (
    <section id="cars" className="bg-muted py-14 sm:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={t("popular.title")} subtitle={t("popular.subtitle")} />
          <Link
            href="/cars"
            className="text-sm font-semibold text-accent-dark transition-colors hover:text-ink"
          >
            {t("popular.viewAll")}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CatalogCarCard key={car.id} car={car} />
          ))}
        </div>
      </Container>
    </section>
  );
}
