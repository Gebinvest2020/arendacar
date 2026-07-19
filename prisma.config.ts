import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma 7 не загружает .env автоматически при наличии prisma.config.ts.
// Локально подхватываем переменные из .env.local (на Vercel/CI они уже в process.env).
// URL нигде не выводим — только загружаем в process.env.
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  // CLI и миграции используют прямое (unpooled) подключение.
  datasource: {
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
