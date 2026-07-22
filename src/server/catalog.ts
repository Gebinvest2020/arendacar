import "server-only";

// Слой доступа к каталогу. Единственное место с Prisma-запросами для публичных
// страниц. Запросы выполняются только при вызове функций (не при импорте).

import { prisma } from "@/lib/db";
import { mapCar } from "./catalog-mappers";
import type { Car, CategoryView } from "@/types/car";

const carInclude = {
  category: true,
  city: true,
  photos: true,
  priceTiers: true,
} as const;

// Все ДОСТУПНЫЕ авто в порядке добавления (стабильный порядок для «популярности»).
// Публичный каталог показывает только available=true (неактивные скрыты).
export async function getAllCars(): Promise<Car[]> {
  const rows = await prisma.car.findMany({
    where: { available: true },
    include: carInclude,
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  return rows.map(mapCar);
}

// Популярные: сначала featured, затем добираем остальными до limit.
export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const all = await getAllCars();
  const featured = all.filter((c) => c.featured);
  const rest = all.filter((c) => !c.featured);
  return [...featured, ...rest].slice(0, limit);
}

// Только доступное авто по slug (неактивные — как несуществующие, страница 404).
export async function getCarBySlug(slug: string): Promise<Car | null> {
  const row = await prisma.car.findFirst({
    where: { slug, available: true },
    include: carInclude,
  });
  return row ? mapCar(row) : null;
}

// Похожие ДОСТУПНЫЕ авто той же категории, кроме текущего.
export async function getSimilarCars(car: Car, limit = 3): Promise<Car[]> {
  const rows = await prisma.car.findMany({
    where: { available: true, category: { slug: car.category }, slug: { not: car.slug } },
    include: carInclude,
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: limit,
  });
  return rows.map(mapCar);
}

// Категории с вычисленным priceFrom (минимальная dailyPrice ДОСТУПНЫХ авто категории).
export async function getAllCategories(): Promise<CategoryView[]> {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { cars: { where: { available: true }, select: { dailyPrice: true } } },
  });
  return rows.map((c) => {
    const prices = c.cars.map((car) => car.dailyPrice);
    const priceFrom = prices.length > 0 ? Math.min(...prices) : 0;
    return { slug: c.slug, name: c.name, description: c.description, priceFrom };
  });
}

// Минимальная цена за сутки по ДОСТУПНОМУ каталогу (для Hero).
export async function getMinimumDailyPrice(): Promise<number | null> {
  const agg = await prisma.car.aggregate({
    where: { available: true },
    _min: { dailyPrice: true },
  });
  return agg._min.dailyPrice ?? null;
}

// Все slug ДОСТУПНЫХ авто — для generateStaticParams.
export async function getAllCarSlugs(): Promise<string[]> {
  const rows = await prisma.car.findMany({ where: { available: true }, select: { slug: true } });
  return rows.map((r) => r.slug);
}
