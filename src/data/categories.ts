// Тестовые категории автомобилей.

export type Category = {
  slug: string;
  name: string;
  description: string;
  priceFrom: number; // грн/сутки, "от"
};

export const categories: Category[] = [
  {
    slug: "econom",
    name: "Эконом",
    description: "Недорогие и экономичные авто для города",
    priceFrom: 850,
  },
  {
    slug: "comfort",
    name: "Комфорт",
    description: "Просторнее и удобнее для поездок",
    priceFrom: 1400,
  },
  {
    slug: "business",
    name: "Бизнес",
    description: "Представительный класс для деловых поездок",
    priceFrom: 3200,
  },
  {
    slug: "suv",
    name: "SUV",
    description: "Кроссоверы и внедорожники",
    priceFrom: 2600,
  },
  {
    slug: "minivan",
    name: "Минивэн",
    description: "Вместительные авто для больших компаний",
    priceFrom: 3800,
  },
  {
    slug: "premium",
    name: "Премиум",
    description: "Автомобили высокого класса",
    priceFrom: 4500,
  },
];
