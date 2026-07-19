"use client";

import {
  categoryOptions,
  transmissionOptions,
  fuelOptions,
  drivetrainOptions,
  seatsOptions,
  type CatalogFilters as Filters,
} from "@/lib/car-filters";

type Option = { value: string; label: string };

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
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink/60">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CatalogFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const priceField =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div className="space-y-4">
      <SelectField
        id="filter-category"
        label="Категория"
        value={filters.category}
        options={categoryOptions}
        placeholder="Все категории"
        onChange={(v) => onChange({ category: v })}
      />
      <SelectField
        id="filter-transmission"
        label="Коробка передач"
        value={filters.transmission}
        options={transmissionOptions}
        placeholder="Любая"
        onChange={(v) => onChange({ transmission: v })}
      />
      <SelectField
        id="filter-fuel"
        label="Тип топлива"
        value={filters.fuel}
        options={fuelOptions}
        placeholder="Любой"
        onChange={(v) => onChange({ fuel: v })}
      />
      <SelectField
        id="filter-drivetrain"
        label="Привод"
        value={filters.drivetrain}
        options={drivetrainOptions}
        placeholder="Любой"
        onChange={(v) => onChange({ drivetrain: v })}
      />
      <SelectField
        id="filter-seats"
        label="Количество мест"
        value={filters.seats}
        options={seatsOptions}
        placeholder="Любое"
        onChange={(v) => onChange({ seats: v })}
      />

      <div>
        <span className="mb-1 block text-xs font-semibold text-ink/60">
          Цена за сутки, $
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-min-price" className="sr-only">
            Минимальная цена
          </label>
          <input
            id="filter-min-price"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="от"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className={priceField}
          />
          <span className="text-ink/40">—</span>
          <label htmlFor="filter-max-price" className="sr-only">
            Максимальная цена
          </label>
          <input
            id="filter-max-price"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="до"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className={priceField}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink">
        <input
          type="checkbox"
          checked={filters.onlyAvailable}
          onChange={(e) => onChange({ onlyAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-line text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        Только доступные
      </label>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Очистить фильтры
      </button>
    </div>
  );
}
