import { useLocale, useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/currency";
import {
  categoryName,
  translateTransmission,
  translateFuel,
  translateDrivetrain,
  translateBodyType,
  translateFeatures,
} from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import type { Car } from "@/types/car";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

export function CarParameters({ car }: { car: Car }) {
  const t = useTranslations("carPage");
  const locale = useLocale() as Locale;

  function periodLabel(minDays: number, maxDays: number | null): string {
    if (maxDays === null) return t("periodPlus", { days: minDays });
    if (minDays === maxDays) return t("periodOne", { days: minDays });
    return t("periodRange", { min: minDays, max: maxDays });
  }

  const specs: { label: string; value: string; ltr?: boolean }[] = [
    { label: t("specTransmission"), value: translateTransmission(car.transmission, locale) },
    { label: t("specFuel"), value: translateFuel(car.fuel, locale) },
    { label: t("specBody"), value: translateBodyType(car.bodyType, locale) },
    { label: t("specSeats"), value: `${car.seats}`, ltr: true },
    { label: t("specDoors"), value: `${car.doors}`, ltr: true },
    { label: t("specYear"), value: `${car.year}`, ltr: true },
    { label: t("specClass"), value: categoryName(car.category, locale) },
    { label: t("specDrivetrain"), value: translateDrivetrain(car.drivetrain, locale) },
    { label: t("specEngine"), value: car.engine, ltr: true },
    { label: t("specLuggage"), value: t("luggageValue", { liters: car.luggage }), ltr: true },
    { label: t("specAir"), value: car.airConditioning ? t("yes") : t("no") },
  ];

  const features = translateFeatures(car.features, locale);

  return (
    <section aria-labelledby="params-heading" className="rounded-3xl bg-muted/50 p-5 sm:p-6 lg:p-8">
      <h2 id="params-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{t("paramsTitle")}</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Column title={t("pricesTitle")}>
          <dl className="space-y-1">
            {car.priceTiers.map((tier, i) => (
              <div key={tier.minDays} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${i % 2 === 1 ? "bg-muted/60" : ""}`}>
                <dt className="text-ink/70">{periodLabel(tier.minDays, tier.maxDays)}</dt>
                <dd className="font-bold text-ink" dir="ltr">{formatCurrency(tier.pricePerDay)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-sm font-medium text-ink">{t("deposit")}</p>
              <p className="text-xs text-ink/50">{t("depositReturnableShort")}</p>
            </div>
            <p className="text-lg font-extrabold text-ink" dir="ltr">{formatCurrency(car.deposit)}</p>
          </div>
        </Column>

        <Column title={t("specsTitle")}>
          <dl className="space-y-1">
            {specs.map((row, i) => (
              <div key={row.label} className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${i % 2 === 1 ? "bg-muted/60" : ""}`}>
                <dt className="text-ink/60">{row.label}</dt>
                <dd className="text-end font-semibold text-ink" dir={row.ltr ? "ltr" : undefined}>{row.value}</dd>
              </div>
            ))}
          </dl>
        </Column>

        <Column title={t("featuresTitle")}>
          <ul className="space-y-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm">
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
