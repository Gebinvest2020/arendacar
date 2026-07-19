import { formatCurrency } from "@/lib/currency";
import type { Car } from "@/types/car";

function periodLabel(minDays: number, maxDays: number | null): string {
  if (maxDays === null) return `${minDays}+ суток`;
  if (minDays === maxDays) return `${minDays} сутки`;
  return `${minDays}–${maxDays} суток`;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Карточка-обёртка колонки (единый стиль).
function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

export function CarParameters({ car }: { car: Car }) {
  const specs: { label: string; value: string }[] = [
    { label: "Коробка передач", value: car.transmission },
    { label: "Топливо", value: car.fuel },
    { label: "Тип кузова", value: car.bodyType },
    { label: "Количество мест", value: `${car.seats}` },
    { label: "Количество дверей", value: `${car.doors}` },
    { label: "Год выпуска", value: `${car.year}` },
    { label: "Класс автомобиля", value: car.categoryName },
    { label: "Привод", value: car.drivetrain },
    { label: "Двигатель", value: car.engine },
    { label: "Багажник", value: `${car.luggage} л` },
    { label: "Кондиционер", value: car.airConditioning ? "Есть" : "Нет" },
  ];

  return (
    <section aria-labelledby="params-heading" className="rounded-3xl bg-muted/50 p-5 sm:p-6 lg:p-8">
      <h2
        id="params-heading"
        className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        Параметры автомобиля
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Цены за аренду */}
        <Column title="Цены за аренду">
          <dl className="space-y-1">
            {car.priceTiers.map((tier, i) => (
              <div
                key={tier.minDays}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                  i % 2 === 1 ? "bg-muted/60" : ""
                }`}
              >
                <dt className="text-ink/70">{periodLabel(tier.minDays, tier.maxDays)}</dt>
                <dd className="font-bold text-ink">{formatCurrency(tier.pricePerDay)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-sm font-medium text-ink">Залог</p>
              <p className="text-xs text-ink/50">возвратный</p>
            </div>
            <p className="text-lg font-extrabold text-ink">{formatCurrency(car.deposit)}</p>
          </div>
        </Column>

        {/* 2. Характеристики */}
        <Column title="Характеристики">
          <dl className="space-y-1">
            {specs.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  i % 2 === 1 ? "bg-muted/60" : ""
                }`}
              >
                <dt className="text-ink/60">{row.label}</dt>
                <dd className="text-right font-semibold text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Column>

        {/* 3. Комплектация */}
        <Column title="Комплектация">
          <ul className="space-y-1">
            {car.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm"
              >
                <span className="text-ink">{feature}</span>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-dark">
                  <CheckIcon />
                </span>
              </li>
            ))}
          </ul>
        </Column>
      </div>
    </section>
  );
}
