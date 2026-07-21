import "server-only";

// Отправка уведомления о новой заявке в Telegram (Bot API sendMessage).
// Одна попытка, timeout 5 сек, HTML parse_mode с экранированием. Любые ошибки
// ловятся и логируются БЕЗ токена/URL. Booking при ошибке не откатывается.

import { getTelegramConfig } from "./config";
import type { BookingNotification, TelegramSendResult } from "./types";
import { formatCurrency } from "@/lib/currency";

const TIMEOUT_MS = 5000;
const MAX_COMMENT = 500;

// Экранирование для HTML parse_mode Telegram (& < > — обязательны).
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const dtFmt = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" });
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dtFmt.format(d);
}

// Сообщение на русском (Telegram пока только по-русски).
function buildMessage(n: BookingNotification): string {
  const email = n.customerEmail ? esc(n.customerEmail) : "—";
  const commentRaw = n.comment ? n.comment.slice(0, MAX_COMMENT) : "";
  const comment = commentRaw ? esc(commentRaw) : "—";
  const driver = n.withDriver ? "нужен" : "не нужен";

  return [
    `<b>Новая заявка ${esc(n.reference)}</b>`,
    "",
    `Клиент: ${esc(n.customerName)}`,
    `Телефон: ${esc(n.customerPhone)}`,
    `Email: ${email}`,
    `Автомобиль: ${esc(n.carName)}`,
    `Город: ${esc(n.cityName)}`,
    `Даты: ${fmtDate(n.pickupDate)} → ${fmtDate(n.returnDate)}`,
    `Суток: ${n.rentalDays}`,
    `Водитель: ${driver}`,
    `Аренда: ${formatCurrency(n.rentalTotal)}`,
    `Залог: ${formatCurrency(n.depositAmount)}`,
    `Комментарий: ${comment}`,
  ].join("\n");
}

export async function sendBookingNotification(
  n: BookingNotification,
): Promise<TelegramSendResult> {
  const cfg = getTelegramConfig();
  if (cfg.status === "disabled") return "disabled";
  if (cfg.status === "misconfigured") {
    // Безопасный лог: без значений. Booking уже сохранён — не роняем.
    console.error("Telegram misconfigured: задана только одна из переменных TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID.");
    return "misconfigured";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text: buildMessage(n),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // Логируем только HTTP-статус (без токена/URL/тела).
      console.error("Telegram sendMessage HTTP status:", res.status);
      return "failed";
    }
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!data?.ok) {
      console.error("Telegram sendMessage вернул ok=false.");
      return "failed";
    }
    return "sent";
  } catch (e) {
    // Тип ошибки без секретов (например AbortError при таймауте).
    console.error("Telegram sendMessage failed:", (e as Error)?.name ?? "Error");
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
