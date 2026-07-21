import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/currency";
import { formatBookingReference } from "@/lib/booking";
import { formatDateRange, phoneDigits, BOOKING_LOCALE_SHORT } from "@/lib/admin";
import type { AdminBookingListItem } from "@/types/booking";

// Карточка заявки для телефона/планшета. Крупные touch-цели (h-11 ≈ 44px).
export function BookingCard({ b }: { b: AdminBookingListItem }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={b.status} big />
        <span className="text-xs font-medium text-ink/50">{formatBookingReference(b.publicId)}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="text-base font-bold text-ink">{b.carName}</p>
        {b.withDriver && (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent-dark">
            С водителем
          </span>
        )}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-ink/70">
          {BOOKING_LOCALE_SHORT[b.bookingLocale] ?? b.bookingLocale}
        </span>
      </div>

      <div className="mt-2 text-sm text-ink/80">
        <p className="font-medium text-ink">{b.customerName}</p>
        <p className="text-ink/60">{b.customerPhone}</p>
      </div>

      <div className="mt-3 text-sm">
        <p className="text-ink">{formatDateRange(b.pickupDate, b.returnDate)}</p>
        <p className="text-ink/60">{b.rentalDays} сут.</p>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="text-ink/60">Аренда: <b className="text-ink">{formatCurrency(b.rentalTotal)}</b></span>
        <span className="text-ink/60">Залог: <b className="text-ink">{formatCurrency(b.depositAmount)}</b></span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${phoneDigits(b.customerPhone)}`}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-line px-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Позвонить
        </a>
        <Link
          href={`/admin/bookings/${b.publicId}`}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-ink px-3 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
        >
          Открыть
        </Link>
      </div>
    </div>
  );
}
