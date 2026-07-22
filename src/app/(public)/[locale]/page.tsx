import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { FleetCollection } from "@/components/home/FleetCollection";
import { PopularCars } from "@/components/home/PopularCars";
import { Advantages } from "@/components/home/Advantages";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Terms } from "@/components/home/Terms";
import { Contacts } from "@/components/home/Contacts";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedCars, getMinimumDailyPrice } from "@/server/catalog";
import type { Car } from "@/types/car";

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
  let minimumDailyPrice: number | null = null;

  try {
    [featured, minimumDailyPrice] = await Promise.all([
      getFeaturedCars(6),
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
      <Reveal><PopularCars cars={featured} /></Reveal>
      <Reveal><FleetCollection cars={featured} /></Reveal>
      <Reveal><Advantages /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><Terms /></Reveal>
      <Reveal><Contacts /></Reveal>
      <Reveal><FinalCta /></Reveal>
    </>
  );
}
