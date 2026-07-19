// Seed каталога: город, категории и 8 автомобилей из src/data (единый источник).
// Идемпотентный: upsert по slug + пересоздание вложенных photos/priceTiers
// конкретного авто в транзакции. Базу целиком НЕ удаляем и не сбрасываем.

import path from "node:path";
import { config as loadEnv } from "dotenv";

// Грузим .env.local до создания клиента (на случай прямого запуска через tsx).
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });

import { PrismaClient, Transmission, FuelType, Drivetrain } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { cars } from "../src/data/cars";
import { categories } from "../src/data/categories";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Явные и проверяемые маппинги русских подписей в enum-коды.
const transmissionMap: Record<string, Transmission> = {
  "Механика": Transmission.MANUAL,
  "Автомат": Transmission.AUTOMATIC,
};
const fuelMap: Record<string, FuelType> = {
  "Бензин": FuelType.PETROL,
  "Дизель": FuelType.DIESEL,
  "Гибрид": FuelType.HYBRID,
  "Электро": FuelType.ELECTRIC,
};
const drivetrainMap: Record<string, Drivetrain> = {
  "Передний": Drivetrain.FWD,
  "Задний": Drivetrain.RWD,
  "Полный": Drivetrain.AWD,
};

function mustMap<T>(map: Record<string, T>, key: string, kind: string): T {
  const v = map[key];
  if (v === undefined) throw new Error(`Неизвестное значение ${kind}: "${key}"`);
  return v;
}

const CITY = { slug: "odessa", name: "Одесса" };

async function main() {
  // 1. Город
  await prisma.city.upsert({
    where: { slug: CITY.slug },
    update: { name: CITY.name, isActive: true, sortOrder: 0 },
    create: { slug: CITY.slug, name: CITY.name, isActive: true, sortOrder: 0 },
  });

  // 2. Категории (sortOrder = порядок из данных)
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, sortOrder: i },
      create: { slug: c.slug, name: c.name, description: c.description, sortOrder: i },
    });
  }

  // 3. Автомобили
  for (const car of cars) {
    const data = {
      brand: car.brand,
      model: car.model,
      fullName: car.fullName,
      bodyType: car.bodyType,
      year: car.year,
      transmission: mustMap(transmissionMap, car.transmission, "коробки"),
      fuel: mustMap(fuelMap, car.fuel, "топлива"),
      drivetrain: mustMap(drivetrainMap, car.drivetrain, "привода"),
      seats: car.seats,
      doors: car.doors,
      luggage: car.luggage,
      engine: car.engine,
      airConditioning: car.airConditioning,
      dailyPrice: car.dailyPrice,
      deposit: car.deposit,
      featured: car.featured,
      available: car.available,
      imageAlt: car.imageAlt,
      description: car.description,
      features: car.features,
      category: { connect: { slug: car.category } },
      city: { connect: { slug: CITY.slug } },
    };

    const saved = await prisma.car.upsert({
      where: { slug: car.slug },
      update: data,
      create: { slug: car.slug, ...data },
    });

    // Пересоздаём вложенные photos/priceTiers именно этого авто (в транзакции),
    // чтобы при повторном запуске не было дублей (1 фото, 5 тарифов).
    await prisma.$transaction([
      prisma.carPhoto.deleteMany({ where: { carId: saved.id } }),
      prisma.priceTier.deleteMany({ where: { carId: saved.id } }),
      prisma.carPhoto.create({
        data: {
          carId: saved.id,
          url: car.image,
          alt: car.imageAlt,
          isCover: true,
          sortOrder: 0,
        },
      }),
      prisma.priceTier.createMany({
        data: car.priceTiers.map((t, idx) => ({
          carId: saved.id,
          minDays: t.minDays,
          maxDays: t.maxDays,
          pricePerDay: t.pricePerDay,
          sortOrder: idx,
        })),
      }),
    ]);
  }

  // Короткая сводка (без секретов)
  const [cities, cats, carsCount, photos, tiers] = await Promise.all([
    prisma.city.count(),
    prisma.category.count(),
    prisma.car.count(),
    prisma.carPhoto.count(),
    prisma.priceTier.count(),
  ]);
  console.log(
    `Seed готов: города=${cities}, категории=${cats}, авто=${carsCount}, фото=${photos}, тарифы=${tiers}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Ошибка seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
