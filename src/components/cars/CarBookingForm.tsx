"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { calculateRental, combineDateTime } from "@/lib/pricing";
import { formatCurrency } from "@/lib/currency";
import type { Car } from "@/types/car";
import type { BookingDates } from "./CarBookingSection";

// Данные успешной заявки, которые возвращает сервер (без секретов и внутренних id).
type BookingResult = {
  publicId: string;
  reference: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
};

const dateTimeFmt = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateTimeFmt.format(d);
}

export function CarBookingForm({ car, dates }: { car: Car; dates: BookingDates }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<BookingResult | null>(null);

  // Один ключ идемпотентности на одну попытку: повторные клики используют тот же
  // ключ, поэтому дубль на сервере не создаётся.
  const idempotencyKeyRef = useRef<string | null>(null);

  // Ориентировочный расчёт по общим датам (для подсказки перед отправкой).
  const estimate = useMemo(() => {
    const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
    const ret = combineDateTime(dates.returnDate, dates.returnTime);
    return calculateRental({
      tiers: car.priceTiers,
      deposit: car.deposit,
      pickup,
      ret,
    });
  }, [dates, car.priceTiers, car.deposit]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || success) return; // блок повторного submit и submit после успеха

    setError(null);
    setFieldErrors({});

    const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
    const ret = combineDateTime(dates.returnDate, dates.returnTime);

    if (!pickup || !ret) {
      setError("Укажите даты и время получения и возврата в блоке расчёта выше.");
      return;
    }
    if (ret.getTime() <= pickup.getTime()) {
      setError("Дата возврата должна быть позже даты получения.");
      return;
    }

    // Ключ создаём один раз на попытку.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carSlug: car.slug,
          pickupDate: pickup.toISOString(),
          returnDate: ret.toISOString(),
          customerName: name,
          customerPhone: phone,
          customerEmail: email.trim() ? email.trim() : undefined,
          comment: comment.trim() ? comment.trim() : undefined,
          consent,
          idempotencyKey: idempotencyKeyRef.current,
          website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && data.booking) {
        setSuccess(data.booking as BookingResult);
        return;
      }

      // Ошибка: показываем понятное сообщение и подсветку полей.
      if (data?.fields && typeof data.fields === "object") {
        setFieldErrors(data.fields as Record<string, string>);
      }
      setError(
        (data?.message as string) ??
          "Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.",
      );
    } catch {
      setError("Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  const errText = "mt-1 text-xs font-medium text-red-600";

  // Экран успеха.
  if (success) {
    return (
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white" aria-hidden="true">
            ✓
          </span>
          <h3 className="text-lg font-bold text-ink">Заявка отправлена</h3>
        </div>
        <p className="mt-2 text-sm text-ink/70">
          Мы получили заявку и свяжемся с вами для подтверждения.
        </p>

        <dl className="mt-4 space-y-2 rounded-xl bg-muted p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/60">Номер заявки</dt>
            <dd className="font-bold text-ink">{success.reference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Автомобиль</dt>
            <dd className="font-semibold text-ink">{success.carName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Получение</dt>
            <dd className="font-semibold text-ink">{formatDateTime(success.pickupDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Возврат</dt>
            <dd className="font-semibold text-ink">{formatDateTime(success.returnDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Количество суток</dt>
            <dd className="font-semibold text-ink">{success.rentalDays}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Цена за сутки</dt>
            <dd className="font-semibold text-ink">{formatCurrency(success.dailyRate)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2">
            <dt className="text-ink/60">Стоимость аренды</dt>
            <dd className="text-base font-extrabold text-ink">{formatCurrency(success.rentalTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">Залог (возвратный, отдельно)</dt>
            <dd className="font-semibold text-ink">{formatCurrency(success.depositAmount)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-ink/50">
          Это заявка, а не подтверждённое бронирование. Залог не входит в стоимость
          аренды и возвращается после сдачи автомобиля.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-ink">Оставить заявку</h3>
      <p className="mt-1 text-sm text-ink/60">
        Оставьте контакты — менеджер свяжется с вами и подтвердит бронирование{" "}
        <span className="font-medium text-ink">{car.fullName}</span>. Даты берутся из
        расчёта выше.
      </p>

      {/* Краткий итог по выбранным датам */}
      {estimate.valid && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl bg-muted px-4 py-3 text-sm">
          <span className="text-ink/60">Срок: <b className="text-ink">{estimate.days} сут.</b></span>
          <span className="text-ink/60">Аренда: <b className="text-ink">{formatCurrency(estimate.rentalTotal)}</b></span>
          <span className="text-ink/60">Залог: <b className="text-ink">{formatCurrency(estimate.deposit)}</b></span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
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
            disabled={loading}
          />
          {fieldErrors.customerName && <p className={errText}>{fieldErrors.customerName}</p>}
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
            disabled={loading}
          />
          {fieldErrors.customerPhone && <p className={errText}>{fieldErrors.customerPhone}</p>}
        </div>

        <div>
          <label htmlFor="booking-email" className="mb-1 block text-xs font-semibold text-ink/60">
            Email <span className="font-normal text-ink/40">(необязательно)</span>
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={field}
            placeholder="you@example.com"
            disabled={loading}
          />
          {fieldErrors.customerEmail && <p className={errText}>{fieldErrors.customerEmail}</p>}
        </div>

        <div>
          <label htmlFor="booking-comment" className="mb-1 block text-xs font-semibold text-ink/60">
            Комментарий <span className="font-normal text-ink/40">(необязательно)</span>
          </label>
          <textarea
            id="booking-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className={`${field} h-auto py-2`}
            placeholder="Пожелания, вопросы"
            disabled={loading}
          />
          {fieldErrors.comment && <p className={errText}>{fieldErrors.comment}</p>}
        </div>

        {/* Honeypot — скрытое поле-ловушка для ботов. Человек его не видит. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="booking-website">Не заполняйте это поле</label>
          <input
            id="booking-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-accent focus-visible:ring-2 focus-visible:ring-accent"
            disabled={loading}
          />
          <span>Я согласен(на) на обработку персональных данных и с условиями аренды.</span>
        </label>
        {fieldErrors.consent && <p className={errText}>{fieldErrors.consent}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? "Отправляем…" : "Забронировать"}
        </Button>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
