import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/cars", label: t("nav.cars") },
    { href: "/#categories", label: t("nav.categories") },
    { href: "/#how", label: t("nav.how") },
    { href: "/#terms", label: t("nav.terms") },
    { href: "/#contacts", label: t("nav.contacts") },
  ];

  return (
    <footer className="border-t border-white/10 bg-graphite-2 text-milk/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Бренд */}
        <div>
          <div dir="ltr" className="flex items-center gap-2 text-milk">
            <span className="grid h-8 w-8 place-items-center rounded-[3px] bg-champagne text-sm font-black text-graphite">
              D
            </span>
            <span className="font-display text-xl tracking-wide">{site.brand}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-milk/55">{t("footer.tagline")}</p>
        </div>

        {/* Навигация */}
        <nav aria-label={t("footer.sections")}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-milk-dim">
            {t("footer.sections")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-milk/70 transition-colors hover:text-champagne">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Контакты */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-milk-dim">
            {t("footer.contacts")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-milk/70">
            <li dir="ltr" className="text-start">{site.phone}</li>
            <li dir="ltr" className="text-start">Telegram: {site.telegram}</li>
            <li dir="ltr" className="text-start">WhatsApp: {site.whatsapp}</li>
            <li>{t("contacts.zoneValue")}</li>
            <li dir="ltr" className="text-start">{t("contacts.hoursValue")}</li>
          </ul>
        </div>

        {/* Информация */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-milk-dim">
            {t("footer.info")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/#terms" className="text-milk/70 transition-colors hover:text-champagne">
                {t("footer.termsLink")}
              </Link>
            </li>
            <li>
              <Link href="/" className="text-milk/70 transition-colors hover:text-champagne">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-milk-dim sm:flex-row">
          <p>© {year} {site.brand}. {t("footer.rights")}</p>
          <p>{t("footer.demo")}</p>
        </Container>
      </div>
    </footer>
  );
}
