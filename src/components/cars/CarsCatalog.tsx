"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogCarCard } from "./CatalogCarCard";
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

export function CarsCatalog({
  cars,
  categories,
  initialFilters,
}: {
  cars: Car[];
  categories: CategoryOption[];
  initialFilters: Filters;
}) {
  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }));
  const router = useRouter();
  const pathname = usePathname();

  // Начальные фильтры приходят с сервера (из URL). Дальше локальное состояние
  // ведёт и синхронно пишет в URL, чтобы ссылку можно было скопировать.
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
      {/* Панель фильтров */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {/* Переключатель фильтров на мобильном */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="catalog-filters"
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink lg:hidden"
        >
          <span>
            Фильтры{activeCount > 0 ? ` (${activeCount})` : ""}
          </span>
          <span className="text-ink/50">{showFilters ? "Скрыть" : "Показать"}</span>
        </button>

        <div
          id="catalog-filters"
          className={`${showFilters ? "block" : "hidden"} rounded-2xl border border-line bg-muted/40 p-4 lg:block`}
        >
          <CatalogFilters
            filters={filters}
            categoryOptions={categoryOptions}
            onChange={update}
            onReset={reset}
          />
        </div>
      </aside>

      {/* Результаты */}
      <div className="mt-6 lg:mt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink/70" aria-live="polite">
            Найдено автомобилей: <span className="font-bold text-ink">{results.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-sm text-ink/60">
              Сортировка
            </label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortValue })}
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((car) => (
              <CatalogCarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <p className="text-lg font-semibold text-ink">Ничего не найдено</p>
            <p className="mt-2 text-sm text-ink/60">
              Попробуйте изменить или сбросить фильтры.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-ink transition-colors hover:bg-accent-dark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Очистить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
