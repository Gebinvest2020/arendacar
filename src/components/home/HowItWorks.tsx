import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

export function HowItWorks() {
  const t = useTranslations();
  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`how.step${n}Title`),
    text: t(`how.step${n}Text`),
  }));

  return (
    <section id="how" className="bg-graphite-2 py-16 sm:py-20">
      <Container>
        <SectionHeading title={t("how.title")} subtitle={t("how.subtitle")} tone="onDark" />

        <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-white/10 pt-5 lg:border-t-0 lg:border-s lg:ps-6 lg:pt-0">
              <span className="font-display text-5xl font-semibold leading-none text-champagne/80" dir="ltr">
                {String(step.n).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-milk">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-milk/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
