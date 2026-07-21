"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type Locale } from "@/lib/locale";

// Подписи для отображения (украинский показываем как UA, внутренний код — uk).
const LABELS: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uk: "UA",
  he: "HE",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname(); // путь БЕЗ locale-сегмента (со slug)
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Сохраняем query и hash текущей страницы. router.replace обновляет
    // locale-сегмент URL и cookie NEXT_LOCALE, не сбрасывая машину/фильтры.
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${qs}${hash}`, { locale: next });
  }

  return (
    <div
      className="inline-flex shrink-0 rounded-lg border border-line bg-white p-0.5"
      role="group"
      aria-label="Language / Язык"
      dir="ltr"
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={`h-10 min-w-10 rounded-md px-2 text-xs font-bold transition-colors ${
            l === locale ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
