import "server-only";

// Серверный слой заявок для админки. Каждая функция ТРЕБУЕТ уже проверенный
// admin-контекст (первый аргумент) — это гарантирует, что Booking не читается до
// авторизации. Возвращаем только нужные поля (без idempotencyKey и служебных).

import { prisma } from "@/lib/db";
import type { AdminContext } from "./session";
import type {
  AdminBookingDetail,
  AdminBookingListItem,
  AdminBookingsPage,
  BookingStatus,
} from "@/types/booking";
import type { BookingsQuery } from "@/lib/validation/admin";

const listSelect = {
  publicId: true,
  status: true,
  createdAt: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  carName: true,
  carSlug: true,
  pickupDate: true,
  returnDate: true,
  rentalDays: true,
  dailyRate: true,
  rentalTotal: true,
  depositAmount: true,
  source: true,
} as const;

type ListRow = {
  publicId: string;
  status: BookingStatus;
  createdAt: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  carName: string;
  carSlug: string;
  pickupDate: Date;
  returnDate: Date;
  rentalDays: number;
  dailyRate: number;
  rentalTotal: number;
  depositAmount: number;
  source: "WEBSITE" | "PHONE" | "ADMIN";
};

// Страж: admin-контекст обязателен — доказательство, что вызов авторизован.
// Это защита в глубину (реальная авторизация — requireAdmin в API/страницах).
function assertAdmin(admin: AdminContext): void {
  if (!admin || !admin.adminId) throw new Error("Admin context required");
}

function mapItem(r: ListRow): AdminBookingListItem {
  return {
    publicId: r.publicId,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    customerName: r.customerName,
    customerPhone: r.customerPhone,
    customerEmail: r.customerEmail,
    carName: r.carName,
    carSlug: r.carSlug,
    pickupDate: r.pickupDate.toISOString(),
    returnDate: r.returnDate.toISOString(),
    rentalDays: r.rentalDays,
    dailyRate: r.dailyRate,
    rentalTotal: r.rentalTotal,
    depositAmount: r.depositAmount,
    source: r.source,
  };
}

// Список заявок с фильтрами/поиском/пагинацией. Сортировка: сначала новые.
export async function listBookings(
  admin: AdminContext,
  query: BookingsQuery,
): Promise<AdminBookingsPage> {
  assertAdmin(admin);
  const { page, pageSize, status, carId, search } = query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (carId) where.carId = carId;
  if (search && search.length > 0) {
    const contains = { contains: search, mode: "insensitive" as const };
    where.OR = [
      { publicId: contains },
      { customerName: contains },
      { customerPhone: contains },
      { customerEmail: contains },
      { carName: contains },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      select: listSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: (rows as ListRow[]).map(mapItem),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// Одна заявка по publicId (с комментарием) или null.
export async function getBookingByPublicId(
  admin: AdminContext,
  publicId: string,
): Promise<AdminBookingDetail | null> {
  assertAdmin(admin);
  const row = await prisma.booking.findUnique({
    where: { publicId },
    select: { ...listSelect, comment: true, city: { select: { name: true } } },
  });
  if (!row) return null;
  const extra = row as unknown as { comment: string | null; city: { name: string } };
  return {
    ...mapItem(row as ListRow),
    comment: extra.comment,
    cityName: extra.city.name,
  };
}

// Сменить ТОЛЬКО статус. Возвращает {publicId, status} или null, если заявки нет.
export async function updateBookingStatus(
  admin: AdminContext,
  publicId: string,
  status: BookingStatus,
): Promise<{ publicId: string; status: BookingStatus } | null> {
  assertAdmin(admin);
  const existing = await prisma.booking.findUnique({
    where: { publicId },
    select: { id: true },
  });
  if (!existing) return null;

  const updated = await prisma.booking.update({
    where: { id: existing.id },
    data: { status }, // меняем только статус, остальные поля не трогаем
    select: { publicId: true, status: true },
  });
  return { publicId: updated.publicId, status: updated.status };
}

// Список авто для фильтра (id + название).
export async function listCarsForFilter(
  admin: AdminContext,
): Promise<{ id: string; fullName: string }[]> {
  assertAdmin(admin);
  return prisma.car.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });
}
