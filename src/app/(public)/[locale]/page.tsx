import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { PopularCars } from "@/components/home/PopularCars";
import { Advantages } from "@/components/home/Advantages";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Terms } from "@/components/home/Terms";
import { Contacts } from "@/components/home/Contacts";
import { FinalCta } from "@/components/home/FinalCta";
import {
  getFeaturedCars,
  getAllCategories,
  getMinimumDailyPrice,
} from "@/server/catalog";
import type { Car, CategoryView } from "@/types/car";

// Данные из БД обновляются без пересборки (ISR, 60 c).
export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let featured: Car[] = [];
  let categories: CategoryView[] = [];
  let minimumDailyPrice: number | null = null;

  try {
    [featured, categories, minimumDailyPrice] = await Promise.all([
      getFeaturedCars(6),
      getAllCategories(),
      getMinimumDailyPrice(),
    ]);
  } catch (error) {
    // Логируем только на сервере, без секретов.
    console.error(
      "Главная: не удалось загрузить данные каталога из БД:",
      error instanceof Error ? error.message : "неизвестная ошибка",
    );
  }

  return (
    <>
      <Hero minimumDailyPrice={minimumDailyPrice} />
      <PopularCars cars={featured} />
      <Categories categories={categories} />
      <Advantages />
      <HowItWorks />
      <Terms />
      <Contacts />
      <FinalCta />
    </>
  );
}
