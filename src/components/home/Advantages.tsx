import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";

const items = [
  {
    title: "Понятные цены",
    text: "Стоимость фиксируется заранее. Никаких доплат при получении автомобиля.",
  },
  {
    title: "Быстрая подача",
    text: "Подготовим автомобиль к назначенному времени в удобном для вас месте.",
  },
  {
    title: "Исправные автомобили",
    text: "Регулярное техническое обслуживание и проверка перед каждой поездкой.",
  },
  {
    title: "Поддержка клиента",
    text: "Поможем с выбором и ответим на вопросы до и во время аренды.",
  },
  {
    title: "Без скрытых условий",
    text: "Все условия аренды и залог обозначены прозрачно и заранее.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Advantages() {
  return (
    <section id="advantages" className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Почему выбирают нас"
          subtitle="Аренда без сюрпризов: честные условия и внимание к каждому клиенту."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent-dark">
                <CheckIcon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-6 text-ink/60">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
