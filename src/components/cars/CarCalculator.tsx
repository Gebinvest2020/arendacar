"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { calculateRental, combineDateTime } from "@/lib/pricing";
import { formatCurrency } from "@/lib/currency";
import type { Car } from "@/types/car";
import type { BookingDates } from "./CarBookingSection";

export function CarCalculator({
  car,
  dates,
  onDatesChange,
}: {
  car: Car;
  dates: BookingDates;
  onDatesChange: (patch: Partial<BookingDates>) => void;
}) {
  const t = useTranslations("calculator");
  const { pickupDate, pickupTime, returnDate, returnTime } = dates;

  const { result, errorKey } = useMemo(() => {
    const pickup = combineDateTime(pickupDate, pickupTime);
    const ret = combineDateTime(returnDate, returnTime);
    const r = calculateRental({ tiers: car.priceTiers, deposit: car.deposit, pickup, ret });
    // Определяем тип ошибки для локализованного сообщения (не зависим от текста).
    let key: "errorDates" | "errorReturn" | "errorTier" | null = null;
    if (!r.valid) {
      if (!pickup || !ret) key = "errorDates";
      else if (ret.getTime() <= pickup.getTime()) key = "errorReturn";
      else key = "errorTier";
    }
    return { result: r, errorKey: key };
  }, [pickupDate, pickupTime, returnDate, returnTime, car.priceTiers, car.deposit]);

  return (
    <div className="dr-panel p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold text-milk">{t("title")}</h3>
      <p className="mt-1 text-sm text-milk-dim">{t("subtitle")}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="calc-pickup-date" className="dr-label">{t("pickupDate")}</label>
          <input id="calc-pickup-date" type="date" value={pickupDate} onChange={(e) => onDatesChange({ pickupDate: e.target.value })} className="dr-field" />
        </div>
        <div>
          <label htmlFor="calc-pickup-time" className="dr-label">{t("pickupTime")}</label>
          <input id="calc-pickup-time" type="time" value={pickupTime} onChange={(e) => onDatesChange({ pickupTime: e.target.value })} className="dr-field" />
        </div>
        <div>
          <label htmlFor="calc-return-date" className="dr-label">{t("returnDate")}</label>
          <input id="calc-return-date" type="date" value={returnDate} onChange={(e) => onDatesChange({ returnDate: e.target.value })} className="dr-field" />
        </div>
        <div>
          <label htmlFor="calc-return-time" className="dr-label">{t("returnTime")}</label>
          <input id="calc-return-time" type="time" value={returnTime} onChange={(e) => onDatesChange({ returnTime: e.target.value })} className="dr-field" />
        </div>
      </div>

      <div className="mt-5 rounded-[3px] border border-white/10 bg-white/[0.03] p-4" aria-live="polite">
        {result.valid ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-milk-dim">{t("days")}</dt>
              <dd className="font-semibold text-milk" dir="ltr">{result.days}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-milk-dim">{t("pricePerDay")}</dt>
              <dd className="font-semibold text-milk" dir="ltr">{formatCurrency(result.pricePerDay)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <dt className="text-milk-dim">{t("rentalCost")}</dt>
              <dd className="text-lg font-extrabold text-champagne" dir="ltr">{formatCurrency(result.rentalTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-milk-dim">{t("depositSep")}</dt>
              <dd className="font-semibold text-milk" dir="ltr">{formatCurrency(result.deposit)}</dd>
            </div>
            <p className="pt-2 text-xs text-milk-dim">{t("note")}</p>
          </dl>
        ) : (
          <p className="text-sm text-milk-dim">{errorKey ? t(errorKey) : ""}</p>
        )}
      </div>
    </div>
  );
}
