"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/data/site";
import { translateCity } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Город всегда Одесса — выбора нет.
  const cityLabel = translateCity(site.defaultCity, locale);

  const phoneHref = "tel:" + site.phone.replace(/[^\d+]/g, "");

  // При скролле слегка усиливаем непрозрачность фона шапки.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/cars", label: t("nav.cars") },
    { href: "/#categories", label: t("nav.categories") },
    { href: "/#how", label: t("nav.how") },
    { href: "/#terms", label: t("nav.terms") },
    { href: "/#contacts", label: t("nav.contacts") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? "border-white/10 bg-graphite/95 backdrop-blur"
          : "border-white/5 bg-graphite/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Логотип (текстовый) — не зеркалим */}
        <Link
          href="/"
          dir="ltr"
          className="flex shrink-0 items-center gap-2 text-milk"
        >
          <span className="grid h-9 w-9 place-items-center rounded-[3px] bg-champagne text-sm font-black text-graphite">
            D
          </span>
          <span className="font-display text-xl tracking-wide sm:text-2xl">{site.brand}</span>
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label={t("nav.cars")}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-milk/70 transition-colors duration-200 hover:text-milk"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Правый блок: язык, город, телефон, CTA (десктоп) */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <LanguageSwitcher />
          {/* Город фиксирован — Одесса. Выбора нет. */}
          <span
            className="inline-flex h-10 items-center gap-1.5 rounded-[3px] border border-white/10 px-2.5 text-sm font-medium text-milk/80"
            aria-label={t("common.city")}
          >
            <span aria-hidden="true" className="text-champagne">◈</span>
            {cityLabel}
          </span>
          <a
            href={phoneHref}
            dir="ltr"
            className="hidden whitespace-nowrap text-sm font-semibold text-milk transition-colors hover:text-champagne xl:block"
          >
            {site.phone}
          </a>
          <ButtonLink href="/cars" variant="champagne" size="md" className="whitespace-nowrap px-4">
            {t("common.pickCar")}
          </ButtonLink>
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
          className="grid h-11 w-11 place-items-center rounded-[3px] border border-white/15 text-milk transition-colors hover:border-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${menuOpen ? "top-1/2 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${menuOpen ? "top-1/2 -rotate-45" : "bottom-0"}`} />
          </span>
        </button>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-graphite lg:hidden">
          <Container className="flex flex-col gap-4 py-5">
            <nav className="flex flex-col gap-1" aria-label={t("nav.cars")}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[3px] px-2 py-3 text-base font-medium text-milk/80 transition-colors hover:bg-white/5 hover:text-milk"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <LanguageSwitcher />
              <div>
                <span className="mb-1 block text-xs font-medium text-milk-dim">
                  {t("common.city")}
                </span>
                {/* Город фиксирован — Одесса. Выбора нет. */}
                <div
                  className="flex h-11 w-full items-center gap-1.5 rounded-[3px] border border-white/10 px-3 text-sm font-medium text-milk"
                  aria-label={t("common.city")}
                >
                  <span aria-hidden="true" className="text-champagne">◈</span>
                  {cityLabel}
                </div>
              </div>
              <a href={phoneHref} dir="ltr" className="text-base font-semibold text-milk transition-colors hover:text-champagne">
                {site.phone}
              </a>
              <ButtonLink href="/cars" variant="champagne" size="lg" className="w-full">
                {t("common.pickCar")}
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
