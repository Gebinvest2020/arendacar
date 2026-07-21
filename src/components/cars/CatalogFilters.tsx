"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  transmissionOptions,
  fuelOptions,
  drivetrainOptions,
  seatsOptions,
  type CatalogFilters as Filters,
  type Option,
} from "@/lib/car-filters";
import { categoryName } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";

function SelectField({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink/60">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// Ключи переводов опций по latin-значению.
const TR: Record<string, string> = { automatic: "trAutomatic", manual: "trManual" };
const FU: Record<string, string> = { petrol: "fuPetrol", diesel: "fuDiesel", hybrid: "fuHybrid", electric: "fuElectric" };
const DT: Record<string, string> = { fwd: "dtFwd", rwd: "dtRwd", awd: "dtAwd" };

export function CatalogFilters({
  filters,
  categoryOptions,
  onChange,
  onReset,
}: {
  filters: Filters;
  categoryOptions: Option[];
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const t = useTranslations("catalog");
  const locale = useLocale() as Locale;

  const priceField =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  const categoryOpts = categoryOptions.map((o) => ({ value: o.value, label: categoryName(o.value, locale) }));
  const transmissionOpts = transmissionOptions.map((o) => ({ value: o.value, label: t(TR[o.value]) }));
  const fuelOpts = fuelOptions.map((o) => ({ value: o.value, label: t(FU[o.value]) }));
  const drivetrainOpts = drivetrainOptions.map((o) => ({ value: o.value, label: t(DT[o.value]) }));
  const seatsOpts = seatsOptions.map((o) => ({ value: o.value, label: t("seatsOption", { count: Number(o.value) }) }));

  return (
    <div className="space-y-4">
      <SelectField id="filter-category" label={t("categoryLabel")} value={filters.category} options={categoryOpts} placeholder={t("anyCategory")} onChange={(v) => onChange({ category: v })} />
      <SelectField id="filter-transmission" label={t("transmissionLabel")} value={filters.transmission} options={transmissionOpts} placeholder={t("anyTransmission")} onChange={(v) => onChange({ transmission: v })} />
      <SelectField id="filter-fuel" label={t("fuelLabel")} value={filters.fuel} options={fuelOpts} placeholder={t("anyFuel")} onChange={(v) => onChange({ fuel: v })} />
      <SelectField id="filter-drivetrain" label={t("drivetrainLabel")} value={filters.drivetrain} options={drivetrainOpts} placeholder={t("anyDrivetrain")} onChange={(v) => onChange({ drivetrain: v })} />
      <SelectField id="filter-seats" label={t("seatsLabel")} value={filters.seats} options={seatsOpts} placeholder={t("anySeats")} onChange={(v) => onChange({ seats: v })} />

      <div>
        <span className="mb-1 block text-xs font-semibold text-ink/60">{t("priceRange")}</span>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-min-price" className="sr-only">{t("priceMinAria")}</label>
          <input id="filter-min-price" type="number" inputMode="numeric" min={0} placeholder={t("priceMin")} value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} className={priceField} dir="ltr" />
          <span className="text-ink/40">—</span>
          <label htmlFor="filter-max-price" className="sr-only">{t("priceMaxAria")}</label>
          <input id="filter-max-price" type="number" inputMode="numeric" min={0} placeholder={t("priceMax")} value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} className={priceField} dir="ltr" />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink">
        <input type="checkbox" checked={filters.onlyAvailable} onChange={(e) => onChange({ onlyAvailable: e.target.checked })} className="h-4 w-4 rounded border-line text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" />
        {t("onlyAvailable")}
      </label>

      <button type="button" onClick={onReset} className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        {t("clearFilters")}
      </button>
    </div>
  );
}
