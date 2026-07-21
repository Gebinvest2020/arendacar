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
    <section id="terms" className="py-14 sm:py-16">
      <Container>
        <SectionHeading title={t("terms.title")} subtitle={t("terms.subtitle")} />

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <div key={term.label} className="rounded-2xl border border-line bg-white p-6">
              <dt className="text-sm font-medium text-ink/50">{term.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">{term.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
