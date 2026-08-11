import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

type OrderItem = {
  productId?: string;
  updatedAt?: string;
};

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const payload = (await request.json().catch(() => null)) as { items?: OrderItem[] } | null;
  const items = payload?.items || [];
  const productIds = items.map((item) => item.productId || "");

  if (!items.length || productIds.some((id) => !id) || new Set(productIds).size !== productIds.length) {
    return NextResponse.json({ error: "A ordem das sessões é inválida." }, { status: 400 });
  }

  const { data: currentItems, error: queryError } = await supabase
    .from("content_services")
    .select("product_id, category, updated_at")
    .eq("category", "session");

  if (queryError) return NextResponse.json({ error: queryError.message }, { status: 500 });
  if (currentItems.length !== items.length) {
    return NextResponse.json({ error: "Atualize o painel antes de alterar a ordem das sessões." }, { status: 409 });
  }

  const currentById = new Map(currentItems.map((item) => [item.product_id, item]));
  const isCurrent = items.every((item) => {
    const current = currentById.get(item.productId || "");
    return current?.category === "session" && current.updated_at === item.updatedAt;
  });

  if (!isCurrent) {
    return NextResponse.json(
      { error: "As sessões foram alteradas noutra janela. Atualize o painel antes de mudar a ordem." },
      { status: 409 },
    );
  }

  for (const [index, item] of items.entries()) {
    const { error: updateError } = await supabase
      .from("content_services")
      .update({ sort_order: index + 1 })
      .eq("product_id", item.productId);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { data: reordered, error: reloadError } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "session")
    .order("sort_order", { ascending: true });

  if (reloadError) return NextResponse.json({ error: reloadError.message }, { status: 500 });

  for (const locale of ["pt", "en", "es", "nl"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/sessoes`);
  }

  return NextResponse.json({ items: reordered || [] });
}
