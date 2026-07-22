import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CarGallery } from "@/components/cars/CarGallery";
import { CarParameters } from "@/components/cars/CarParameters";
import { CarBookingSection } from "@/components/cars/CarBookingSection";
import { SimilarCars } from "@/components/cars/SimilarCars";
import { MobileBookingBar } from "@/components/cars/MobileBookingBar";
import { getCarBySlug, getSimilarCars, getAllCarSlugs } from "@/server/catalog";
import { site } from "@/data/site";
import { formatCurrency } from "@/lib/currency";
import { carDescription, categoryName, translateCity } from "@/lib/car-content";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 60;

type Params = { locale: string; slug: string };

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getAllCarSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "404" };
  const l = locale as Locale;
  return {
    title: `${car.fullName} — ${translateCity(car.city, l)} | ${site.brand}`,
    description: carDescription(slug, l),
    alternates: buildAlternates(l, `/cars/${slug}`),
  };
}

export default async function CarPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const t = await getTranslations({ locale, namespace: "carPage" });
  const tt = await getTranslations({ locale, namespace: "terms" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const similar = await getSimilarCars(car, 3);

  const terms = [
    { label: tt("ageLabel"), value: tt("ageValue") },
    { label: tt("experienceLabel"), value: tt("experienceValue") },
    { label: tt("docsLabel"), value: tt("docsValue") },
    { label: tt("depositLabel"), value: tt("depositValue") },
    { label: tt("confirmLabel"), value: tt("confirmValue") },
  ];

  return (
    <div className="bg-graphite text-milk">
      <Container className="py-8 pb-28 sm:py-10 lg:pb-10">
        <nav aria-label="breadcrumb" className="text-sm text-milk-dim">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="transition-colors hover:text-milk">{t("breadcrumbHome")}</Link></li>
            <li aria-hidden="true" className="text-milk/30">/</li>
            <li><Link href="/cars" className="transition-colors hover:text-milk">{t("breadcrumbCars")}</Link></li>
            <li aria-hidden="true" className="text-milk/30">/</li>
            <li className="font-medium text-milk" aria-current="page" dir="ltr">{car.fullName}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <CarGallery images={car.images} alt={car.imageAlt} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-[2px] border border-champagne/60 px-3 py-1 text-xs font-semibold tracking-wide text-champagne">{categoryName(car.category, l)}</span>
              <span className="rounded-[2px] border border-white/15 px-3 py-1 text-xs font-semibold text-milk/80" dir="ltr">{t("year", { year: car.year })}</span>
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-white/10 px-3 py-1 text-xs font-medium text-milk">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${car.available ? "bg-emerald-400" : "bg-milk-dim"}`} />
                {car.available ? t("inStock") : t("notInStock")}
              </span>
            </div>

            <h1 dir="ltr" className="font-display mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-milk text-start sm:text-5xl">{car.fullName}</h1>

            <p className="mt-4 text-base leading-7 text-milk/75">{carDescription(slug, l)}</p>

            <div className="dr-panel mt-6 flex flex-wrap items-end gap-x-8 gap-y-3 p-5">
              <div>
                <p className="text-xs text-milk-dim">{t("priceFrom")}</p>
                <p className="text-4xl font-extrabold leading-none text-champagne">
                  <span dir="ltr">{formatCurrency(car.dailyPrice)}</span>
                  <span className="ms-1 text-sm font-semibold text-milk/60">{tc("perDay")}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-milk-dim">{t("depositReturnable")}</p>
                <p className="text-xl font-bold text-milk" dir="ltr">{formatCurrency(car.deposit)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#booking" variant="champagne" size="lg" className="sm:flex-1">{t("book")}</ButtonLink>
              <ButtonLink href="#calculator" variant="outlineOnDark" size="lg" className="sm:flex-1">{t("calc")}</ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CarParameters car={car} />
        </div>

        <section className="mt-12" aria-labelledby="terms-heading">
          <h2 id="terms-heading" className="font-display text-3xl font-semibold tracking-tight text-milk">{t("termsSectionTitle")}</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <div key={term.label} className="dr-panel p-5">
                <dt className="text-sm font-medium text-milk-dim">{term.label}</dt>
                <dd className="mt-1 text-base font-semibold text-milk">{term.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12">
          <CarBookingSection car={car} />
        </div>

        {similar.length > 0 && (
          <div className="mt-12">
            <SimilarCars cars={similar} />
          </div>
        )}
      </Container>

      {/* Мобильная нижняя sticky-CTA (desktop скрыта) */}
      <MobileBookingBar carName={car.fullName} priceLabel={`${formatCurrency(car.dailyPrice)}${tc("perDay")}`} ctaLabel={t("book")} />
    </div>
  );
}
