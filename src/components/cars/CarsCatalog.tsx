"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { CatalogFilters } from "./CatalogFilters";
import { PremiumCarCard } from "./PremiumCarCard";
import {
  applyFilters,
  filtersToQuery,
  activeFilterCount,
  emptyFilters,
  sortOptions,
  type CatalogFilters as Filters,
  type SortValue,
} from "@/lib/car-filters";
import type { Car } from "@/types/car";

type CategoryOption = { slug: string; name: string };

const SORT_KEY: Record<SortValue, string> = {
  popular: "sortPopular",
  "price-asc": "sortPriceAsc",
  "price-desc": "sortPriceDesc",
  name: "sortName",
};

export function CarsCatalog({
  cars,
  categories,
  initialFilters,
}: {
  cars: Car[];
  categories: CategoryOption[];
  initialFilters: Filters;
}) {
  const t = useTranslations("catalog");
  // Показываем в фильтре только категории, у которых есть машины (пустые скрываем —
  // без изменения данных/запросов, чисто визуальный фильтр опций).
  const categoryOptions = categories
    .filter((c) => cars.some((car) => car.category === c.slug))
    .map((c) => ({ value: c.slug, label: c.name }));
  const router = useRouter();
  const pathname = usePathname(); // включает /{locale}/cars — locale сохраняется

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  function pushFilters(next: Filters) {
    setFilters(next);
    const qs = filtersToQuery(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  function update(patch: Partial<Filters>) {
    pushFilters({ ...filters, ...patch });
  }
  function reset() {
    pushFilters(emptyFilters);
  }

  const results = applyFilters(cars, filters);
  const activeCount = activeFilterCount(filters);

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="catalog-filters"
          className="mb-4 flex min-h-11 w-full items-center justify-between rounded-[3px] border border-white/12 bg-surface2 px-4 py-3 text-sm font-semibold text-milk transition-colors hover:border-white/25 lg:hidden"
        >
          <span>{t("filters")}{activeCount > 0 ? ` (${activeCount})` : ""}</span>
          <span className="text-champagne">{showFilters ? t("hide") : t("show")}</span>
        </button>

        <div
          id="catalog-filters"
          className={`${showFilters ? "block" : "hidden"} dr-panel bg-graphite-2 p-4 lg:block`}
        >
          <CatalogFilters
            filters={filters}
            categoryOptions={categoryOptions}
            onChange={update}
            onReset={reset}
          />
        </div>
      </aside>

      <div className="mt-6 lg:mt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-milk/70" aria-live="polite">
            {t("found")} <span className="font-bold text-milk">{results.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-sm text-milk-dim">{t("sortLabel")}</label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="h-10 rounded-[3px] border border-white/12 bg-white/5 px-3 text-sm font-medium text-milk [color-scheme:dark] transition-colors hover:border-white/25 focus-visible:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/40"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {t(SORT_KEY[o.value as SortValue])}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {results.map((car) => (
              <PremiumCarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="dr-panel mt-10 p-10 text-center">
            <p className="font-display text-2xl font-semibold text-milk">{t("notFound")}</p>
            <p className="mt-2 text-sm text-milk-dim">{t("notFoundText")}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[3px] bg-champagne px-6 text-sm font-semibold text-graphite transition-colors hover:bg-champagne-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
            >
              {t("clearFilters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
