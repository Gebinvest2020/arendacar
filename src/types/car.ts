// Публичный тип автомобиля для UI-компонентов (единый источник типа).
// Данные приходят из БД (Prisma) через src/server/catalog.ts и мэппер.
// Значения transmission/fuel/drivetrain — русские подписи для отображения.

export type Transmission = "Автомат" | "Механика";
export type Fuel = "Бензин" | "Дизель" | "Гибрид" | "Электро";
export type Drivetrain = "Передний" | "Задний" | "Полный";

export type PriceTier = {
  minDays: number;
  maxDays: number | null; // null = диапазон без верхней границы (30+)
  pricePerDay: number; // USD/сутки
};

export type Car = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  category: string; // slug категории
  categoryName: string; // отображаемое имя категории
  bodyType: string;
  city: string; // имя города
  image: string; // основное (cover) фото
  images: string[]; // галерея
  imageAlt: string;
  year: number;
  transmission: Transmission;
  fuel: Fuel;
  drivetrain: Drivetrain;
  seats: number;
  doors: number;
  luggage: number;
  engine: string;
  airConditioning: boolean;
  dailyPrice: number; // USD, «цена от» (минимальный тариф)
  deposit: number; // USD, возвратный залог
  featured: boolean;
  available: boolean;
  description: string;
  features: string[];
  priceTiers: PriceTier[];
};

// Категория для публичных блоков (priceFrom вычисляется, в БД не хранится).
export type CategoryView = {
  slug: string;
  name: string;
  description: string;
  priceFrom: number;
};
