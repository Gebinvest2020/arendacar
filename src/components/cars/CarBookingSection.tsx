"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CarCalculator } from "./CarCalculator";
import { CarBookingForm } from "./CarBookingForm";
import type { Car } from "@/types/car";

// Общий тип дат аренды. Владелец state — эта секция; калькулятор и форма
// получают одни и те же значения (даты выбираются один раз).
export type BookingDates = {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
};

export function CarBookingSection({ car }: { car: Car }) {
  const t = useTranslations("carPage");
  const [dates, setDates] = useState<BookingDates>({
    pickupDate: "",
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
  });

  const onDatesChange = useCallback((patch: Partial<BookingDates>) => {
    setDates((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <div className="space-y-12">
      <section id="calculator" className="scroll-mt-24" aria-labelledby="calc-heading">
        <h2 id="calc-heading" className="text-2xl font-bold tracking-tight text-ink">
          {t("calcSectionTitle")}
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarCalculator car={car} dates={dates} onDatesChange={onDatesChange} />
        </div>
      </section>

      <section id="booking" className="scroll-mt-24" aria-labelledby="booking-heading">
        <h2 id="booking-heading" className="text-2xl font-bold tracking-tight text-ink">
          {t("bookingSectionTitle")}
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarBookingForm car={car} dates={dates} />
        </div>
      </section>
    </div>
  );
}
