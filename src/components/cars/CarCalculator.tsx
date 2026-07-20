"use client";

import { useMemo } from "react";
import { calculateRental, combineDateTime } from "@/lib/pricing";
import { formatCurrency } from "@/lib/currency";
import type { Car } from "@/types/car";
import type { BookingDates } from "./CarBookingSection";

// Калькулятор больше не хранит собственный state дат — получает их из
// CarBookingSection через props, чтобы даты выбирались один раз для расчёта и
// формы. Отвечает только за отображение ориентировочного расчёта.
export function CarCalculator({
  car,
  dates,
  onDatesChange,
}: {
  car: Car;
  dates: BookingDates;
  onDatesChange: (patch: Partial<BookingDates>) => void;
}) {
  const { pickupDate, pickupTime, returnDate, returnTime } = dates;

  const result = useMemo(() => {
    const pickup = combineDateTime(pickupDate, pickupTime);
    const ret = combineDateTime(returnDate, returnTime);
    return calculateRental({
      tiers: car.priceTiers,
      deposit: car.deposit,
      pickup,
      ret,
    });
  }, [pickupDate, pickupTime, returnDate, returnTime, car.priceTiers, car.deposit]);

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-ink">Предварительный расчёт</h3>
      <p className="mt-1 text-sm text-ink/60">
        Демонстрационный расчёт. Итоговую стоимость подтверждает менеджер.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="calc-pickup-date" className="mb-1 block text-xs font-semibold text-ink/60">
            Дата получения
          </label>
          <input id="calc-pickup-date" type="date" value={pickupDate} onChange={(e) => onDatesChange({ pickupDate: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-pickup-time" className="mb-1 block text-xs font-semibold text-ink/60">
            Время получения
          </label>
          <input id="calc-pickup-time" type="time" value={pickupTime} onChange={(e) => onDatesChange({ pickupTime: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-return-date" className="mb-1 block text-xs font-semibold text-ink/60">
            Дата возврата
          </label>
          <input id="calc-return-date" type="date" value={returnDate} onChange={(e) => onDatesChange({ returnDate: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-return-time" className="mb-1 block text-xs font-semibold text-ink/60">
            Время возврата
          </label>
          <input id="calc-return-time" type="time" value={returnTime} onChange={(e) => onDatesChange({ returnTime: e.target.value })} className={field} />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-muted p-4" aria-live="polite">
        {result.valid ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Количество суток</dt>
              <dd className="font-semibold text-ink">{result.days}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Цена за сутки (по сроку)</dt>
              <dd className="font-semibold text-ink">{formatCurrency(result.pricePerDay)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-ink/60">Стоимость аренды</dt>
              <dd className="text-base font-extrabold text-ink">{formatCurrency(result.rentalTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Залог (возвратный, отдельно)</dt>
              <dd className="font-semibold text-ink">{formatCurrency(result.deposit)}</dd>
            </div>
            <p className="pt-2 text-xs text-ink/50">
              Залог не входит в стоимость аренды и возвращается после сдачи
              автомобиля. Итог предварительный.
            </p>
          </dl>
        ) : (
          <p className="text-sm text-ink/60">{result.error}</p>
        )}
      </div>
    </div>
  );
}
