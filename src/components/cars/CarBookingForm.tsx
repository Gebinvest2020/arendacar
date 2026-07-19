"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { Car } from "@/types/car";

// Форма заявки пока только визуальная: не создаёт заявку и не обращается к API.
export function CarBookingForm({ car }: { car: Car }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div id="booking" className="scroll-mt-24 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-ink">Оставить заявку</h3>
      <p className="mt-1 text-sm text-ink/60">
        Оставьте контакты — менеджер свяжется с вами и подтвердит бронирование
        {" "}
        <span className="font-medium text-ink">{car.fullName}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor="booking-name" className="mb-1 block text-xs font-semibold text-ink/60">
            Имя
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={field}
            placeholder="Как к вам обращаться"
          />
        </div>
        <div>
          <label htmlFor="booking-phone" className="mb-1 block text-xs font-semibold text-ink/60">
            Телефон
          </label>
          <input
            id="booking-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={field}
            placeholder="+38 (0__) ___-__-__"
          />
        </div>
        <div>
          <label htmlFor="booking-comment" className="mb-1 block text-xs font-semibold text-ink/60">
            Комментарий
          </label>
          <textarea
            id="booking-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className={`${field} h-auto py-2`}
            placeholder="Даты аренды, вопросы, пожелания"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Оставить заявку
        </Button>

        {submitted && (
          <p
            role="status"
            className="rounded-lg bg-accent/15 px-3 py-2.5 text-sm font-medium text-accent-dark"
          >
            Демо-форма. Отправка будет подключена на следующей фазе.
          </p>
        )}
      </form>
    </div>
  );
}
