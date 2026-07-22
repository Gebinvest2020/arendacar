import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { GearIcon, FuelIcon, SeatIcon, CalendarIcon, DrivetrainIcon } from "./CarIcons";
import { formatCurrency } from "@/lib/currency";
import { categoryName, translateTransmission, translateFuel, translateDrivetrain } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import type { Car } from "@/types/car";

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-milk/70">
      <span className="text-champagne">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// Единая премиум-карточка автомобиля (тёмная showroom-поверхность).
// Используется на главной (популярные), в каталоге и в блоке «похожие».
export function PremiumCarCard({ car }: { car: Car }) {
  const t = useTranslations("carCard");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const detailsHref = `/cars/${car.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-white/10 bg-surface2 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-champagne/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-graphite-2">
        <Image
          src={car.image}
          alt={car.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        {/* Строгий outline-бейдж категории */}
        <span className="absolute start-3 top-3 rounded-[2px] border border-champagne/60 bg-graphite/50 px-2.5 py-1 text-xs font-semibold tracking-wide text-champagne backdrop-blur">
          {categoryName(car.category, locale)}
        </span>
        {/* Сдержанный индикатор наличия (не яркая таблетка) */}
        <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-[2px] bg-graphite/50 px-2.5 py-1 text-xs font-medium text-milk backdrop-blur">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${car.available ? "bg-emerald-400" : "bg-milk-dim"}`}
          />
          {car.available ? t("available") : t("unavailable")}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <h3 dir="ltr" className="font-display text-2xl font-semibold text-milk text-start sm:text-[28px]">
          {car.fullName}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          <Spec icon={<CalendarIcon className="h-4 w-4" />} label={t("year", { year: car.year })} />
          <Spec icon={<GearIcon className="h-4 w-4" />} label={translateTransmission(car.transmission, locale)} />
          <Spec icon={<FuelIcon className="h-4 w-4" />} label={translateFuel(car.fuel, locale)} />
          <Spec icon={<DrivetrainIcon className="h-4 w-4" />} label={translateDrivetrain(car.drivetrain, locale)} />
          <Spec icon={<SeatIcon className="h-4 w-4" />} label={t("seats", { count: car.seats })} />
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4">
            <div className="min-w-0">
              <p className="text-xs text-milk-dim">{t("priceFrom")}</p>
              <p className="text-3xl font-extrabold leading-none text-champagne">
                <span dir="ltr">{formatCurrency(car.dailyPrice)}</span>
                <span className="ms-1 text-sm font-semibold text-milk/60">{tc("perDay")}</span>
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-xs text-milk-dim">{t("deposit")}</p>
              <p className="text-sm font-semibold text-milk" dir="ltr">{formatCurrency(car.deposit)}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 @[15rem]:grid-cols-2">
            <ButtonLink href={detailsHref} variant="outlineOnDark" size="md" className="w-full">
              {t("details")}
            </ButtonLink>
            <ButtonLink href={`${detailsHref}#booking`} variant="champagne" size="md" className="w-full">
              {t("book")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
