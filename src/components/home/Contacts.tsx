import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";
import { site } from "@/data/site";

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Contacts() {
  const t = useTranslations();
  const phoneHref = "tel:" + site.phone.replace(/[^\d+]/g, "");
  const waHref = "https://wa.me/" + site.whatsapp.replace(/[^\d]/g, "");
  const tgHref = "https://t.me/" + site.telegram.replace(/^@/, "");

  return (
    <section id="contacts" className="bg-graphite-2 py-16 sm:py-20">
      <Container>
        <SectionHeading title={t("contacts.title")} subtitle={t("contacts.subtitle")} tone="onDark" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Крупный телефон + основная CTA */}
          <div className="dr-panel flex flex-col justify-between gap-8 p-6 sm:p-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-milk-dim">{t("contacts.phone")}</span>
              <a
                href={phoneHref}
                dir="ltr"
                className="mt-2 block font-display text-3xl font-semibold text-milk transition-colors hover:text-champagne text-start sm:text-4xl"
              >
                {site.phone}
              </a>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a href={tgHref} dir="ltr" className="text-milk/70 transition-colors hover:text-champagne">Telegram: {site.telegram}</a>
                <a href={waHref} dir="ltr" className="text-milk/70 transition-colors hover:text-champagne">WhatsApp: {site.whatsapp}</a>
              </div>
            </div>
            <ButtonLink href="/cars" variant="champagne" size="lg" className="w-full sm:w-auto sm:self-start sm:px-8">
              {t("common.pickCar")}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>

          {/* Доставка / зона / часы */}
          <div className="dr-panel p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[3px] border border-champagne/50 text-champagne">
                <LocationIcon />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-milk">{t("contacts.deliveryTitle")}</h3>
                <p className="mt-1 text-sm leading-6 text-milk/60">{t("contacts.deliveryText")}</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-milk-dim">{t("contacts.zoneLabel")}</dt>
                <dd className="text-end font-medium text-milk">{t("contacts.zoneValue")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-milk-dim">{t("contacts.hoursLabel")}</dt>
                <dd className="text-end font-medium text-milk" dir="ltr">{t("contacts.hoursValue")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
