"use client";

import { useEffect, useState } from "react";

// Мобильная нижняя sticky-CTA на странице авто (desktop скрыта).
// Прячется, когда секция бронирования (#booking) видна на экране — чтобы не
// перекрывать поля формы. Учитывает safe-area-inset-bottom.
export function MobileBookingBar({
  carName,
  priceLabel,
  ctaLabel,
}: {
  carName: string;
  priceLabel: string;
  ctaLabel: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const booking = document.getElementById("booking");
    if (!booking) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(booking);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-graphite-2/95 backdrop-blur transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={hidden}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p dir="ltr" className="truncate text-sm font-semibold text-milk text-start">{carName}</p>
          <p className="text-xs text-champagne" dir="ltr">{priceLabel}</p>
        </div>
        <a
          href="#booking"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[3px] bg-champagne px-6 text-sm font-semibold text-graphite transition-colors hover:bg-champagne-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
