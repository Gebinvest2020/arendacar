// Zod-схема входных данных заявки. Строгая: неизвестные поля отклоняются.
// Клиент может прислать ТОЛЬКО перечисленные поля. Любые ценовые/служебные
// поля (dailyRate, rentalTotal, depositAmount, rentalDays, status, source,
// consentAcceptedAt, privacyVersion, publicId) сюда не входят и будут
// отвергнуты как «unrecognized keys».

import { z } from "zod";
import { LOCALES } from "@/lib/locale";

// Проверка ISO datetime: строка должна корректно парситься в дату.
const isoDateTime = z
  .string()
  .min(1, "Укажите дату.")
  .max(40, "Некорректная дата.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Некорректная дата.");

export const bookingInputSchema = z
  .object({
    carSlug: z
      .string()
      .trim()
      .min(1, "Не указан автомобиль.")
      .max(120, "Некорректный автомобиль."),
    pickupDate: isoDateTime,
    returnDate: isoDateTime,
    customerName: z
      .string()
      .trim()
      .min(2, "Имя слишком короткое.")
      .max(100, "Имя слишком длинное."),
    customerPhone: z
      .string()
      .trim()
      .min(1, "Укажите телефон.")
      .max(30, "Телефон слишком длинный."),
    customerEmail: z
      .email("Некорректный email.")
      .max(254, "Email слишком длинный.")
      .optional(),
    comment: z
      .string()
      .trim()
      .max(1000, "Комментарий слишком длинный (максимум 1000 символов).")
      .optional(),
    consent: z.literal(true, {
      message: "Необходимо согласие с условиями.",
    }),
    // Нужен ли водитель. Строгий boolean: строка "true" НЕ принимается.
    // Дефолт false — чтобы форма без этого поля пока продолжала работать.
    withDriver: z.boolean({ message: "Некорректный выбор водителя." }).default(false),
    // Язык оформления заявки. Неизвестные значения отклоняются; по умолчанию ru.
    locale: z.enum(LOCALES, { message: "Некорректный язык." }).default("ru"),
    idempotencyKey: z.uuid("Некорректный ключ запроса."),
    // Honeypot: скрытое поле-ловушка. Для человека всегда пустое.
    website: z.string().max(100).optional(),
  })
  .strict();

export type BookingInput = z.infer<typeof bookingInputSchema>;
