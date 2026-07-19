"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { site, cities, navLinks } from "@/data/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [city, setCity] = useState<string>(site.defaultCity);

  const phoneHref = "tel:" + site.phone.replace(/[^\d+]/g, "");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3 lg:h-20">
        {/* Логотип (текстовый) */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-ink"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-black text-accent">
            D
          </span>
          {site.brand}
        </Link>

        {/* Десктоп-навигация */}
        <nav
          className="hidden items-center gap-5 xl:gap-7 lg:flex"
          aria-label="Основная навигация"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Правый блок: город, телефон, CTA (десктоп) */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <label className="sr-only" htmlFor="city-desktop">
            Город
          </label>
          <select
            id="city-desktop"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-10 rounded-lg border border-line bg-white px-2.5 text-sm font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <a
            href={phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-ink transition-colors hover:text-accent-dark xl:block"
          >
            {site.phone}
          </a>
          <ButtonLink
            href="/cars"
            variant="primary"
            size="md"
            className="whitespace-nowrap px-4"
          >
            Подобрать авто
          </ButtonLink>
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${
                menuOpen ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-ink transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-ink transition-transform ${
                menuOpen ? "top-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </Container>

      {/* Мобильное меню */}
      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <Container className="flex flex-col gap-4 py-5">
            <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-base font-medium text-ink/80 transition-colors hover:bg-muted hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-line pt-4">
              <div>
                <label
                  className="mb-1 block text-xs font-medium text-ink/60"
                  htmlFor="city-mobile"
                >
                  Город
                </label>
                <select
                  id="city-mobile"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <a
                href={phoneHref}
                className="text-base font-semibold text-ink transition-colors hover:text-accent-dark"
              >
                {site.phone}
              </a>
              <ButtonLink
                href="/cars"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Подобрать авто
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
