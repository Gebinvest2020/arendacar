// Единое форматирование денег для всего сайта. Валюта — USD (тестовые данные).
// Все компоненты должны использовать эти функции, а не форматировать вручную.

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Пример: 22 -> "$22", 1000 -> "$1,000", 2450 -> "$2,450"
export function formatCurrency(value: number): string {
  return usdFormatter.format(value);
}

// Пример: 22 -> "$22/сутки"
export function formatDailyPrice(value: number): string {
  return `${formatCurrency(value)}/сутки`;
}
