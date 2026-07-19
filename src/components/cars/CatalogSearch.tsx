"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { site, cities } from "@/data/site";

// Верхняя форма поиска каталога. Пока работает только локально, без сервера.
export function CatalogSearch() {
  const [city, setCity] = useState<string>(site.defaultCity);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Демонстрационный этап: даты пока не влияют на выдачу.
  }

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5"
      aria-label="Поиск автомобилей по городу и датам"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label htmlFor="search-city" className="mb-1 block text-xs font-semibold text-ink/60">
            Город
          </label>
          <select
            id="search-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={field}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-pickup-date" className="mb-1 block text-xs font-semibold text-ink/60">
            Дата получения
          </label>
          <input id="search-pickup-date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-pickup-time" className="mb-1 block text-xs font-semibold text-ink/60">
            Время
          </label>
          <input id="search-pickup-time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-return-date" className="mb-1 block text-xs font-semibold text-ink/60">
            Дата возврата
          </label>
          <input id="search-return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="search-return-time" className="mb-1 block text-xs font-semibold text-ink/60">
            Время
          </label>
          <input id="search-return-time" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className={field} />
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full sm:w-auto sm:px-10">
        Показать автомобили
      </Button>
    </form>
  );
}
