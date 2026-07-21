import "server-only";

// Конфигурация Telegram из server-side env. Токен и chat id НИКОГДА не выводим.
// Не используем NEXT_PUBLIC_ — эти значения не должны попадать на клиент.

export type TelegramConfig =
  | { status: "disabled" } // обе переменные отсутствуют
  | { status: "misconfigured" } // задана только одна
  | { status: "ready"; token: string; chatId: string };

export function getTelegramConfig(): TelegramConfig {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token && !chatId) return { status: "disabled" };
  if (!token || !chatId) return { status: "misconfigured" };
  return { status: "ready", token, chatId };
}
