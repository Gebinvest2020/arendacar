// Тестовые данные автомобилей (моки). Без базы данных.
// Фотографии — с Wikimedia Commons (лицензии CC), локально в public/images/cars.
// Каждое изображение показывает именно указанную модель (см. docs/IMAGE_SOURCES.md).

export type Transmission = "Автомат" | "Механика";
export type Fuel = "Бензин" | "Дизель" | "Гибрид" | "Электро";
export type Drivetrain = "Передний" | "Задний" | "Полный";

// Тариф по сроку аренды. maxDays: null — диапазон без верхней границы (30+).
export type PriceTier = {
  minDays: number;
  maxDays: number | null;
  pricePerDay: number; // USD/сутки
};

export type Car = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  category: string; // slug категории (см. categories.ts)
  bodyType: string; // тип кузова
  city: string;
  image: string; // основное фото
  images: string[]; // галерея (пока — только реальные фото этой модели)
  imageAlt: string;
  year: number;
  transmission: Transmission;
  fuel: Fuel;
  drivetrain: Drivetrain;
  seats: number;
  doors: number;
  luggage: number; // объём багажника, л
  engine: string;
  airConditioning: boolean;
  dailyPrice: number; // «цена от», USD — совпадает с минимальным тарифом (30+ суток)
  deposit: number; // возвратный залог, USD
  featured: boolean;
  available: boolean;
  description: string;
  features: string[];
  priceTiers: PriceTier[];
};

// Тарифы строятся по срокам: 1–2, 3–7, 8–14, 15–29, 30+ суток.
function tiers(d1: number, d3: number, d8: number, d15: number, d30: number): PriceTier[] {
  return [
    { minDays: 1, maxDays: 2, pricePerDay: d1 },
    { minDays: 3, maxDays: 7, pricePerDay: d3 },
    { minDays: 8, maxDays: 14, pricePerDay: d8 },
    { minDays: 15, maxDays: 29, pricePerDay: d15 },
    { minDays: 30, maxDays: null, pricePerDay: d30 },
  ];
}

export const cars: Car[] = [
  {
    id: "1",
    slug: "hyundai-accent",
    brand: "Hyundai",
    model: "Accent",
    fullName: "Hyundai Accent",
    category: "econom",
    bodyType: "Седан",
    city: "Одесса",
    image: "/images/cars/hyundai-accent.jpg",
    images: ["/images/cars/hyundai-accent.jpg"],
    imageAlt: "Седан Hyundai Accent эконом-класса, белого цвета",
    year: 2019,
    transmission: "Механика",
    fuel: "Бензин",
    drivetrain: "Передний",
    seats: 5,
    doors: 4,
    luggage: 389,
    engine: "1.4 л, 100 л.с.",
    airConditioning: true,
    dailyPrice: 22,
    deposit: 150,
    featured: false,
    available: true,
    description:
      "Экономичный и надёжный седан для города и коротких поездок. Простой в управлении, с невысоким расходом топлива и вместительным для класса багажником.",
    features: ["Кондиционер", "Bluetooth", "USB", "Подушки безопасности", "ABS", "Электростеклоподъёмники"],
    priceTiers: tiers(28, 26, 24, 23, 22),
  },
  {
    id: "2",
    slug: "volkswagen-polo",
    brand: "Volkswagen",
    model: "Polo",
    fullName: "Volkswagen Polo",
    category: "econom",
    bodyType: "Хэтчбек",
    city: "Одесса",
    image: "/images/cars/volkswagen-polo.jpg",
    images: ["/images/cars/volkswagen-polo.jpg"],
    imageAlt: "Хэтчбек Volkswagen Polo эконом-класса, белого цвета",
    year: 2021,
    transmission: "Механика",
    fuel: "Бензин",
    drivetrain: "Передний",
    seats: 5,
    doors: 5,
    luggage: 351,
    engine: "1.6 л, 110 л.с.",
    airConditioning: true,
    dailyPrice: 25,
    deposit: 170,
    featured: false,
    available: false,
    description:
      "Компактный и практичный хэтчбек с современным салоном. Удобен в городе, легко паркуется, экономичен на трассе.",
    features: ["Кондиционер", "Bluetooth", "USB", "Подушки безопасности", "ABS", "Мультируль"],
    priceTiers: tiers(32, 30, 28, 26, 25),
  },
  {
    id: "3",
    slug: "toyota-corolla",
    brand: "Toyota",
    model: "Corolla",
    fullName: "Toyota Corolla",
    category: "comfort",
    bodyType: "Седан",
    city: "Одесса",
    image: "/images/cars/toyota-corolla.jpg",
    images: ["/images/cars/toyota-corolla.jpg"],
    imageAlt: "Седан Toyota Corolla комфорт-класса, синего цвета",
    year: 2020,
    transmission: "Автомат",
    fuel: "Бензин",
    drivetrain: "Передний",
    seats: 5,
    doors: 4,
    luggage: 471,
    engine: "1.6 л, 122 л.с.",
    airConditioning: true,
    dailyPrice: 35,
    deposit: 250,
    featured: true,
    available: true,
    description:
      "Комфортный и надёжный седан для повседневных поездок и командировок. Плавный ход, тихий салон и автоматическая коробка передач.",
    features: ["Климат-контроль", "Bluetooth", "USB", "Камера заднего вида", "Подушки безопасности", "ABS", "Круиз-контроль"],
    priceTiers: tiers(45, 42, 39, 37, 35),
  },
  {
    id: "4",
    slug: "skoda-octavia",
    brand: "Škoda",
    model: "Octavia",
    fullName: "Škoda Octavia",
    category: "comfort",
    bodyType: "Лифтбек",
    city: "Одесса",
    image: "/images/cars/skoda-octavia.jpg",
    images: ["/images/cars/skoda-octavia.jpg"],
    imageAlt: "Лифтбек Škoda Octavia комфорт-класса, серого цвета",
    year: 2021,
    transmission: "Автомат",
    fuel: "Дизель",
    drivetrain: "Передний",
    seats: 5,
    doors: 5,
    luggage: 600,
    engine: "2.0 TDI, 150 л.с.",
    airConditioning: true,
    dailyPrice: 40,
    deposit: 300,
    featured: false,
    available: true,
    description:
      "Просторный лифтбек с большим багажником — отличный выбор для поездок с багажом и дальних маршрутов. Экономичный дизельный двигатель.",
    features: ["Климат-контроль", "Bluetooth", "USB", "Камера заднего вида", "Датчики парковки", "Подушки безопасности", "ABS", "Круиз-контроль"],
    priceTiers: tiers(52, 48, 45, 42, 40),
  },
  {
    id: "5",
    slug: "toyota-rav4",
    brand: "Toyota",
    model: "RAV4",
    fullName: "Toyota RAV4",
    category: "suv",
    bodyType: "Кроссовер",
    city: "Одесса",
    image: "/images/cars/toyota-rav4.jpg",
    images: ["/images/cars/toyota-rav4.jpg"],
    imageAlt: "Кроссовер Toyota RAV4 SUV-класса, серебристого цвета",
    year: 2020,
    transmission: "Автомат",
    fuel: "Гибрид",
    drivetrain: "Полный",
    seats: 5,
    doors: 5,
    luggage: 580,
    engine: "2.5 Hybrid, 218 л.с.",
    airConditioning: true,
    dailyPrice: 65,
    deposit: 500,
    featured: true,
    available: true,
    description:
      "Полноприводный гибридный кроссовер с высокой посадкой и низким расходом топлива. Уверенно чувствует себя и в городе, и на трассе.",
    features: ["Климат-контроль", "Bluetooth", "USB", "Камера кругового обзора", "Датчики парковки", "Подушки безопасности", "ABS", "Круиз-контроль", "Подогрев сидений"],
    priceTiers: tiers(82, 77, 72, 68, 65),
  },
  {
    id: "6",
    slug: "bmw-5-series",
    brand: "BMW",
    model: "5 Series",
    fullName: "BMW 5 Series",
    category: "business",
    bodyType: "Седан",
    city: "Одесса",
    image: "/images/cars/bmw-5-series.jpg",
    images: ["/images/cars/bmw-5-series.jpg"],
    imageAlt: "Седан BMW 5 серии бизнес-класса, тёмно-синего цвета",
    year: 2019,
    transmission: "Автомат",
    fuel: "Бензин",
    drivetrain: "Задний",
    seats: 5,
    doors: 4,
    luggage: 530,
    engine: "2.0 л, 249 л.с.",
    airConditioning: true,
    dailyPrice: 80,
    deposit: 700,
    featured: true,
    available: true,
    description:
      "Представительный бизнес-седан для деловых поездок и особых случаев. Мощный двигатель, премиальный салон и комфортная подвеска.",
    features: ["Климат-контроль", "Кожаный салон", "Bluetooth", "USB", "Камера заднего вида", "Датчики парковки", "Подушки безопасности", "ABS", "Круиз-контроль", "Подогрев сидений"],
    priceTiers: tiers(95, 90, 85, 82, 80),
  },
  {
    id: "7",
    slug: "mercedes-v-class",
    brand: "Mercedes-Benz",
    model: "V-Class",
    fullName: "Mercedes-Benz V-Class",
    category: "minivan",
    bodyType: "Минивэн",
    city: "Одесса",
    image: "/images/cars/mercedes-v-class.jpg",
    images: ["/images/cars/mercedes-v-class.jpg"],
    imageAlt: "Минивэн Mercedes-Benz V-Class, чёрного цвета",
    year: 2020,
    transmission: "Автомат",
    fuel: "Дизель",
    drivetrain: "Задний",
    seats: 7,
    doors: 5,
    luggage: 1030,
    engine: "2.0 CDI, 190 л.с.",
    airConditioning: true,
    dailyPrice: 95,
    deposit: 800,
    featured: false,
    available: true,
    description:
      "Вместительный и комфортный минивэн для больших компаний, семейных поездок и трансферов. Просторный салон на 7 мест и много места для багажа.",
    features: ["Двухзонный климат-контроль", "Кожаный салон", "Bluetooth", "USB", "Камера заднего вида", "Датчики парковки", "Подушки безопасности", "ABS", "Круиз-контроль"],
    priceTiers: tiers(115, 108, 102, 98, 95),
  },
  {
    id: "8",
    slug: "audi-q7",
    brand: "Audi",
    model: "Q7",
    fullName: "Audi Q7",
    category: "premium",
    bodyType: "Внедорожник",
    city: "Одесса",
    image: "/images/cars/audi-q7.jpg",
    images: ["/images/cars/audi-q7.jpg"],
    imageAlt: "Внедорожник Audi Q7 премиум-класса, белого цвета",
    year: 2019,
    transmission: "Автомат",
    fuel: "Бензин",
    drivetrain: "Полный",
    seats: 7,
    doors: 5,
    luggage: 890,
    engine: "3.0 TFSI, 340 л.с.",
    airConditioning: true,
    dailyPrice: 110,
    deposit: 1000,
    featured: true,
    available: true,
    description:
      "Полноразмерный премиум-внедорожник на 7 мест. Мощный двигатель, полный привод, роскошный салон и передовые системы безопасности.",
    features: ["Четырёхзонный климат-контроль", "Кожаный салон", "Панорамная крыша", "Bluetooth", "USB", "Камера кругового обзора", "Датчики парковки", "Подушки безопасности", "ABS", "Круиз-контроль", "Подогрев сидений"],
    priceTiers: tiers(135, 128, 120, 115, 110),
  },
];

// --- Селекторы данных ---

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

// Похожие авто той же категории, кроме текущего.
export function getSimilarCars(car: Car, limit = 3): Car[] {
  return cars
    .filter((c) => c.category === car.category && c.slug !== car.slug)
    .slice(0, limit);
}
