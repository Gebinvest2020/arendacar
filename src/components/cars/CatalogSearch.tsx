"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { translateCity } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";

// Верхняя форма поиска каталога. Пока работает только локально, без сервера.
export function CatalogSearch() {
  const t = useTranslations();
  const tc = useTranslations("catalog");
  const locale = useLocale() as Locale;
  // Город всегда Одесса — выбора нет.
  const cityLabel = translateCity(site.defaultCity, locale);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
      aria-label={tc("searchAria")}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <span className="mb-1 block text-xs font-semibold text-ink/60">{t("common.city")}</span>
          {/* Город фиксирован — Одесса. Выбора нет. */}
          <div className={`${field} flex items-center font-medium`} aria-label={t("common.city")}>{cityLabel}</div>
        </div>

        <div>
          <label htmlFor="search-pickup-date" className="mb-1 block text-xs font-semibold text-ink/60">{t("hero.pickupDate")}</label>
          <input id="search-pickup-date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-pickup-time" className="mb-1 block text-xs font-semibold text-ink/60">{tc("time")}</label>
          <input id="search-pickup-time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-return-date" className="mb-1 block text-xs font-semibold text-ink/60">{t("hero.returnDate")}</label>
          <input id="search-return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-return-time" className="mb-1 block text-xs font-semibold text-ink/60">{tc("time")}</label>
          <input id="search-return-time" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className={field} />
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full sm:w-auto sm:px-10">
        {t("common.showCars")}
      </Button>
    </form>
  );
}
