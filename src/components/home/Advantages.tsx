import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Advantages() {
  const t = useTranslations();
  const items = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`advantages.item${n}Title`),
    text: t(`advantages.item${n}Text`),
  }));

  return (
    <section id="advantages" className="py-14 sm:py-16">
      <Container>
        <SectionHeading title={t("advantages.title")} subtitle={t("advantages.subtitle")} />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent-dark">
                <CheckIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/60">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
