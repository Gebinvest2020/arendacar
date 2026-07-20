import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { loginSchema } from "@/lib/validation/admin";
import { verifyCredentials, markLogin } from "@/server/admin/auth";
import { createSession, isSameOrigin } from "@/server/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 2 * 1024; // тело логина крошечное
const GENERIC = "Неверный email или пароль.";

// --- Простой in-memory rate limit (только MVP-барьер) ---
// ВНИМАНИЕ: на serverless память не общая между инстансами и сбрасывается, поэтому
// это НЕ полноценная защита, а лишь замедление примитивного перебора.
// Ключ = IP + SHA-256(email); открытый email не храним.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; reset: number }>();

function limiterKey(ip: string, email: string | undefined): string {
  const emailHash = email ? createHash("sha256").update(email).digest("hex").slice(0, 16) : "noemail";
  return `${ip}:${emailHash}`;
}
function hit(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || rec.reset < now) {
    attempts.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX_ATTEMPTS;
}
function clear(key: string) {
  attempts.delete(key);
}

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    // Same-origin: чужой Origin отклоняем (защита от CSRF для мутации).
    if (!isSameOrigin(req)) {
      return json({ ok: false, error: "FORBIDDEN", message: "Запрос отклонён." }, 403);
    }
    // Только application/json.
    if (!(req.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
      return json({ ok: false, error: "UNSUPPORTED_MEDIA_TYPE", message: "Ожидается application/json." }, 415);
    }
    // Размер тела.
    const declared = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      return json({ ok: false, error: "PAYLOAD_TOO_LARGE", message: "Слишком большой запрос." }, 413);
    }
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "PAYLOAD_TOO_LARGE", message: "Слишком большой запрос." }, 413);
    }

    // Тело НЕ логируем.
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ ok: false, error: "VALIDATION_ERROR", message: GENERIC }, 400);
    }

    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    const maybeEmail =
      typeof (parsed as { email?: unknown })?.email === "string"
        ? ((parsed as { email: string }).email).trim().toLowerCase()
        : undefined;
    const key = limiterKey(ip, maybeEmail);

    if (!hit(key)) {
      return json({ ok: false, error: "TOO_MANY_ATTEMPTS", message: "Слишком много попыток. Попробуйте позже." }, 429);
    }

    // Строгая валидация (лишние поля отклоняются). Ошибку не детализируем.
    const result = loginSchema.safeParse(parsed);
    if (!result.success) {
      return json({ ok: false, error: "VALIDATION_ERROR", message: GENERIC }, 400);
    }

    const adminId = await verifyCredentials(result.data.email, result.data.password);
    if (!adminId) {
      // Единый ответ: не раскрываем, существует ли email и активен ли он.
      return json({ ok: false, error: "INVALID_CREDENTIALS", message: GENERIC }, 401);
    }

    await createSession(adminId);
    await markLogin(adminId);
    clear(key); // успешный вход сбрасывает счётчик

    return json({ ok: true }, 200);
  } catch (e) {
    // Наружу — общий текст, без пароля/тела/стека.
    console.error("POST /api/admin/login failed:", (e as Error)?.message);
    return json({ ok: false, error: "INTERNAL_ERROR", message: "Не удалось выполнить вход. Попробуйте позже." }, 500);
  }
}
