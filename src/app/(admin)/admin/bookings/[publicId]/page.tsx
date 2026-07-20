import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/admin/session";
import { getBookingByPublicId } from "@/server/admin/bookings";
import { publicIdSchema } from "@/lib/validation/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingDetail } from "@/components/admin/BookingDetail";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;
  // 1. Сначала проверка сессии.
  const admin = await requireAdminPage(`/admin/bookings/${publicId}`);

  // 2. Валидация идентификатора.
  const parsed = publicIdSchema.safeParse(publicId);
  if (!parsed.success) notFound();

  // 3. Затем чтение заявки.
  const booking = await getBookingByPublicId(admin, parsed.data);
  if (!booking) notFound();

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <BookingDetail b={booking} />
      </div>
    </>
  );
}
