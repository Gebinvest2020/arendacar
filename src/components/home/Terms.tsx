import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

export function Terms() {
  const t = useTranslations();
  const terms = [
    { label: t("terms.ageLabel"), value: t("terms.ageValue") },
    { label: t("terms.experienceLabel"), value: t("terms.experienceValue") },
    { label: t("terms.docsLabel"), value: t("terms.docsValue") },
    { label: t("terms.depositLabel"), value: t("terms.depositValue") },
    { label: t("terms.confirmLabel"), value: t("terms.confirmValue") },
  ];

  return (
    <section id="terms" className="bg-graphite py-16 sm:py-20">
      <Container>
        <SectionHeading title={t("terms.title")} subtitle={t("terms.subtitle")} tone="onDark" />

        <dl className="dr-panel mt-10 grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
          {terms.map((term) => (
            <div key={term.label} className="p-5 sm:p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-milk-dim">{term.label}</dt>
              <dd className="mt-1.5 text-lg font-semibold text-milk">{term.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
