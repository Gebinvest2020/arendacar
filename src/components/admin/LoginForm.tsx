"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// Форма входа в админку. Пароль не сохраняем в localStorage. Ошибка — единая
// (не раскрывает, существует ли email). Кнопка блокируется на время запроса.
export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Разрешаем только внутренний путь /admin/*.
  const safeNext = next && next.startsWith("/admin/") ? next : "/admin/bookings";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace(safeNext);
        router.refresh();
        return;
      }
      if (res.status === 429) {
        setError("Слишком много попыток. Попробуйте позже.");
      } else {
        setError("Неверный email или пароль.");
      }
    } catch {
      setError("Не удалось выполнить вход. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-xs font-semibold text-ink/60">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          placeholder="admin@example.com"
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-xs font-semibold text-ink/60">
          Пароль
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
          placeholder="••••••••••••"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-lg bg-ink text-sm font-semibold text-white transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {loading ? "Входим…" : "Войти"}
      </button>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
