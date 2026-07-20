import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/admin/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

type SP = { [key: string]: string | string[] | undefined };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  // Если уже есть НАСТОЯЩАЯ действующая сессия — на список.
  const admin = await requireAdmin();
  if (admin) redirect("/admin/bookings");

  const sp = await searchParams;
  const nextRaw = typeof sp.next === "string" ? sp.next : undefined;
  const next = nextRaw && nextRaw.startsWith("/admin/") ? nextRaw : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-ink">Вход в админку</h1>
        <p className="mt-1 text-sm text-ink/60">DriveRent · управление заявками</p>
        <div className="mt-5">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
