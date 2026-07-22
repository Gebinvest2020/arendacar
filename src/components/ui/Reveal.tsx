"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Лёгкое появление секции при попадании в область видимости.
// Никакой постоянной анимации/параллакса. Уважает prefers-reduced-motion
// (стили в globals.css отключают эффект). После показа — не скрывает обратно.
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fail-safe: без IntersectionObserver — показываем (контент не скрываем).
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }
    // Включаем «скрытие до появления» только когда JS готов управлять reveal.
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Страховка: если по какой-то причине callback не сработал — показать через 1.2s.
    const fallback = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
