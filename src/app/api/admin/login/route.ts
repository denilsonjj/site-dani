import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const password = String(formData?.get("password") || "");
  const token = process.env.ADMIN_ACCESS_TOKEN;

  if (!token) {
    return new NextResponse(null, { headers: { Location: "/admin?error=config" }, status: 303 });
  }

  if (password !== token) {
    return new NextResponse(null, { headers: { Location: "/admin?error=login" }, status: 303 });
  }

  const response = new NextResponse(null, { headers: { Location: "/admin" }, status: 303 });
  setAdminSessionCookie(response);
  return response;
}
