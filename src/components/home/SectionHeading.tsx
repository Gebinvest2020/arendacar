import type { ReactNode } from "react";

// Единый заголовок секции (переиспользуемый).
export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-7 text-ink/60">{subtitle}</p>
      )}
    </div>
  );
}
