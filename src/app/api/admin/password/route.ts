import { NextResponse } from "next/server";
import { requireAdminRequest, updateAdminPassword, validateAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { error } = requireAdminRequest(request);
  if (error) return error;

  const payload = await request.json().catch(() => null);
  const currentPassword = String(payload?.currentPassword || "");
  const nextPassword = String(payload?.nextPassword || "");
  const confirmPassword = String(payload?.confirmPassword || "");

  if (!currentPassword || !nextPassword || !confirmPassword) {
    return NextResponse.json({ error: "Preencha a senha atual, a nova senha e a confirmação." }, { status: 400 });
  }

  if (nextPassword.length < 8) {
    return NextResponse.json({ error: "A nova senha precisa ter pelo menos 8 caracteres." }, { status: 400 });
  }

  if (nextPassword !== confirmPassword) {
    return NextResponse.json({ error: "A confirmação precisa ser igual à nova senha." }, { status: 400 });
  }

  if (!(await validateAdminPassword(currentPassword))) {
    return NextResponse.json({ error: "A senha atual não confere." }, { status: 400 });
  }

  const result = await updateAdminPassword(nextPassword);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ ok: true });
}
