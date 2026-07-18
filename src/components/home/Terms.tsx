import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

const terms = [
  { label: "Возраст", value: "От 21 года" },
  { label: "Водительский стаж", value: "От 2 лет" },
  { label: "Документы", value: "Паспорт и водительское удостоверение" },
  { label: "Залог", value: "Зависит от класса автомобиля" },
  { label: "Возврат", value: "В оговорённые дату, время и место" },
];

export function Terms() {
  return (
    <section id="terms" className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Условия аренды"
          subtitle="Базовые требования. Полные условия уточняются при бронировании."
        />

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => (
            <div
              key={term.label}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <dt className="text-sm font-medium text-ink/50">{term.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {term.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
