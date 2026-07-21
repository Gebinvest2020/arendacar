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
    <footer className="mt-16 bg-ink text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Бренд */}
        <div>
          <div dir="ltr" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-sm font-black text-accent">
              D
            </span>
            {site.brand}
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">{t("footer.tagline")}</p>
        </div>

        {/* Навигация */}
        <nav aria-label={t("footer.sections")}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.sections")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 transition-colors hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Контакты */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.contacts")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li dir="ltr">{site.phone}</li>
            <li dir="ltr">Telegram: {site.telegram}</li>
            <li dir="ltr">WhatsApp: {site.whatsapp}</li>
            <li>{t("contacts.zoneValue")}</li>
            <li>{t("contacts.hoursValue")}</li>
          </ul>
        </div>

        {/* Информация */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {t("footer.info")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/#terms" className="text-white/70 transition-colors hover:text-accent">
                {t("footer.termsLink")}
              </Link>
            </li>
            <li>
              <Link href="/" className="text-white/70 transition-colors hover:text-accent">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {year} {site.brand}. {t("footer.rights")}</p>
          <p>{t("footer.demo")}</p>
        </Container>
      </div>
    </footer>
  );
}
