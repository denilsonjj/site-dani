import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

type BlogPayload = {
  author?: string;
  body?: Record<string, string>;
  excerpt?: Record<string, string>;
  imageUrl?: string;
  isPublished?: boolean;
  publishedAt?: string;
  readingTime?: Record<string, string>;
  slug?: string;
  sortOrder?: number;
  title?: Record<string, string>;
};

export async function GET(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("blog_posts")
    .select("*")
    .order("sort_order", { ascending: true });

  if (queryError) {
    return NextResponse.json({ error: queryError.message }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const payload = (await request.json().catch(() => null)) as BlogPayload | null;
  if (!payload?.slug || !payload.title?.pt || !payload.excerpt?.pt) {
    return NextResponse.json(
      { error: "slug, title.pt e excerpt.pt sao obrigatorios." },
      { status: 400 },
    );
  }

  const { data, error: mutationError } = await supabase
    .from("blog_posts")
    .upsert(
      {
        author: payload.author || "Dani Therapies",
        body: payload.body || payload.excerpt,
        excerpt: payload.excerpt,
        image_url: payload.imageUrl || null,
        is_published: Boolean(payload.isPublished),
        published_at: payload.publishedAt || new Date().toISOString(),
        reading_time: payload.readingTime || { pt: "4 min" },
        slug: payload.slug,
        sort_order: payload.sortOrder || 0,
        title: payload.title,
      },
      { onConflict: "slug" },
    )
    .select("*")
    .single();

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
