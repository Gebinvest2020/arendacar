"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site, cities } from "@/data/site";
import { cars } from "@/data/cars";
import { formatDailyPrice } from "@/lib/currency";

const perks = ["Без залога онлайн", "Подача за 30 минут", "Оплата при получении"];
const minDailyPrice = Math.min(...cars.map((c) => c.dailyPrice));

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState<string>(site.defaultCity);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");

  // Форма без сервера: переводит в каталог. Даты пока не передаём (визуальный этап).
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/cars");
  }

  const fieldClass =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-ink text-white"
    >
      {/* Мягкие декоративные пятна (без визуального шума) */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <Container className="relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        {/* Левая часть: заголовок + форма */}
        <div>
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            Прокат авто в городе {site.defaultCity}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Аренда автомобилей быстро и без лишних сложностей
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/70">
            Выберите город и даты — подберём подходящий автомобиль. Прозрачные
            цены, честный залог и понятные условия.
          </p>

          {/* Форма выбора города и дат */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-4 text-ink shadow-xl sm:p-5"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="hero-city"
                  className="mb-1 block text-xs font-semibold text-ink/60"
                >
                  Город
                </label>
                <select
                  id="hero-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={fieldClass}
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="pickup-date"
                  className="mb-1 block text-xs font-semibold text-ink/60"
                >
                  Дата получения
                </label>
                <input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="pickup-time"
                  className="mb-1 block text-xs font-semibold text-ink/60"
                >
                  Время получения
                </label>
                <input
                  id="pickup-time"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="return-date"
                  className="mb-1 block text-xs font-semibold text-ink/60"
                >
                  Дата возврата
                </label>
                <input
                  id="return-date"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="return-time"
                  className="mb-1 block text-xs font-semibold text-ink/60"
                >
                  Время возврата
                </label>
                <input
                  id="return-time"
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="mt-4 w-full">
              Найти автомобиль
            </Button>
          </form>
        </div>

        {/* Правая часть: реальное фото авто на тёмном фоне + преимущества */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
            {/* мягкое свечение под автомобилем */}
            <div className="pointer-events-none absolute inset-x-8 bottom-4 h-16 rounded-full bg-accent/25 blur-2xl" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/cars/hero-panamera.jpg"
                alt="Современный автомобиль премиум-класса"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* лёгкое затемнение для контраста */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>

            {/* бейдж с ценой */}
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
              <p className="text-[11px] font-medium text-ink/50">Аренда</p>
              <p className="text-base font-extrabold leading-tight text-ink">
                от {formatDailyPrice(minDailyPrice)}
              </p>
            </div>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {perks.map((perk) => (
              <li
                key={perk}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85"
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
