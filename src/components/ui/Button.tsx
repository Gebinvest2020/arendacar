import { Link } from "@/i18n/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "champagne" | "outlineOnDark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-[color,background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Legacy (светлые страницы: каталог, формы) — без изменений внешнего вида.
  primary: "rounded-full bg-accent text-ink hover:bg-accent-dark hover:text-white focus-visible:ring-accent focus-visible:ring-offset-white",
  secondary: "rounded-full bg-ink text-white hover:bg-ink-soft focus-visible:ring-accent focus-visible:ring-offset-white",
  ghost: "rounded-full border border-line bg-white text-ink hover:border-ink hover:bg-muted focus-visible:ring-accent focus-visible:ring-offset-white",
  // Premium (тёмные поверхности): строгие прямые углы, шампань-акцент.
  champagne: "rounded-[3px] bg-champagne text-graphite hover:bg-champagne-dark focus-visible:ring-offset-graphite",
  outlineOnDark: "rounded-[3px] border border-white/25 text-milk hover:border-champagne hover:text-champagne focus-visible:ring-offset-graphite",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

// Ссылка-кнопка (навигация по якорям / страницам).
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}

// Обычная кнопка (для форм, событий).
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
