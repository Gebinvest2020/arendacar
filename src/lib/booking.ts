// Утилиты для заявок на аренду: версия политики, нормализация телефона,
// короткий отображаемый номер заявки. Без внешних библиотек.

// Версия политики конфиденциальности/условий. Меняется вручную при изменении
// текста согласия. Значение задаётся ТОЛЬКО на сервере, не приходит от клиента.
export const PRIVACY_VERSION = "2026-07";

// Нормализация телефона для MVP (без международной библиотеки):
// - trim;
// - сохраняем один ведущий "+";
// - убираем пробелы, скобки, дефисы и прочие разделители;
// - оставляем только цифры (+ опциональный ведущий плюс);
// - проверяем разумную длину: 8–15 цифр (рекомендация E.164).
// Возвращает нормализованную строку или null, если номер не проходит проверку.
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 8 || digits.length > 15) return null;

  return hasPlus ? `+${digits}` : digits;
}

// Короткий человекочитаемый номер заявки ТОЛЬКО для отображения.
// Строится из существующего publicId, в БД отдельным полем не хранится
// и для поиска заявки не используется. Полный publicId остаётся уникальным.
export function formatBookingReference(publicId: string): string {
  const short = publicId.slice(-8).toUpperCase();
  return `AC-${short}`;
}
