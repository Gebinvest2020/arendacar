import "server-only";

// Проверка учётных данных админа. Пароль сверяется через bcryptjs.
// Никогда не логируем пароль/хеш и не возвращаем passwordHash наружу.

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/validation/admin";

export const BCRYPT_COST = 12;

// Фиктивный хеш для выравнивания времени ответа, когда админ не найден
// (защита от timing-атак: всегда выполняем bcrypt.compare).
const DUMMY_HASH = bcrypt.hashSync("dummy-value-not-a-real-password", BCRYPT_COST);

// Возвращает adminId при успехе или null при любой неудаче (единый ответ,
// без раскрытия, существует ли email и активен ли он).
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<string | null> {
  const normalized = normalizeEmail(email);

  const admin = await prisma.adminUser.findUnique({
    where: { email: normalized },
    select: { id: true, passwordHash: true, active: true },
  });

  if (!admin) {
    // Сравнение с фиктивным хешем — чтобы время ответа не отличалось.
    await bcrypt.compare(password, DUMMY_HASH);
    return null;
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok || !admin.active) return null;

  return admin.id;
}

// Отметить успешный вход (не критично, ошибки не пробрасываем наружу).
export async function markLogin(adminId: string): Promise<void> {
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { lastLoginAt: new Date() },
  });
}
