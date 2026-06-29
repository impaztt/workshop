import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "ws_admin";

function secret(): string {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "workshop2026";
}

// 비밀번호를 직접 저장하지 않고, 시크릿으로 서명한 토큰을 쿠키에 보관
function sessionToken(): string {
  return createHmac("sha256", secret()).update("admin-ok").digest("hex");
}

export function verifyPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(adminPassword());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12시간
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = sessionToken();
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export const ADMIN_COOKIE = COOKIE_NAME;
