// Тестовые категории автомобилей.

export type Category = {
  slug: string;
  name: string;
  description: string;
  priceFrom: number; // USD/сутки, "от" — не ниже минимальной цены авто категории
};

export const categories: Category[] = [
  {
    slug: "econom",
    name: "Эконом",
    description: "Недорогие и экономичные авто для города",
    priceFrom: 22,
  },
  {
    slug: "comfort",
    name: "Комфорт",
    description: "Просторнее и удобнее для поездок",
    priceFrom: 35,
  },
  {
    slug: "business",
    name: "Бизнес",
    description: "Представительный класс для деловых поездок",
    priceFrom: 80,
  },
  {
    slug: "suv",
    name: "SUV",
    description: "Кроссоверы и внедорожники",
    priceFrom: 65,
  },
  {
    slug: "minivan",
    name: "Минивэн",
    description: "Вместительные авто для больших компаний",
    priceFrom: 95,
  },
  {
    slug: "premium",
    name: "Премиум",
    description: "Автомобили высокого класса",
    priceFrom: 110,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Отображаемое имя категории по её slug (с запасным значением).
export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}
