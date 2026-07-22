import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { formatCurrency } from "@/lib/currency";
import { categoryName, translateDrivetrain } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import type { Car } from "@/types/car";

// «Наш автопарк» — editorial-список текущих машин (иной формат, чем PopularCars).
// Заменяет старый блок категорий: показывает реальные 4 авто, без пустых категорий.
export function FleetCollection({ cars }: { cars: Car[] }) {
  const t = useTranslations();
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <section id="categories" className="bg-graphite-2 py-16 sm:py-20">
      <Container>
        <SectionHeading title={t("fleet.title")} subtitle={t("fleet.subtitle")} tone="onDark" />

        <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {cars.map((car) => (
            <li key={car.id}>
              <Link
                href={`/cars/${car.slug}`}
                className="group flex items-center gap-4 py-4 transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/50 sm:gap-6 sm:py-5"
              >
                <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-[3px] border border-white/10 bg-graphite sm:w-40">
                  <Image
                    src={car.image}
                    alt={car.imageAlt}
                    fill
                    sizes="(max-width: 640px) 112px, 160px"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 dir="ltr" className="font-display text-xl font-semibold text-milk text-start sm:text-2xl">
                    {car.fullName}
                  </h3>
                  <p className="mt-1 truncate text-sm text-milk-dim">
                    {categoryName(car.category, locale)} · {car.year} · {translateDrivetrain(car.drivetrain, locale)}
                  </p>
                </div>

                <div className="shrink-0 text-end">
                  <p className="text-xs text-milk-dim">{tc("from")}</p>
                  <p className="text-lg font-extrabold leading-none text-champagne sm:text-xl">
                    <span dir="ltr">{formatCurrency(car.dailyPrice)}</span>
                    <span className="ms-1 text-xs font-semibold text-milk/60">{tc("perDay")}</span>
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg text-milk-dim transition-colors group-hover:text-champagne rtl:rotate-180"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
