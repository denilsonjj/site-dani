import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

type ServicePayload = {
  amountCents?: number;
  badge?: Record<string, string>;
  capacityLimit?: number | null;
  category?: "session" | "course";
  currency?: string;
  description?: Record<string, string>;
  duration?: Record<string, string>;
  imageUrl?: string;
  isPublished?: boolean;
  priceLabel?: Record<string, string>;
  productId?: string;
  requiresIntake?: boolean;
  requiresPolicyAcceptance?: boolean;
  slug?: string;
  sortOrder?: number;
  stripePriceEnv?: string;
  summary?: Record<string, string>;
  title?: Record<string, string>;
};

export async function GET(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("content_services")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const payload = (await request.json().catch(() => null)) as ServicePayload | null;
  if (!payload?.slug || !payload.productId || !payload.title?.pt || !payload.summary?.pt) {
    return NextResponse.json(
      { error: "slug, productId, title.pt e summary.pt sao obrigatorios." },
      { status: 400 },
    );
  }

  const { data, error: mutationError } = await supabase
    .from("content_services")
    .upsert(
      {
        amount_cents: payload.amountCents ?? null,
        badge: payload.badge || {},
        capacity_limit: payload.capacityLimit ?? null,
        category: payload.category || "session",
        currency: payload.currency || "EUR",
        description: payload.description || payload.summary || {},
        duration: payload.duration || {},
        image_url: payload.imageUrl || null,
        is_published: Boolean(payload.isPublished),
        price_label: payload.priceLabel || {},
        product_id: payload.productId,
        requires_intake: Boolean(payload.requiresIntake),
        requires_policy_acceptance: payload.requiresPolicyAcceptance ?? true,
        slug: payload.slug,
        sort_order: payload.sortOrder || 0,
        stripe_price_env: payload.stripePriceEnv || null,
        summary: payload.summary,
        title: payload.title,
      },
      { onConflict: "product_id" },
    )
    .select("*")
    .single();

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
