import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarParameters } from "@/components/cars/CarParameters";
import { CarCalculator } from "@/components/cars/CarCalculator";
import { CarBookingForm } from "@/components/cars/CarBookingForm";
import { SimilarCars } from "@/components/cars/SimilarCars";
import { cars, getCarBySlug, getSimilarCars } from "@/data/cars";
import { getCategoryName } from "@/data/categories";
import { rentalTerms, site } from "@/data/site";
import { formatCurrency } from "@/lib/currency";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Автомобиль не найден" };
  return {
    title: `${car.fullName} — аренда в городе ${car.city} | ${site.brand}`,
    description: car.description,
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const similar = getSimilarCars(car, 3);

  return (
    <Container className="py-8 sm:py-10">
      {/* Хлебные крошки */}
      <nav aria-label="Хлебные крошки" className="text-sm text-ink/60">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/cars" className="transition-colors hover:text-ink">Автомобили</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink" aria-current="page">{car.fullName}</li>
        </ol>
      </nav>

      {/* Верх: галерея + основная информация */}
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <CarGallery images={car.images} alt={car.imageAlt} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-ink">
              {getCategoryName(car.category)}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-ink">
              {car.year} г.
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                car.available ? "bg-emerald-500" : "bg-ink/70"
              }`}
            >
              {car.available ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {car.fullName}
          </h1>

          <p className="mt-3 text-base leading-7 text-ink/70">{car.description}</p>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3 rounded-2xl border border-line bg-white p-5">
            <div>
              <p className="text-xs text-ink/50">Цена от</p>
              <p className="text-3xl font-extrabold leading-none text-ink">
                {formatCurrency(car.dailyPrice)}
                <span className="ml-1 text-sm font-semibold text-ink/60">/сутки</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Залог (возвратный)</p>
              <p className="text-xl font-bold text-ink">
                {formatCurrency(car.deposit)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#booking" variant="primary" size="lg" className="sm:flex-1">
              Забронировать
            </ButtonLink>
            <ButtonLink href="#calculator" variant="ghost" size="lg" className="sm:flex-1">
              Рассчитать стоимость
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Единый блок: цены, характеристики, комплектация */}
      <div className="mt-12">
        <CarParameters car={car} />
      </div>

      {/* Предварительный калькулятор — отдельным блоком */}
      <section id="calculator" className="mt-12 scroll-mt-24" aria-labelledby="calc-heading">
        <h2 id="calc-heading" className="text-2xl font-bold tracking-tight text-ink">
          Расчёт стоимости аренды
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarCalculator car={car} />
        </div>
      </section>

      {/* Условия аренды */}
      <section className="mt-12" aria-labelledby="terms-heading">
        <h2 id="terms-heading" className="text-2xl font-bold tracking-tight text-ink">
          Условия аренды
        </h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rentalTerms.map((term) => (
            <div key={term.label} className="rounded-2xl border border-line bg-white p-5">
              <dt className="text-sm font-medium text-ink/50">{term.label}</dt>
              <dd className="mt-1 text-base font-semibold text-ink">{term.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Заявка */}
      <section className="mt-12" aria-labelledby="booking-heading">
        <h2 id="booking-heading" className="text-2xl font-bold tracking-tight text-ink">
          Бронирование
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarBookingForm car={car} />
        </div>
      </section>

      {/* Похожие */}
      {similar.length > 0 && (
        <div className="mt-12">
          <SimilarCars cars={similar} />
        </div>
      )}
    </Container>
  );
}
