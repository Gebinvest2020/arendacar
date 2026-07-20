import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Оболочка публичной части сайта: общий Header и Footer.
// Админка использует собственную оболочку и этот layout не подключает.
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
