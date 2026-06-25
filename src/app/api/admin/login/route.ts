import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const password = String(formData?.get("password") || "");
  const token = process.env.ADMIN_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.redirect(new URL("/admin?error=config", request.url));
  }

  if (password !== token) {
    return NextResponse.redirect(new URL("/admin?error=login", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  setAdminSessionCookie(response);
  return response;
}
