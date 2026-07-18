import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { CategoryIcon } from "./CategoryIcon";
import { categories } from "@/data/categories";

export function Categories() {
  return (
    <section id="categories" className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Категории автомобилей"
          subtitle="От экономичных городских авто до премиум-класса — подберём под задачу и бюджет."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href="#cars"
              className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-muted text-ink transition-colors group-hover:bg-accent/15 group-hover:text-accent-dark">
                <CategoryIcon slug={cat.slug} className="[&>svg]:h-7 [&>svg]:w-7" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-ink">{cat.name}</h3>
                <p className="mt-0.5 text-sm text-ink/55">{cat.description}</p>
                <p className="mt-1 text-sm font-semibold text-accent-dark">
                  от {cat.priceFrom.toLocaleString("ru-RU")} грн/сутки
                </p>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
