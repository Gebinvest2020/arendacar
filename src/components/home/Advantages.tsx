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
    <section id="advantages" className="bg-graphite py-16 sm:py-20">
      <Container>
        <SectionHeading title={t("advantages.title")} subtitle={t("advantages.subtitle")} tone="onDark" />

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="border-t border-white/10 pt-5">
              <span className="grid h-9 w-9 place-items-center rounded-[3px] border border-champagne/50 text-champagne">
                <CheckIcon />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-milk">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-milk/60">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
