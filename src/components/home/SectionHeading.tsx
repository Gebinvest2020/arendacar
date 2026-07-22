import type { ReactNode } from "react";

// Единый заголовок секции. tone="onDark" — премиум-стиль для тёмных секций;
// tone="onLight" (по умолчанию) сохраняет прежний вид светлых секций без изменений.
export function SectionHeading({
  title,
  subtitle,
  align = "left",
  tone = "onLight",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "onLight" | "onDark";
}) {
  const wrap = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";
  if (tone === "onDark") {
    return (
      <div className={wrap}>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-milk sm:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-base leading-7 text-milk/60">{subtitle}</p>}
      </div>
    );
  }
  return (
    <div className={wrap}>
      <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-7 text-ink/60">{subtitle}</p>
      )}
    </div>
  );
}
