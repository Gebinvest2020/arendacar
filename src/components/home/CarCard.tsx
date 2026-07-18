import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { Car } from "@/data/cars";

/* Компактные иконки характеристик */
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 7l2.6 1.5M17.2 15.5 19.8 17M4.2 17l2.6-1.5M17.2 8.5 19.8 7" />
    </svg>
  );
}
function FuelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12" />
      <path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-3-3" />
      <path d="M6 9h6" />
    </svg>
  );
}
function SeatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 19v-2a3 3 0 0 1 3-3h6M6 5v6a3 3 0 0 0 3 3M18 5v14" />
    </svg>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-ink/70">
      <span className="text-accent-dark">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function CarCard({ car }: { car: Car }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Реальное фото автомобиля */}
      <div className="relative aspect-[16/10] w-full bg-muted">
        <Image
          src={car.image}
          alt={car.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          {car.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink">{car.name}</h3>

        {/* Характеристики с иконками */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          <Spec icon={<GearIcon />} label={car.transmission} />
          <Spec icon={<FuelIcon />} label={car.fuel} />
          <Spec icon={<SeatIcon />} label={`${car.seats} мест`} />
        </div>

        {/* Цена — главный акцент. Прижата к низу для одинаковой высоты. */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-xs text-ink/50">Цена от</p>
              <p className="text-2xl font-extrabold leading-none text-ink">
                {car.pricePerDay.toLocaleString("ru-RU")}
                <span className="ml-1 text-sm font-semibold text-ink/60">
                  грн/сутки
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink/50">Залог</p>
              <p className="text-sm font-semibold text-ink">
                {car.deposit.toLocaleString("ru-RU")} ₴
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <ButtonLink href="#cars" variant="ghost" size="md" className="flex-1">
              Подробнее
            </ButtonLink>
            <ButtonLink href="#cta" variant="primary" size="md" className="flex-1">
              Забронировать
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
