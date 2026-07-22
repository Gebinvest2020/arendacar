"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { calculateRental, combineDateTime } from "@/lib/pricing";
import { formatCurrency } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import type { Car } from "@/types/car";
import type { BookingDates } from "./CarBookingSection";

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
  withDriver: boolean;
};

const BCP47: Record<Locale, string> = { ru: "ru-RU", en: "en-US", uk: "uk-UA", he: "he-IL" };

export function CarBookingForm({ car, dates }: { car: Car; dates: BookingDates }) {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [withDriver, setWithDriver] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<BookingResult | null>(null);

  const idempotencyKeyRef = useRef<string | null>(null);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(BCP47[locale], { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  );
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d);
  };

  const estimate = useMemo(() => {
    const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
    const ret = combineDateTime(dates.returnDate, dates.returnTime);
    return calculateRental({ tiers: car.priceTiers, deposit: car.deposit, pickup, ret });
  }, [dates, car.priceTiers, car.deposit]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || success) return;

    setError(null);
    setFieldErrors({});

    const pickup = combineDateTime(dates.pickupDate, dates.pickupTime);
    const ret = combineDateTime(dates.returnDate, dates.returnTime);

    if (!pickup || !ret) {
      setError(t("errorDates"));
      return;
    }
    if (ret.getTime() <= pickup.getTime()) {
      setError(t("errorReturn"));
      return;
    }

    if (!idempotencyKeyRef.current) idempotencyKeyRef.current = crypto.randomUUID();

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
          withDriver, // boolean
          locale, // из текущего URL
          idempotencyKey: idempotencyKeyRef.current,
          website,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && data.booking) {
        setSuccess(data.booking as BookingResult);
        return;
      }
      if (data?.fields && typeof data.fields === "object") {
        setFieldErrors(data.fields as Record<string, string>);
      }
      setError((data?.message as string) ?? t("errorGeneric"));
    } catch {
      setError(t("errorServer"));
    } finally {
      setLoading(false);
    }
  }

  const field = "dr-field";
  const errText = "mt-1 text-xs font-medium text-red-400";

  if (success) {
    return (
      <div className="dr-panel p-5 sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white" aria-hidden="true">✓</span>
          <h3 className="font-display text-xl font-semibold text-milk">{t("successTitle")}</h3>
        </div>
        <p className="mt-2 text-sm text-milk/75">{t("successText")}</p>

        <dl className="mt-4 space-y-2 rounded-[3px] border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="flex justify-between"><dt className="text-milk-dim">{t("reference")}</dt><dd className="font-bold text-champagne" dir="ltr">{success.reference}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("car")}</dt><dd className="font-semibold text-milk" dir="ltr">{success.carName}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("pickup")}</dt><dd className="font-semibold text-milk">{formatDateTime(success.pickupDate)}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("return")}</dt><dd className="font-semibold text-milk">{formatDateTime(success.returnDate)}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("days")}</dt><dd className="font-semibold text-milk" dir="ltr">{success.rentalDays}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("pricePerDay")}</dt><dd className="font-semibold text-milk" dir="ltr">{formatCurrency(success.dailyRate)}</dd></div>
          <div className="flex justify-between border-t border-white/10 pt-2"><dt className="text-milk-dim">{t("rentalCost")}</dt><dd className="text-base font-extrabold text-champagne" dir="ltr">{formatCurrency(success.rentalTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("depositSep")}</dt><dd className="font-semibold text-milk" dir="ltr">{formatCurrency(success.depositAmount)}</dd></div>
          <div className="flex justify-between"><dt className="text-milk-dim">{t("driver")}</dt><dd className="font-semibold text-milk">{success.withDriver ? t("driverRequired") : t("driverNotRequired")}</dd></div>
        </dl>

        <p className="mt-3 text-xs text-milk-dim">{t("disclaimer")}</p>
      </div>
    );
  }

  const driverCard = (active: boolean) =>
    `flex-1 cursor-pointer rounded-[3px] border px-4 py-3 text-sm font-semibold transition-colors ${
      active ? "border-champagne bg-champagne/10 text-milk" : "border-white/12 text-milk/70 hover:border-white/30"
    }`;

  return (
    <div className="dr-panel p-5 sm:p-6">
      <h3 className="font-display text-xl font-semibold text-milk">{t("formTitle")}</h3>
      <p className="mt-1 text-sm text-milk-dim">
        {t("formSubtitle", { car: car.fullName })}
      </p>

      {estimate.valid && (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-[3px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
          <span className="text-milk/70">{t("recapDays", { days: estimate.days })}</span>
          <span className="text-milk/70">{t("recapRent", { price: formatCurrency(estimate.rentalTotal) })}</span>
          <span className="text-milk/70">{t("recapDeposit", { price: formatCurrency(estimate.deposit) })}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        {/* Выбор водителя */}
        <div>
          <span className="dr-label">{t("driverTitle")}</span>
          <div className="flex gap-2">
            <label className={driverCard(!withDriver)}>
              <input type="radio" name="withDriver" className="sr-only" checked={!withDriver} onChange={() => setWithDriver(false)} disabled={loading} />
              {t("driverWithout")}
            </label>
            <label className={driverCard(withDriver)}>
              <input type="radio" name="withDriver" className="sr-only" checked={withDriver} onChange={() => setWithDriver(true)} disabled={loading} />
              {t("driverWith")}
            </label>
          </div>
          {withDriver && (
            <p className="mt-2 rounded-[3px] border border-champagne/25 bg-champagne/10 px-3 py-2 text-xs font-medium text-champagne">{t("driverNote")}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-name" className="dr-label">{t("name")}</label>
          <input id="booking-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} placeholder={t("namePlaceholder")} disabled={loading} />
          {fieldErrors.customerName && <p className={errText}>{fieldErrors.customerName}</p>}
        </div>

        <div>
          <label htmlFor="booking-phone" className="dr-label">{t("phone")}</label>
          <input id="booking-phone" type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={field} placeholder="+38 (0__) ___-__-__" disabled={loading} />
          {fieldErrors.customerPhone && <p className={errText}>{fieldErrors.customerPhone}</p>}
        </div>

        <div>
          <label htmlFor="booking-email" className="dr-label">{t("email")} <span className="font-normal text-milk/40">{t("optional")}</span></label>
          <input id="booking-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} placeholder="you@example.com" disabled={loading} />
          {fieldErrors.customerEmail && <p className={errText}>{fieldErrors.customerEmail}</p>}
        </div>

        <div>
          <label htmlFor="booking-comment" className="dr-label">{t("comment")} <span className="font-normal text-milk/40">{t("optional")}</span></label>
          <textarea id="booking-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className={`${field} dr-field--area`} placeholder={t("commentPlaceholder")} disabled={loading} />
          {fieldErrors.comment && <p className={errText}>{fieldErrors.comment}</p>}
        </div>

        {/* Honeypot */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="booking-website">Do not fill</label>
          <input id="booking-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <label className="flex items-start gap-2 text-sm text-milk/75">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 rounded-[2px] border-white/25 bg-transparent accent-champagne focus-visible:ring-2 focus-visible:ring-champagne/50" disabled={loading} />
          <span>{t("consent")}</span>
        </label>
        {fieldErrors.consent && <p className={errText}>{fieldErrors.consent}</p>}

        <Button type="submit" variant="champagne" size="lg" className="w-full" disabled={loading}>
          {loading ? t("submitting") : t("submit")}
        </Button>

        {error && (
          <p role="alert" className="rounded-[3px] border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-medium text-red-300">{error}</p>
        )}
      </form>
    </div>
  );
}
