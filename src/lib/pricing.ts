// Предварительный расчёт стоимости аренды.
// ВАЖНО: это демонстрационный расчёт на клиенте. В будущей рабочей форме
// цену нужно пересчитывать на сервере и не доверять этому результату.

import type { PriceTier } from "@/types/car";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Количество суток: неполные сутки округляются вверх, минимум 1 сутки.
// Возвращает 0, если интервал некорректный (возврат не позже получения).
export function getRentalDays(pickup: Date, ret: Date): number {
  const ms = ret.getTime() - pickup.getTime();
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / MS_PER_DAY));
}

// Подбор тарифа по количеству суток. Если точный диапазон не найден —
// берём последний (самый длительный) тариф.
export function selectPriceTier(tiers: PriceTier[], days: number): PriceTier | null {
  if (days < 1 || tiers.length === 0) return null;
  const match = tiers.find(
    (t) => days >= t.minDays && (t.maxDays === null || days <= t.maxDays),
  );
  return match ?? tiers[tiers.length - 1];
}

export type RentalCalculation =
  | {
      valid: true;
      days: number;
      pricePerDay: number;
      rentalTotal: number; // стоимость аренды (без залога)
      deposit: number; // возвратный залог — отдельно, НЕ прибавляется к аренде
    }
  | { valid: false; error: string };

export function calculateRental(input: {
  tiers: PriceTier[];
  deposit: number;
  pickup: Date | null;
  ret: Date | null;
}): RentalCalculation {
  const { tiers, deposit, pickup, ret } = input;

  if (
    !pickup ||
    !ret ||
    Number.isNaN(pickup.getTime()) ||
    Number.isNaN(ret.getTime())
  ) {
    return { valid: false, error: "Укажите дату и время получения и возврата." };
  }

  if (ret.getTime() <= pickup.getTime()) {
    return {
      valid: false,
      error: "Дата и время возврата должны быть позже получения.",
    };
  }

  const days = getRentalDays(pickup, ret);
  const tier = selectPriceTier(tiers, days);
  if (!tier) {
    return { valid: false, error: "Не удалось подобрать тариф." };
  }

  return {
    valid: true,
    days,
    pricePerDay: tier.pricePerDay,
    rentalTotal: tier.pricePerDay * days,
    deposit, // отдельно от аренды
  };
}

// Собирает Date из полей «дата» (YYYY-MM-DD) и «время» (HH:MM). Пустые -> null.
export function combineDateTime(date: string, time: string): Date | null {
  if (!date) return null;
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  const d = new Date(`${date}T${t}`);
  return Number.isNaN(d.getTime()) ? null : d;
}
