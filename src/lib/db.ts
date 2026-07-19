// Единый экземпляр Prisma Client для приложения (runtime).
// Подключение через Neon driver adapter по pooled URL (DATABASE_URL).
// Защита от создания множества экземпляров при hot-reload в dev.
// Строку подключения нигде не выводим. Запросы при импорте не выполняются.

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
