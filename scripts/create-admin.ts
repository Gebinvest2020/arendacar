import { config, parse } from "dotenv";
import fs from "node:fs";
import path from "node:path";

// Создание/обновление администратора ТОЛЬКО в development.
// Запуск: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create
// Пароль/хеш/URL не выводятся. Для production будет отдельный контролируемый запуск.

config({ path: path.resolve(process.cwd(), ".env.local") });

import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { normalizeEmail } from "@/lib/validation/admin";

// Стоимость bcrypt (совпадает с BCRYPT_COST в src/server/admin/auth.ts).
// Здесь задаём локально, чтобы не импортировать server-only модуль в CLI-скрипт.
const BCRYPT_COST = 12;

function fail(msg: string): never {
  console.error("Отказ:", msg);
  process.exit(1);
}

function readProdUrl(): string {
  try {
    const parsed = parse(fs.readFileSync(".env.production.local"));
    return parsed.DATABASE_URL || "";
  } catch {
    return "";
  }
}

async function main() {
  // --- Защита от production ---
  // Признак реального production: запуск в prod-рантайме (NODE_ENV=production)
  // или Vercel production. Флаг VERCEL="1" из .env.local (vercel env pull) —
  // НЕ признак production, поэтому его отдельно не проверяем.
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    fail("обнаружено production-окружение. Скрипт работает только в development.");
  }
  // Главная гарантия: URL dev-базы НЕ должен совпадать с production main.
  const devUrl = process.env.DATABASE_URL || "";
  if (!devUrl) fail("DATABASE_URL не задан в .env.local.");
  const prodUrl = readProdUrl();
  if (prodUrl && prodUrl === devUrl) {
    fail("DATABASE_URL совпадает с production. Отказываюсь создавать админа в production.");
  }

  // --- Входные данные ---
  const email = normalizeEmail(process.env.ADMIN_EMAIL || "");
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail("ADMIN_EMAIL пуст или некорректен.");
  }
  if (password.length < 12 || password.length > 128) {
    fail("ADMIN_PASSWORD должен быть от 12 до 128 символов.");
  }

  const adapter = new PrismaNeon({ connectionString: devUrl });
  const prisma = new PrismaClient({ adapter } as never);

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const existing = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      // Меняем только пароль. active и role НЕ трогаем.
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: { passwordHash },
      });
      // Смена пароля — сбрасываем все существующие сессии этого админа.
      const removed = await prisma.adminSession.deleteMany({ where: { adminId: existing.id } });
      console.log(`Обновлён пароль администратора: ${email}. Сброшено сессий: ${removed.count}.`);
    } else {
      await prisma.adminUser.create({
        data: { email, passwordHash }, // role=ADMIN и active=true из default'ов
      });
      console.log(`Создан администратор: ${email}.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  // Не печатаем пароль/хеш/URL — только код/сообщение ошибки.
  const err = e as { code?: string; message?: string };
  console.error("Ошибка:", err.code ?? "N/A", "|", err.message ?? String(e));
  process.exit(1);
});
