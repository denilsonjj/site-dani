import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const formData = await request.formData().catch(() => null);
  const productId = String(formData?.get("productId") || "");
  const rawCapacity = String(formData?.get("capacityLimit") || "").trim();
  const capacityLimit = rawCapacity === "" ? null : Number(rawCapacity);

  if (!productId || (capacityLimit !== null && (!Number.isInteger(capacityLimit) || capacityLimit < 0))) {
    return NextResponse.json({ error: "Produto ou limite invalido." }, { status: 400 });
  }

  const { error: mutationError } = await supabase
    .from("content_services")
    .update({ capacity_limit: capacityLimit })
    .eq("product_id", productId);

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
