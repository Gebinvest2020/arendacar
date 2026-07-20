import Link from "next/link";
import { StatusSelect } from "./StatusSelect";
import { formatCurrency } from "@/lib/currency";
import { formatBookingReference } from "@/lib/booking";
import { formatDateTime, phoneDigits, whatsappLink, SOURCE_LABELS } from "@/lib/admin";
import type { AdminBookingDetail } from "@/types/booking";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-3 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-ink/50">{label}</dt>
      <dd className="text-sm font-medium text-ink sm:text-right">{children}</dd>
    </div>
  );
}

export function BookingDetail({ b }: { b: AdminBookingDetail }) {
  const wa = whatsappLink(b.customerPhone);
  const action =
    "inline-flex h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-ink";

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center text-sm font-medium text-ink/70 hover:text-ink">
        ← К списку
      </Link>

      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-ink/50">Заявка</p>
            <p className="text-xl font-extrabold text-ink">{formatBookingReference(b.publicId)}</p>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-ink/50">Статус</span>
            <StatusSelect publicId={b.publicId} current={b.status} />
          </div>
        </div>

        {/* Действия менеджера */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${phoneDigits(b.customerPhone)}`} className={action}>Позвонить</a>
          {b.customerEmail && (
            <a href={`mailto:${b.customerEmail}`} className={action}>Написать email</a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className={action}>WhatsApp</a>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <dl className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink/50">Клиент</h2>
          <Row label="Имя">{b.customerName}</Row>
          <Row label="Телефон">{b.customerPhone}</Row>
          <Row label="Email">{b.customerEmail ?? "—"}</Row>
          <Row label="Комментарий">{b.comment ?? "—"}</Row>
          <Row label="Создана">{formatDateTime(b.createdAt)}</Row>
          <Row label="Источник">{SOURCE_LABELS[b.source] ?? b.source}</Row>
        </dl>

        <dl className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink/50">Аренда</h2>
          <Row label="Автомобиль">{b.carName}</Row>
          <Row label="Место получения">{b.cityName}</Row>
          <Row label="Получение">{formatDateTime(b.pickupDate)}</Row>
          <Row label="Возврат">{formatDateTime(b.returnDate)}</Row>
          <Row label="Количество суток">{b.rentalDays}</Row>
          <Row label="Цена за сутки">{formatCurrency(b.dailyRate)}</Row>
          <Row label="Стоимость аренды">{formatCurrency(b.rentalTotal)}</Row>
          <Row label="Залог (отдельно)">{formatCurrency(b.depositAmount)}</Row>
        </dl>
      </div>
    </div>
  );
}
