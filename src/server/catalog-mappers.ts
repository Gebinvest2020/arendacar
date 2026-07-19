// Преобразование Prisma-записей в публичный UI-тип Car.
// Enum-коды БД → русские подписи. Только чистые функции, без запросов к БД.

import type {
  Transmission as PrismaTransmission,
  FuelType as PrismaFuel,
  Drivetrain as PrismaDrivetrain,
} from "@/generated/prisma/client";
import type { Car, Transmission, Fuel, Drivetrain, PriceTier } from "@/types/car";

// Безопасный локальный fallback (не фото другой машины).
const PLACEHOLDER_IMAGE = "/images/cars/placeholder.svg";

const transmissionMap: Record<PrismaTransmission, Transmission> = {
  MANUAL: "Механика",
  AUTOMATIC: "Автомат",
};
const fuelMap: Record<PrismaFuel, Fuel> = {
  PETROL: "Бензин",
  DIESEL: "Дизель",
  HYBRID: "Гибрид",
  ELECTRIC: "Электро",
};
const drivetrainMap: Record<PrismaDrivetrain, Drivetrain> = {
  FWD: "Передний",
  RWD: "Задний",
  AWD: "Полный",
};

// Форма Prisma-записи с нужными связями (описываем структурно, без жёсткой зависимости).
type PrismaCarWithRelations = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  bodyType: string;
  city: { name: string };
  category: { slug: string; name: string };
  photos: { url: string; alt: string; isCover: boolean; sortOrder: number }[];
  imageAlt: string;
  year: number;
  transmission: PrismaTransmission;
  fuel: PrismaFuel;
  drivetrain: PrismaDrivetrain;
  seats: number;
  doors: number;
  luggage: number;
  engine: string;
  airConditioning: boolean;
  dailyPrice: number;
  deposit: number;
  featured: boolean;
  available: boolean;
  description: string;
  features: string[];
  priceTiers: { minDays: number; maxDays: number | null; pricePerDay: number }[];
};

export function mapCar(car: PrismaCarWithRelations): Car {
  const photos = [...car.photos].sort((a, b) => a.sortOrder - b.sortOrder);
  const cover = photos.find((p) => p.isCover) ?? photos[0];

  const image = cover?.url ?? PLACEHOLDER_IMAGE;
  const images = photos.length > 0 ? photos.map((p) => p.url) : [PLACEHOLDER_IMAGE];
  const imageAlt = cover?.alt ?? car.imageAlt ?? `Фото автомобиля ${car.fullName}`;

  const priceTiers: PriceTier[] = [...car.priceTiers]
    .sort((a, b) => a.minDays - b.minDays)
    .map((t) => ({
      minDays: t.minDays,
      maxDays: t.maxDays,
      pricePerDay: t.pricePerDay,
    }));

  return {
    id: car.id,
    slug: car.slug,
    brand: car.brand,
    model: car.model,
    fullName: car.fullName,
    category: car.category.slug,
    categoryName: car.category.name,
    bodyType: car.bodyType,
    city: car.city.name,
    image,
    images,
    imageAlt,
    year: car.year,
    transmission: transmissionMap[car.transmission],
    fuel: fuelMap[car.fuel],
    drivetrain: drivetrainMap[car.drivetrain],
    seats: car.seats,
    doors: car.doors,
    luggage: car.luggage,
    engine: car.engine,
    airConditioning: car.airConditioning,
    dailyPrice: car.dailyPrice,
    deposit: car.deposit,
    featured: car.featured,
    available: car.available,
    description: car.description,
    features: car.features,
    priceTiers,
  };
}
