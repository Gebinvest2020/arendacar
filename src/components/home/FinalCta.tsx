import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section id="cta" className="py-12 sm:py-14">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Готовы отправиться в путь?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              Подберём автомобиль под ваши даты и бюджет. Оставьте заявку — и мы
              свяжемся с вами для подтверждения.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="#hero" variant="primary" size="lg">
                Подобрать автомобиль
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
