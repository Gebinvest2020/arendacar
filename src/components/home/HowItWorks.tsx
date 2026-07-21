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
    <section id="how" className="bg-muted py-14 sm:py-16">
      <Container>
        <SectionHeading title={t("how.title")} subtitle={t("how.subtitle")} />

        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.n} className="relative rounded-2xl border border-line bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg font-bold text-accent">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
