import { useTranslations } from "next-intl";
import { CatalogCarCard } from "./CatalogCarCard";
import type { Car } from "@/types/car";

export function SimilarCars({ cars }: { cars: Car[] }) {
  const t = useTranslations("carPage");
  if (cars.length === 0) return null;

  return (
    <section aria-labelledby="similar-heading">
      <h2 id="similar-heading" className="text-2xl font-bold tracking-tight text-ink">
        {t("similar")}
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CatalogCarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
