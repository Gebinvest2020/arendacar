import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { GearIcon, FuelIcon, SeatIcon, CalendarIcon } from "./CarIcons";
import { getCategoryName } from "@/data/categories";
import { formatCurrency } from "@/lib/currency";
import type { Car } from "@/data/cars";

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
          {getCategoryName(car.category)}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
            car.available
              ? "bg-emerald-500/90 text-white"
              : "bg-ink/70 text-white"
          }`}
        >
          {car.available ? "В наличии" : "Нет в наличии"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink">{car.fullName}</h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          <Spec icon={<CalendarIcon className="h-4 w-4" />} label={`${car.year} г.`} />
          <Spec icon={<GearIcon className="h-4 w-4" />} label={car.transmission} />
          <Spec icon={<FuelIcon className="h-4 w-4" />} label={car.fuel} />
          <Spec icon={<SeatIcon className="h-4 w-4" />} label={`${car.seats} мест`} />
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
            <div className="min-w-0">
              <p className="text-xs text-ink/50">Цена от</p>
              <p className="text-2xl font-extrabold leading-none text-ink">
                {formatCurrency(car.dailyPrice)}
                <span className="ml-1 text-sm font-semibold text-ink/60">
                  /сутки
                </span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-ink/50">Залог</p>
              <p className="text-sm font-semibold text-ink">
                {formatCurrency(car.deposit)}
              </p>
            </div>
          </div>

          {/* Кнопки: grid c треками minmax(0,1fr). На узкой карточке (3 колонки
              каталога) переключаются в одну колонку через контейнерный запрос,
              чтобы текст «Забронировать» всегда помещался целиком. */}
          <div className="mt-4 @container">
            <div className="grid grid-cols-1 gap-2 @[15rem]:grid-cols-2">
              <ButtonLink
                href={detailsHref}
                variant="ghost"
                size="sm"
                className="w-full min-w-0 max-w-full"
              >
                Подробнее
              </ButtonLink>
              <ButtonLink
                href={`${detailsHref}#booking`}
                variant="primary"
                size="sm"
                className="w-full min-w-0 max-w-full"
              >
                Забронировать
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
