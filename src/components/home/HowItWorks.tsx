import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    n: 1,
    title: "Выберите автомобиль",
    text: "Укажите город и даты, подберите подходящий автомобиль из каталога.",
  },
  {
    n: 2,
    title: "Оставьте заявку",
    text: "Заполните короткую форму — это займёт меньше минуты.",
  },
  {
    n: 3,
    title: "Получите подтверждение",
    text: "Менеджер свяжется с вами и подтвердит бронирование.",
  },
  {
    n: 4,
    title: "Заберите автомобиль",
    text: "Подготовим авто к назначенному времени в удобном месте.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-muted py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Как арендовать автомобиль"
          subtitle="Всего четыре простых шага от выбора до поездки."
        />

        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="relative rounded-2xl border border-line bg-white p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg font-bold text-accent">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
