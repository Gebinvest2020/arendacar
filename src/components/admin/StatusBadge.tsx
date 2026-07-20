import { STATUS_LABELS, STATUS_STYLES } from "@/lib/admin";
import type { BookingStatus } from "@/types/booking";

// Бейдж статуса заявки (русская подпись + цвет). Чистый серверный компонент.
export function StatusBadge({ status, big = false }: { status: BookingStatus; big?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${STATUS_STYLES[status]} ${
        big ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"
      }`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
