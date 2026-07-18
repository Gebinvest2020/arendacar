import { Container } from "@/components/ui/Container";
import { SectionHeading } from "./SectionHeading";
import { CarCard } from "./CarCard";
import { cars } from "@/data/cars";

export function PopularCars() {
  return (
    <section id="cars" className="bg-muted py-14 sm:py-16">
      <Container>
        <SectionHeading
          title="Популярные автомобили"
          subtitle="Часто выбирают наши клиенты. Полный каталог и фильтры появятся на следующем этапе."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </Container>
    </section>
  );
}
