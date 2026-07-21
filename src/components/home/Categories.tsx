import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { CategoryIcon } from "./CategoryIcon";
import { formatCurrency } from "@/lib/currency";
import { categoryName, categoryDescription } from "@/lib/car-content";
import type { Locale } from "@/lib/locale";
import type { CategoryView } from "@/types/car";

export function Categories({ categories }: { categories: CategoryView[] }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  return (
    <section id="categories" className="py-14 sm:py-16">
      <Container>
        <SectionHeading title={t("categories.title")} subtitle={t("categories.subtitle")} />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/cars?category=${cat.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-muted text-ink transition-colors group-hover:bg-accent/15 group-hover:text-accent-dark">
                <CategoryIcon slug={cat.slug} className="[&>svg]:h-7 [&>svg]:w-7" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-ink">{categoryName(cat.slug, locale)}</h3>
                <p className="mt-0.5 text-sm text-ink/55">{categoryDescription(cat.slug, locale)}</p>
                <p className="mt-1 text-sm font-semibold text-accent-dark">
                  {t("common.from")} <span dir="ltr">{formatCurrency(cat.priceFrom)}</span>{t("common.perDay")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
