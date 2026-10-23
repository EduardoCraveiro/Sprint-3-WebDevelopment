import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "jovi-session";
export const SESSION_SECONDS = 60 * 60 * 8;
export const DEMO_EMAIL = "professor@humanly.com";
export const DEMO_PASSWORD = "Humanly@2026";

function sessionSecret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  throw new Error("Configure SESSION_SECRET com pelo menos 32 caracteres no servidor.");
}

export function validCredentials(email: unknown, password: unknown) {
  if (typeof email !== "string" || typeof password !== "string") return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return email.trim().toLowerCase() === DEMO_EMAIL && timingSafeEqual(digest(password), digest(DEMO_PASSWORD));
}

export function createSession() {
  const payload = Buffer.from(JSON.stringify({ email: DEMO_EMAIL, expires: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  const signature = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", sessionSecret()).update(payload).digest();
    const received = Buffer.from(signature, "base64url");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.email !== DEMO_EMAIL || !Number.isFinite(session.expires) || session.expires <= Date.now()) return null;
    return { email: DEMO_EMAIL, name: "Professor" };
  } catch { return null; }
}
