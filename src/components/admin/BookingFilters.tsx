import Link from "next/link";
import { STATUS_LABELS, STATUS_VALUES } from "@/lib/admin";
import type { BookingStatus } from "@/types/booking";

// Фильтры списка заявок. Обычная GET-форма — состояние живёт в URL, без JS и без
// хранения персональных данных в localStorage. Смена фильтра сбрасывает на 1-ю
// страницу (page в форму не включаем).
export function BookingFilters({
  search,
  status,
  carId,
  cars,
}: {
  search?: string;
  status?: BookingStatus;
  carId?: string;
  cars: { id: string; fullName: string }[];
}) {
  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <form method="get" action="/admin/bookings" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-2">
        <label htmlFor="f-search" className="mb-1 block text-xs font-semibold text-ink/60">
          Поиск
        </label>
        <input
          id="f-search"
          type="search"
          name="search"
          defaultValue={search ?? ""}
          maxLength={100}
          placeholder="Номер, имя, телефон, email, авто"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="f-status" className="mb-1 block text-xs font-semibold text-ink/60">
          Статус
        </label>
        <select id="f-status" name="status" defaultValue={status ?? ""} className={field}>
          <option value="">Все статусы</option>
          {STATUS_VALUES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-car" className="mb-1 block text-xs font-semibold text-ink/60">
          Автомобиль
        </label>
        <select id="f-car" name="carId" defaultValue={carId ?? ""} className={field}>
          <option value="">Все авто</option>
          {cars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
        <button
          type="submit"
          className="h-11 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
        >
          Применить
        </button>
        <Link
          href="/admin/bookings"
          className="inline-flex h-11 items-center rounded-lg border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Сбросить
        </Link>
      </div>
    </form>
  );
}
