import { requireAdminPage } from "@/server/admin/session";
import { listBookings, listCarsForFilter } from "@/server/admin/bookings";
import { bookingsQuerySchema } from "@/lib/validation/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingFilters } from "@/components/admin/BookingFilters";
import { BookingCard } from "@/components/admin/BookingCard";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { Pagination } from "@/components/admin/Pagination";

export const dynamic = "force-dynamic";

type SP = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  // 1. Сначала настоящая проверка сессии (иначе redirect на /admin/login).
  const admin = await requireAdminPage("/admin/bookings");

  // 2. Валидация параметров (некорректные заменяются дефолтами).
  const sp = await searchParams;
  const raw = {
    page: str(sp.page),
    pageSize: str(sp.pageSize),
    status: str(sp.status),
    carId: str(sp.carId),
    search: str(sp.search),
  };
  const parsed = bookingsQuerySchema.safeParse(raw);
  const query = parsed.success ? parsed.data : bookingsQuerySchema.parse({});

  // 3. Только теперь читаем данные.
  const [data, cars] = await Promise.all([
    listBookings(admin, query),
    listCarsForFilter(admin),
  ]);

  // Ссылка пагинации с сохранением текущих фильтров.
  function makeHref(page: number): string {
    const p = new URLSearchParams();
    if (query.search) p.set("search", query.search);
    if (query.status) p.set("status", query.status);
    if (query.carId) p.set("carId", query.carId);
    if (query.pageSize !== 20) p.set("pageSize", String(query.pageSize));
    p.set("page", String(page));
    return `/admin/bookings?${p.toString()}`;
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-xl font-bold text-ink">Заявки</h1>
          <span className="text-sm text-ink/50">Всего: {data.total}</span>
        </div>

        <div className="mt-4">
          <BookingFilters
            search={query.search}
            status={query.status}
            carId={query.carId}
            cars={cars}
          />
        </div>

        {data.items.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink/60">
            Заявок пока нет.
          </p>
        ) : (
          <>
            {/* Телефон/планшет: карточки (1 колонка, с 768px — 2). */}
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:hidden">
              {data.items.map((b) => (
                <BookingCard key={b.publicId} b={b} />
              ))}
            </div>

            {/* Компьютер: таблица. */}
            <div className="mt-6 hidden lg:block">
              <BookingsTable items={data.items} />
            </div>

            <div className="mt-6">
              <Pagination page={data.page} totalPages={data.totalPages} makeHref={makeHref} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
