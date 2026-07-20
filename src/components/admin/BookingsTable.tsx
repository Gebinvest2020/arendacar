import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/currency";
import { formatBookingReference } from "@/lib/booking";
import { formatDateShort, formatDateRange, phoneDigits } from "@/lib/admin";
import type { AdminBookingListItem } from "@/types/booking";

// Таблица заявок для компьютера. Обёрнута в overflow-x-auto (страница никогда не
// прокручивается вбок); на 1440px помещается без прокрутки.
export function BookingsTable({ items }: { items: AdminBookingListItem[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[880px] text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted text-xs uppercase text-ink/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Создана</th>
            <th className="px-4 py-3 font-semibold">Номер</th>
            <th className="px-4 py-3 font-semibold">Клиент</th>
            <th className="px-4 py-3 font-semibold">Телефон</th>
            <th className="px-4 py-3 font-semibold">Автомобиль</th>
            <th className="px-4 py-3 font-semibold">Даты</th>
            <th className="px-4 py-3 font-semibold">Сумма</th>
            <th className="px-4 py-3 font-semibold">Статус</th>
            <th className="px-4 py-3 font-semibold">Действие</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((b) => (
            <tr key={b.publicId} className="align-middle hover:bg-muted/50">
              <td className="whitespace-nowrap px-4 py-3 text-ink/60">{formatDateShort(b.createdAt)}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{formatBookingReference(b.publicId)}</td>
              <td className="px-4 py-3 text-ink">{b.customerName}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <a href={`tel:${phoneDigits(b.customerPhone)}`} className="text-ink/80 underline-offset-2 hover:underline">
                  {b.customerPhone}
                </a>
              </td>
              <td className="px-4 py-3 text-ink">{b.carName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink/80">
                {formatDateRange(b.pickupDate, b.returnDate)}
                <span className="text-ink/50"> · {b.rentalDays} сут.</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span className="font-semibold text-ink">{formatCurrency(b.rentalTotal)}</span>
                <span className="text-ink/50"> + залог {formatCurrency(b.depositAmount)}</span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
              <td className="whitespace-nowrap px-4 py-3">
                <Link href={`/admin/bookings/${b.publicId}`} className="font-semibold text-accent-dark hover:underline">
                  Открыть
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
