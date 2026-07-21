import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
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

  const cards = [
    { label: t("contacts.phone"), value: site.phone, href: phoneHref },
    { label: "Telegram", value: site.telegram, href: tgHref },
    { label: "WhatsApp", value: site.whatsapp, href: waHref },
  ];

  return (
    <section id="contacts" className="bg-muted py-14 sm:py-16">
      <Container>
        <SectionHeading title={t("contacts.title")} subtitle={t("contacts.subtitle")} />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-1">
            {cards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="flex flex-col rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-sm font-medium text-ink/50">{card.label}</span>
                <span dir="ltr" className="mt-1 text-lg font-semibold text-ink text-start">{card.value}</span>
              </a>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-dark">
                <LocationIcon />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">{t("contacts.deliveryTitle")}</h3>
                <p className="mt-1 text-sm leading-6 text-ink/60">{t("contacts.deliveryText")}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">{t("contacts.zoneLabel")}</dt>
                <dd className="text-end font-medium text-ink">{t("contacts.zoneValue")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">{t("contacts.hoursLabel")}</dt>
                <dd className="text-end font-medium text-ink">{t("contacts.hoursValue")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
