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

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-ink">{t("title")}</h3>
      <p className="mt-1 text-sm text-ink/60">{t("subtitle")}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="calc-pickup-date" className="mb-1 block text-xs font-semibold text-ink/60">{t("pickupDate")}</label>
          <input id="calc-pickup-date" type="date" value={pickupDate} onChange={(e) => onDatesChange({ pickupDate: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-pickup-time" className="mb-1 block text-xs font-semibold text-ink/60">{t("pickupTime")}</label>
          <input id="calc-pickup-time" type="time" value={pickupTime} onChange={(e) => onDatesChange({ pickupTime: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-return-date" className="mb-1 block text-xs font-semibold text-ink/60">{t("returnDate")}</label>
          <input id="calc-return-date" type="date" value={returnDate} onChange={(e) => onDatesChange({ returnDate: e.target.value })} className={field} />
        </div>
        <div>
          <label htmlFor="calc-return-time" className="mb-1 block text-xs font-semibold text-ink/60">{t("returnTime")}</label>
          <input id="calc-return-time" type="time" value={returnTime} onChange={(e) => onDatesChange({ returnTime: e.target.value })} className={field} />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-muted p-4" aria-live="polite">
        {result.valid ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">{t("days")}</dt>
              <dd className="font-semibold text-ink" dir="ltr">{result.days}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">{t("pricePerDay")}</dt>
              <dd className="font-semibold text-ink" dir="ltr">{formatCurrency(result.pricePerDay)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-ink/60">{t("rentalCost")}</dt>
              <dd className="text-base font-extrabold text-ink" dir="ltr">{formatCurrency(result.rentalTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">{t("depositSep")}</dt>
              <dd className="font-semibold text-ink" dir="ltr">{formatCurrency(result.deposit)}</dd>
            </div>
            <p className="pt-2 text-xs text-ink/50">{t("note")}</p>
          </dl>
        ) : (
          <p className="text-sm text-ink/60">{errorKey ? t(errorKey) : ""}</p>
        )}
      </div>
    </div>
  );
}
