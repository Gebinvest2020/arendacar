// Чистые хелперы админки (без server-only и без Prisma) — можно использовать и в
// серверных, и в клиентских компонентах.

import type { BookingStatus } from "@/types/booking";

// Русские подписи статусов для интерфейса.
export const STATUS_LABELS: Record<BookingStatus, string> = {
  NEW: "Новая",
  CONTACTED: "Связались",
  CONFIRMED: "Подтверждена",
  CANCELLED: "Отменена",
  COMPLETED: "Завершена",
};

export const STATUS_VALUES: BookingStatus[] = [
  "NEW",
  "CONTACTED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

// Цвета бейджа статуса (Tailwind-классы).
export const STATUS_STYLES: Record<BookingStatus, string> = {
  NEW: "bg-accent/15 text-accent-dark",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-ink/10 text-ink",
};

// Подписи источника заявки.
export const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: "Сайт",
  PHONE: "Телефон",
  ADMIN: "Админка",
};

const shortFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" });

// Короткая дата: "20 июл."
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : shortFmt.format(d);
}

// Дата+время: "20 июл. 2026 г., 10:00"
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateTimeFmt.format(d);
}

// Диапазон дат: "20 июл. → 22 июл."
export function formatDateRange(pickupIso: string, returnIso: string): string {
  return `${formatDateShort(pickupIso)} → ${formatDateShort(returnIso)}`;
}

// Только цифры телефона (для tel: и WhatsApp). Ведущий + отбрасываем.
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Ссылка WhatsApp только если после очистки 8–15 цифр, иначе null.
export function whatsappLink(phone: string): string | null {
  const d = phoneDigits(phone);
  if (d.length < 8 || d.length > 15) return null;
  return `https://wa.me/${d}`;
}
