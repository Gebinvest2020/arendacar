"use client";

import { useState, useCallback } from "react";
import { CarCalculator } from "./CarCalculator";
import { CarBookingForm } from "./CarBookingForm";
import type { Car } from "@/types/car";

// Общий тип дат аренды. Владелец state — эта секция; калькулятор и форма
// получают одни и те же значения (даты выбираются один раз).
export type BookingDates = {
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:MM
  returnDate: string;
  returnTime: string;
};

export function CarBookingSection({ car }: { car: Car }) {
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
      {/* Блок 1 — расчёт стоимости */}
      <section id="calculator" className="scroll-mt-24" aria-labelledby="calc-heading">
        <h2 id="calc-heading" className="text-2xl font-bold tracking-tight text-ink">
          Расчёт стоимости аренды
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarCalculator car={car} dates={dates} onDatesChange={onDatesChange} />
        </div>
      </section>

      {/* Блок 2 — форма бронирования (те же даты) */}
      <section id="booking" className="scroll-mt-24" aria-labelledby="booking-heading">
        <h2 id="booking-heading" className="text-2xl font-bold tracking-tight text-ink">
          Бронирование
        </h2>
        <div className="mt-5 max-w-2xl">
          <CarBookingForm car={car} dates={dates} />
        </div>
      </section>
    </div>
  );
}
