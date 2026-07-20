import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarParameters } from "@/components/cars/CarParameters";
import { CarBookingSection } from "@/components/cars/CarBookingSection";
import { SimilarCars } from "@/components/cars/SimilarCars";
import { getCarBySlug, getSimilarCars, getAllCarSlugs } from "@/server/catalog";
import { rentalTerms, site } from "@/data/site";
import { formatCurrency } from "@/lib/currency";

// Данные из БД обновляются без пересборки (ISR, 60 c). Новые slug рендерятся
// по запросу (dynamicParams по умолчанию включён).
export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllCarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
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
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const similar = await getSimilarCars(car, 3);

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
              {car.categoryName}
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

      {/* Расчёт + заявка (общие даты) */}
      <div className="mt-12">
        <CarBookingSection car={car} />
      </div>

      {/* Похожие */}
      {similar.length > 0 && (
        <div className="mt-12">
          <SimilarCars cars={similar} />
        </div>
      )}
    </Container>
  );
}
