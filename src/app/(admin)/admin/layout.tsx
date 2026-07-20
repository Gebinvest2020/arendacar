import type { Metadata } from "next";

// Оболочка админки: без публичных Header/Footer. Страница входа рисует свой
// центрированный экран, а страницы со списком/деталью — свою шапку (AdminHeader).
export const metadata: Metadata = {
  title: "Управление заявками",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-full bg-muted">{children}</div>;
}
