import "server-only";

// Серверные сессии админки. В cookie хранится СЛУЧАЙНЫЙ токен, в БД — только его
// SHA-256 хеш. Настоящая проверка доступа выполняется здесь (requireAdmin),
// а не в proxy. passwordHash наружу никогда не отдаём.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 дней

// Данные вошедшего админа (без passwordHash).
export type AdminContext = {
  sessionId: string;
  adminId: string;
  email: string;
  name: string | null;
  role: "ADMIN";
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production", // на localhost http — без secure
    expires,
  };
}

// Создать сессию для админа и установить cookie. Вызывается только из route
// handler (мутация cookie). Возвращает срок действия.
export async function createSession(adminId: string): Promise<Date> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: { tokenHash, adminId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, cookieOptions(expiresAt));
  return expiresAt;
}

// Проверка текущей сессии. Читает cookie, ищет сессию + админа, проверяет срок
// и active. Возвращает контекст или null (доступ запрещён). Только чтение —
// безопасно вызывать в server components.
export async function requireAdmin(): Promise<AdminContext | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      id: true,
      expiresAt: true,
      admin: {
        select: { id: true, email: true, name: true, role: true, active: true },
        // passwordHash намеренно НЕ выбираем.
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) return null;
  if (!session.admin.active) return null;

  return {
    sessionId: session.id,
    adminId: session.admin.id,
    email: session.admin.email,
    name: session.admin.name,
    role: session.admin.role,
  };
}

// Для страниц админки: настоящая проверка сессии, при неудаче — redirect на
// /admin/login (с безопасным next). Booking читать только ПОСЛЕ этого вызова.
export async function requireAdminPage(next?: string): Promise<AdminContext> {
  const admin = await requireAdmin();
  if (!admin) {
    const safeNext = next && next.startsWith("/admin/") ? `?next=${encodeURIComponent(next)}` : "";
    redirect(`/admin/login${safeNext}`);
  }
  return admin;
}

// Завершить текущую сессию: удалить её из БД (только её) и очистить cookie.
// Идемпотентно: повторный вызов не падает.
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    // deleteMany не бросает исключение, если записи уже нет.
    await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE_NAME);
}

// Проверка same-origin для мутационных admin API. Принимаем запрос только если
// Origin совпадает с Host (или Origin отсутствует у некоторых same-origin
// клиентов, но для мутаций требуем совпадение host, если Origin задан).
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!host) return false;
  if (!origin) return false; // для мутаций требуем явный Origin
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
