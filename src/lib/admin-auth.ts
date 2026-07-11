import { NextResponse } from "next/server";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "./supabase/server";

export const adminSessionCookie = "dani_admin_session";
const adminSessionMaxAgeSeconds = 60 * 60 * 8;
const adminPasswordSettingKey = "admin_password_hash";

function getAdminSecret() {
  return process.env.ADMIN_ACCESS_TOKEN || "";
}

function signAdminSession(timestamp: string, secret: string) {
  return createHmac("sha256", secret).update(timestamp).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [kind, salt, hash] = storedHash.split(":");
  if (kind !== "scrypt" || !salt || !hash) return false;

  const attempt = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(attempt, hash);
}

function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return "";

  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}

export function createAdminSessionValue() {
  const secret = getAdminSecret();
  const timestamp = String(Date.now());
  return `${timestamp}.${signAdminSession(timestamp, secret)}`;
}

export function validateAdminSession(value?: string | null) {
  const secret = getAdminSecret();
  if (!secret || !value) return false;

  const [timestamp, signature] = value.split(".");
  const issuedAt = Number(timestamp);
  if (!timestamp || !signature || !Number.isFinite(issuedAt)) return false;

  const isExpired = Date.now() - issuedAt > adminSessionMaxAgeSeconds * 1000;
  if (isExpired) return false;

  return safeEqual(signature, signAdminSession(timestamp, secret));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return validateAdminSession(cookieStore.get(adminSessionCookie)?.value);
}

export async function validateAdminPassword(password: string) {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", adminPasswordSettingKey)
      .maybeSingle();

    if (typeof data?.value === "string" && data.value) {
      return verifyPassword(password, data.value);
    }
  }

  const token = getAdminSecret();
  return Boolean(token && password === token);
}

export async function updateAdminPassword(password: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { error: "Supabase service role não configurado." };

  const { error } = await supabase
    .from("admin_settings")
    .upsert(
      {
        key: adminPasswordSettingKey,
        updated_at: new Date().toISOString(),
        value: hashPassword(password),
      },
      { onConflict: "key" },
    );

  return { error: error?.message || null };
}

export function setAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookie, createAdminSessionValue(), {
    httpOnly: true,
    maxAge: adminSessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(adminSessionCookie, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function requireAdminRequest(request: Request) {
  const token = process.env.ADMIN_ACCESS_TOKEN;

  if (token) {
    const header = request.headers.get("authorization");
    const hasBearerAccess = header === `Bearer ${token}`;
    const hasCookieAccess = validateAdminSession(readCookie(request.headers.get("cookie"), adminSessionCookie));

    if (!hasBearerAccess && !hasCookieAccess) {
      return {
        error: NextResponse.json({ error: "Nao autorizado." }, { status: 401 }),
        supabase: null,
      };
    }
  } else if (process.env.NODE_ENV === "production") {
    return {
      error: NextResponse.json(
        { error: "ADMIN_ACCESS_TOKEN precisa estar configurado em producao." },
        { status: 500 },
      ),
      supabase: null,
    };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      error: NextResponse.json({ error: "Supabase service role nao configurado." }, { status: 503 }),
      supabase: null,
    };
  }

  return { error: null, supabase };
}
