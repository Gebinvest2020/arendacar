"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Шапка админки: название, ссылка «Заявки», кнопка «Выйти» (POST logout).
// Помещается на телефоне без горизонтальной прокрутки.
export function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // даже при ошибке отправим на логин
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="truncate text-base font-bold text-ink">Управление заявками</span>
          <Link
            href="/admin/bookings"
            className="hidden rounded-lg px-2 py-1 text-sm font-medium text-ink/70 transition-colors hover:text-ink sm:inline"
          >
            Заявки
          </Link>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={loading}
          className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60"
        >
          {loading ? "Выходим…" : "Выйти"}
        </button>
      </div>
    </header>
  );
}
