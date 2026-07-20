// Zod-схемы админки. Все строгие (strict): лишние поля отклоняются.
// Пароль здесь только проверяется по длине; хешируется на сервере, никуда не
// логируется и не возвращается.

import { z } from "zod";

// Нормализация email (trim + lowercase) встроена в схему, чтобы уникальность и
// вход работали по одному значению.
const normalizedEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Неверный email или пароль.").max(254));

export const loginSchema = z
  .object({
    email: normalizedEmail,
    password: z
      .string()
      .min(12, "Неверный email или пароль.")
      .max(128, "Неверный email или пароль."),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;

// Смена статуса заявки: принимает ТОЛЬКО status из допустимого набора.
export const statusUpdateSchema = z
  .object({
    status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  })
  .strict();

export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;

// publicId заявки (cuid — строчные буквы и цифры).
export const publicIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(40)
  .regex(/^[a-z0-9]+$/i, "Некорректный идентификатор.");

// Параметры списка заявок (query). Неизвестные ключи игнорируем (не strict —
// в query могут прилетать посторонние параметры), но берём только нужные.
export const bookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  carId: z.string().trim().max(40).optional(),
  search: z.string().trim().max(100).optional(),
});

export type BookingsQuery = z.infer<typeof bookingsQuerySchema>;

// Простая нормализация email для скрипта создания админа (без Zod-пайпа).
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
