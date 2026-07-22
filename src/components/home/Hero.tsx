"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { translateCity } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import { formatCurrency } from "@/lib/currency";

// Главное фото Hero — локальное, реальной машины автопарка (Porsche Cayenne,
// чёрный front 3/4 — лучший кадр для тёмной showroom-сцены). Водяной знак сохранён.
const HERO_IMAGE = "/cars/porsche-cayenne/01-main.webp";

export function Hero({ minimumDailyPrice }: { minimumDailyPrice: number | null }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const perks = [t("hero.perk1"), t("hero.perk2"), t("hero.perk3")];
  const router = useRouter();
  const cityLabel = translateCity(site.defaultCity, locale);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");

  // Форма без сервера: переводит в каталог. Логика/маршрутизация не меняются.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/cars");
  }

  const fieldClass =
    "h-11 w-full rounded-[3px] border border-white/12 bg-white/5 px-3 text-sm text-milk transition-colors placeholder:text-milk-dim hover:border-white/25 focus-visible:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/40 [color-scheme:dark]";
  const labelClass = "mb-1 block text-xs font-medium text-milk-dim";

  return (
    <section id="hero" className="relative overflow-hidden bg-graphite text-milk">
      {/* Полноэкранная автомобильная сцена (не зеркалим фото) */}
      <div className="absolute inset-0" dir="ltr" aria-hidden="true">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Тёмный overlay для читаемости — но не «убиваем» фото */}
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/20 to-transparent" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-2xl animate-rise">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
            <span aria-hidden="true" className="h-px w-6 bg-champagne/70" />
            {t("hero.badge", { city: cityLabel })}
          </span>

          <h1 className="font-display mt-5 text-[clamp(40px,7vw,88px)] font-semibold leading-[0.98] tracking-tight text-milk">
            {t("hero.title")}
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-milk/75 sm:text-lg">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              type="button"
              variant="champagne"
              size="lg"
              onClick={() => router.push("/cars")}
              className="px-8"
            >
              {t("common.pickCar")}
              <span aria-hidden="true">→</span>
            </Button>

            {minimumDailyPrice !== null && (
              <p className="text-sm text-milk-dim">
                {t("hero.rent")}:{" "}
                <span className="font-semibold text-milk">
                  {t("common.from")} <span dir="ltr">{formatCurrency(minimumDailyPrice)}</span>
                  {t("common.perDay")}
                </span>
              </p>
            )}
          </div>

          {/* Компактная тёмная панель поиска (визуал; логика без изменений) */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-[4px] border border-white/10 bg-graphite-2/80 p-4 backdrop-blur sm:p-5"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-1">
                <span className={labelClass}>{t("common.city")}</span>
                {/* Город фиксирован — Одесса. */}
                <div
                  className={`${fieldClass} flex items-center gap-1.5 font-medium`}
                  aria-label={t("common.city")}
                >
                  <span aria-hidden="true" className="text-champagne">◈</span>
                  {cityLabel}
                </div>
              </div>
              <div>
                <label htmlFor="hero-pickup-date" className={labelClass}>{t("hero.pickupDate")}</label>
                <input id="hero-pickup-date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="hero-pickup-time" className={labelClass}>{t("hero.pickupTime")}</label>
                <input id="hero-pickup-time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="hero-return-date" className={labelClass}>{t("hero.returnDate")}</label>
                <input id="hero-return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="hero-return-time" className={labelClass}>{t("hero.returnTime")}</label>
                <input id="hero-return-time" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className={fieldClass} />
              </div>
            </div>
            <Button type="submit" variant="outlineOnDark" size="lg" className="mt-3 w-full sm:w-auto sm:px-10">
              {t("hero.submit")}
            </Button>
          </form>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-milk/70">
                <span aria-hidden="true" className="text-champagne">✓</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
