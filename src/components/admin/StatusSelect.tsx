"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, STATUS_VALUES } from "@/lib/admin";
import type { BookingStatus } from "@/types/booking";

// Смена статуса заявки через PATCH. Во время запроса заблокирован (нет повторной
// отправки). После успеха обновляет данные страницы.
export function StatusSelect({
  publicId,
  current,
}: {
  publicId: string;
  current: BookingStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<BookingStatus>(current);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function change(next: BookingStatus) {
    if (loading || next === value) return;
    const prev = value;
    setValue(next);
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/bookings/${publicId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setValue(prev); // откат при ошибке
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <select
        aria-label="Статус заявки"
        value={value}
        disabled={loading}
        onChange={(e) => change(e.target.value as BookingStatus)}
        className="h-11 min-w-[9.5rem] rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
      >
        {STATUS_VALUES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-medium text-red-600">Не удалось сохранить</span>}
    </div>
  );
}
