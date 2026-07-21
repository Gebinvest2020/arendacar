import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { GearIcon, FuelIcon, SeatIcon, CalendarIcon } from "./CarIcons";
import { formatCurrency } from "@/lib/currency";
import { categoryName, translateTransmission, translateFuel } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import type { Car } from "@/types/car";

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-ink/70">
      <span className="text-accent-dark">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// Единая карточка автомобиля — используется в каталоге, на главной и в «похожих».
export function CatalogCarCard({ car }: { car: Car }) {
  const t = useTranslations("carCard");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const detailsHref = `/cars/${car.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src={car.image}
          alt={car.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          {categoryName(car.category, locale)}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
            car.available ? "bg-emerald-500/90 text-white" : "bg-ink/70 text-white"
          }`}
        >
          {car.available ? t("available") : t("unavailable")}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 dir="ltr" className="text-lg font-bold text-ink text-start">{car.fullName}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          <Spec icon={<CalendarIcon className="h-4 w-4" />} label={t("year", { year: car.year })} />
          <Spec icon={<GearIcon className="h-4 w-4" />} label={translateTransmission(car.transmission, locale)} />
          <Spec icon={<FuelIcon className="h-4 w-4" />} label={translateFuel(car.fuel, locale)} />
          <Spec icon={<SeatIcon className="h-4 w-4" />} label={t("seats", { count: car.seats })} />
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <div className="min-w-0">
              <p className="text-xs text-ink/50">{t("priceFrom")}</p>
              <p className="text-2xl font-extrabold leading-none text-ink">
                <span dir="ltr">{formatCurrency(car.dailyPrice)}</span>
                <span className="ms-1 text-sm font-semibold text-ink/60">{tc("perDay")}</span>
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-xs text-ink/50">{t("deposit")}</p>
              <p className="text-sm font-semibold text-ink" dir="ltr">{formatCurrency(car.deposit)}</p>
            </div>
          </div>

          <div className="mt-4 @container">
            <div className="grid grid-cols-1 gap-2 @[15rem]:grid-cols-2">
              <ButtonLink href={detailsHref} variant="ghost" size="sm" className="w-full min-w-0 max-w-full">
                {t("details")}
              </ButtonLink>
              <ButtonLink href={`${detailsHref}#booking`} variant="primary" size="sm" className="w-full min-w-0 max-w-full">
                {t("book")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
