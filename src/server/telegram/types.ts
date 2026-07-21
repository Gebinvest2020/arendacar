import "server-only";

// Результат попытки отправки уведомления. Безопасен для логов (без секретов).
export type TelegramSendResult = "sent" | "disabled" | "misconfigured" | "failed";

// Payload уведомления живёт в src/server/bookings.ts (BookingNotification).
export type { BookingNotification } from "@/server/bookings";
