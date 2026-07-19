// Фильтрация и сортировка каталога + синхронизация фильтров с URL.
// Значения в URL — латиницей (shareable ссылки), в данных — русские подписи.

import type { Car, Transmission, Fuel, Drivetrain } from "@/types/car";

export type Option = { value: string; label: string };

// Опции категорий приходят из БД (через пропсы), список зависит от данных.
// Остальные опции — фиксированные enum'ы.

export const transmissionOptions: { value: string; label: Transmission }[] = [
  { value: "automatic", label: "Автомат" },
  { value: "manual", label: "Механика" },
];

export const fuelOptions: { value: string; label: Fuel }[] = [
  { value: "petrol", label: "Бензин" },
  { value: "diesel", label: "Дизель" },
  { value: "hybrid", label: "Гибрид" },
  { value: "electric", label: "Электро" },
];

export const drivetrainOptions: { value: string; label: Drivetrain }[] = [
  { value: "fwd", label: "Передний" },
  { value: "rwd", label: "Задний" },
  { value: "awd", label: "Полный" },
];

export const seatsOptions: Option[] = [
  { value: "5", label: "5 мест" },
  { value: "7", label: "7 мест" },
];

export const sortOptions: Option[] = [
  { value: "popular", label: "По популярности" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "name", label: "По названию" },
];

export type SortValue = "popular" | "price-asc" | "price-desc" | "name";

export type CatalogFilters = {
  category: string; // slug или ""
  transmission: string; // value или ""
  fuel: string;
  drivetrain: string;
  seats: string; // "5" | "7" | ""
  minPrice: string; // строка (из input) или ""
  maxPrice: string;
  onlyAvailable: boolean;
  sort: SortValue;
};

export const emptyFilters: CatalogFilters = {
  category: "",
  transmission: "",
  fuel: "",
  drivetrain: "",
  seats: "",
  minPrice: "",
  maxPrice: "",
  onlyAvailable: false,
  sort: "popular",
};

function labelForValue(options: { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label;
}

export function filterCars(list: Car[], f: CatalogFilters): Car[] {
  return list.filter((car) => {
    if (f.category && car.category !== f.category) return false;
    if (f.transmission && labelForValue(transmissionOptions, f.transmission) !== car.transmission)
      return false;
    if (f.fuel && labelForValue(fuelOptions, f.fuel) !== car.fuel) return false;
    if (f.drivetrain && labelForValue(drivetrainOptions, f.drivetrain) !== car.drivetrain)
      return false;
    if (f.seats && car.seats !== Number(f.seats)) return false;

    const min = f.minPrice ? Number(f.minPrice) : null;
    const max = f.maxPrice ? Number(f.maxPrice) : null;
    if (min !== null && !Number.isNaN(min) && car.dailyPrice < min) return false;
    if (max !== null && !Number.isNaN(max) && car.dailyPrice > max) return false;

    if (f.onlyAvailable && !car.available) return false;

    return true;
  });
}

export function sortCars(list: Car[], sort: SortValue): Car[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.dailyPrice - b.dailyPrice);
    case "price-desc":
      return copy.sort((a, b) => b.dailyPrice - a.dailyPrice);
    case "name":
      return copy.sort((a, b) => a.fullName.localeCompare(b.fullName, "ru"));
    case "popular":
    default:
      // featured первыми; порядок остальных сохраняем стабильным (как из БД).
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return 0;
      });
  }
}

export function applyFilters(list: Car[], f: CatalogFilters): Car[] {
  return sortCars(filterCars(list, f), f.sort);
}

// Сколько фильтров (кроме сортировки) активно — для бейджа «Фильтры».
export function activeFilterCount(f: CatalogFilters): number {
  let n = 0;
  if (f.category) n++;
  if (f.transmission) n++;
  if (f.fuel) n++;
  if (f.drivetrain) n++;
  if (f.seats) n++;
  if (f.minPrice) n++;
  if (f.maxPrice) n++;
  if (f.onlyAvailable) n++;
  return n;
}

const SORT_VALUES: SortValue[] = ["popular", "price-asc", "price-desc", "name"];

// URL -> фильтры
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const get = (k: string) => params.get(k) ?? "";
  const sortRaw = get("sort");
  const sort = (SORT_VALUES as string[]).includes(sortRaw)
    ? (sortRaw as SortValue)
    : "popular";
  return {
    category: get("category"),
    transmission: get("transmission"),
    fuel: get("fuel"),
    drivetrain: get("drivetrain"),
    seats: get("seats"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    onlyAvailable: get("available") === "1",
    sort,
  };
}

// Фильтры -> query-строка (только непустые значения).
export function filtersToQuery(f: CatalogFilters): string {
  const p = new URLSearchParams();
  if (f.category) p.set("category", f.category);
  if (f.transmission) p.set("transmission", f.transmission);
  if (f.fuel) p.set("fuel", f.fuel);
  if (f.drivetrain) p.set("drivetrain", f.drivetrain);
  if (f.seats) p.set("seats", f.seats);
  if (f.minPrice) p.set("minPrice", f.minPrice);
  if (f.maxPrice) p.set("maxPrice", f.maxPrice);
  if (f.onlyAvailable) p.set("available", "1");
  if (f.sort && f.sort !== "popular") p.set("sort", f.sort);
  return p.toString();
}
