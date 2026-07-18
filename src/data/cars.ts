// Тестовые данные автомобилей (моки).
// Пока без базы данных. Фотографии — с Wikimedia Commons (лицензии CC), скачаны
// локально в public/images/cars. Каждое изображение показывает именно указанную
// модель. Источники и лицензии перечислены в docs/IMAGE_SOURCES.md.

export type Transmission = "Автомат" | "Механика";
export type Fuel = "Бензин" | "Дизель" | "Гибрид" | "Электро";

export type Car = {
  id: string;
  slug: string;
  name: string;
  category: string; // название класса (см. categories.ts)
  transmission: Transmission;
  fuel: Fuel;
  seats: number;
  pricePerDay: number; // грн/сутки
  deposit: number; // залог, грн
  image: string; // путь к локальному изображению
  alt: string; // alt-текст
};

export const cars: Car[] = [
  {
    id: "1",
    slug: "hyundai-accent",
    name: "Hyundai Accent",
    category: "Эконом",
    transmission: "Механика",
    fuel: "Бензин",
    seats: 5,
    pricePerDay: 850,
    deposit: 4500,
    image: "/images/cars/hyundai-accent.jpg",
    alt: "Седан Hyundai Accent эконом-класса, белого цвета",
  },
  {
    id: "2",
    slug: "volkswagen-polo",
    name: "Volkswagen Polo",
    category: "Эконом",
    transmission: "Механика",
    fuel: "Бензин",
    seats: 5,
    pricePerDay: 950,
    deposit: 5000,
    image: "/images/cars/volkswagen-polo.jpg",
    alt: "Хэтчбек Volkswagen Polo эконом-класса, белого цвета",
  },
  {
    id: "3",
    slug: "toyota-corolla",
    name: "Toyota Corolla",
    category: "Комфорт",
    transmission: "Автомат",
    fuel: "Бензин",
    seats: 5,
    pricePerDay: 1400,
    deposit: 8000,
    image: "/images/cars/toyota-corolla.jpg",
    alt: "Седан Toyota Corolla комфорт-класса, синего цвета",
  },
  {
    id: "4",
    slug: "skoda-octavia",
    name: "Skoda Octavia",
    category: "Комфорт",
    transmission: "Автомат",
    fuel: "Дизель",
    seats: 5,
    pricePerDay: 1600,
    deposit: 9000,
    image: "/images/cars/skoda-octavia.jpg",
    alt: "Лифтбек Skoda Octavia комфорт-класса, серого цвета",
  },
  {
    id: "5",
    slug: "toyota-rav4",
    name: "Toyota RAV4",
    category: "SUV",
    transmission: "Автомат",
    fuel: "Гибрид",
    seats: 5,
    pricePerDay: 2600,
    deposit: 15000,
    image: "/images/cars/toyota-rav4.jpg",
    alt: "Кроссовер Toyota RAV4 SUV-класса, серебристого цвета",
  },
  {
    id: "6",
    slug: "bmw-5-series",
    name: "BMW 5 Series",
    category: "Бизнес",
    transmission: "Автомат",
    fuel: "Бензин",
    seats: 5,
    pricePerDay: 3200,
    deposit: 20000,
    image: "/images/cars/bmw-5-series.jpg",
    alt: "Седан BMW 5 серии бизнес-класса, тёмно-синего цвета",
  },
  {
    id: "7",
    slug: "mercedes-v-class",
    name: "Mercedes-Benz V-Class",
    category: "Минивэн",
    transmission: "Автомат",
    fuel: "Дизель",
    seats: 7,
    pricePerDay: 3800,
    deposit: 22000,
    image: "/images/cars/mercedes-v-class.jpg",
    alt: "Минивэн Mercedes-Benz V-Class, чёрного цвета",
  },
  {
    id: "8",
    slug: "audi-q7",
    name: "Audi Q7",
    category: "Премиум",
    transmission: "Автомат",
    fuel: "Бензин",
    seats: 7,
    pricePerDay: 4500,
    deposit: 30000,
    image: "/images/cars/audi-q7.jpg",
    alt: "Внедорожник Audi Q7 премиум-класса, белого цвета",
  },
];
