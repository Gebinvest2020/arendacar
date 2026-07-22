import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { PremiumCarCard } from "@/components/cars/PremiumCarCard";
import type { Car } from "@/types/car";

export function PopularCars({ cars }: { cars: Car[] }) {
  const t = useTranslations();
  return (
    <section id="cars" className="bg-graphite py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={t("popular.title")} subtitle={t("popular.subtitle")} tone="onDark" />
          <Link
            href="/cars"
            className="text-sm font-semibold text-champagne transition-colors duration-200 hover:text-champagne-dark"
          >
            {t("popular.viewAll")}
          </Link>
        </div>

        {/* Четыре премиальных авто крупнее: 2×2 на десктопе, 2 на планшете, 1 на мобильном */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6">
          {cars.map((car) => (
            <PremiumCarCard key={car.id} car={car} />
          ))}
        </div>
      </Container>
    </section>
  );
}
