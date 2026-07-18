import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site, navLinks } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Бренд */}
        <div>
          <div className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-sm font-black text-accent">
              D
            </span>
            {site.brand}
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            {site.tagline}
          </p>
        </div>

        {/* Навигация */}
        <nav aria-label="Навигация в футере">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Разделы
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-white/70 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Контакты */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Контакты
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>{site.phone}</li>
            <li>Telegram: {site.telegram}</li>
            <li>WhatsApp: {site.whatsapp}</li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>

        {/* Юридическое */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Информация
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link
                href="#terms"
                className="text-white/70 transition-colors hover:text-accent"
              >
                Условия аренды
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white/70 transition-colors hover:text-accent"
              >
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {site.brand}. Все права защищены.
          </p>
          <p>Демонстрационная версия сайта</p>
        </Container>
      </div>
    </footer>
  );
}
