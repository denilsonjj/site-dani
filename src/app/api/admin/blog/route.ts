import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminRequest } from "@/lib/admin-auth";
import { findMissingTranslations } from "@/lib/admin-content-validation";

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
  updatedAt?: string;
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

  if (payload.isPublished) {
    const missing = findMissingTranslations({
      body: payload.body,
      excerpt: payload.excerpt,
      readingTime: payload.readingTime,
      title: payload.title,
    });
    if (missing.length) {
      return NextResponse.json(
        { error: `Complete as traduções antes de publicar: ${missing.join(", ")}.` },
        { status: 400 },
      );
    }
  }

  const record = {
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
  };

  if (!payload.updatedAt) {
    const { data: existing, error: lookupError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", payload.slug)
      .maybeSingle();
    if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 500 });
    if (existing) return NextResponse.json({ error: "Atualize o painel antes de guardar. Esta página está desatualizada." }, { status: 409 });
  }

  const mutation = payload.updatedAt
    ? await supabase
      .from("blog_posts")
      .update(record)
      .eq("slug", payload.slug)
      .eq("updated_at", payload.updatedAt)
      .select("*")
      .maybeSingle()
    : await supabase
      .from("blog_posts")
      .upsert(record, { onConflict: "slug" })
      .select("*")
      .maybeSingle();
  const { data, error: mutationError } = mutation;

  if (mutationError) {
    return NextResponse.json({ error: mutationError.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Este conteúdo foi alterado noutra sessão. Atualize o painel antes de guardar novamente." },
      { status: 409 },
    );
  }

  for (const locale of ["pt", "en", "es", "nl"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/${payload.slug}`);
  }

  return NextResponse.json({ item: data });
}
