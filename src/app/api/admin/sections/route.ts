import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminRequest } from "@/lib/admin-auth";
import type { SiteSectionRow } from "@/lib/cms";

const localeKeys = ["pt", "en", "es", "nl"] as const;
const localisedFields = [
  "body",
  "description",
  "eyebrow",
  "imageAlt",
  "primaryCtaLabel",
  "secondaryCtaLabel",
  "title",
] as const;

type LocalisedValue = Partial<Record<(typeof localeKeys)[number], string>>;

type SectionPayload = {
  body?: LocalisedValue;
  description?: LocalisedValue;
  eyebrow?: LocalisedValue;
  id?: string;
  imageAlt?: LocalisedValue;
  imageUrl?: string;
  isPublished?: boolean;
  pageKey?: string;
  primaryCtaHref?: string;
  primaryCtaLabel?: LocalisedValue;
  sectionKey?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: LocalisedValue;
  sortOrder?: number;
  title?: LocalisedValue;
  updatedAt?: string;
};

function missingTranslations(payload: SectionPayload) {
  const missing: string[] = [];

  for (const field of localisedFields) {
    const value = payload[field];
    const isUsed = localeKeys.some((locale) => value?.[locale]?.trim());
    if (!isUsed) continue;

    for (const locale of localeKeys) {
      if (!value?.[locale]?.trim()) missing.push(`${field}.${locale}`);
    }
  }

  return missing;
}

function sectionAllowsMedia(pageKey: string, sectionKey: string) {
  return (
    (pageKey === "home" && sectionKey === "hero")
    || (pageKey === "home" && sectionKey === "course")
    || (pageKey === "home" && /^prompt-\d+$/.test(sectionKey))
    || (pageKey === "home" && /^partner-\d+$/.test(sectionKey))
    || (pageKey === "about" && sectionKey === "introduction")
  );
}

export async function GET(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const { data, error: queryError } = await supabase
    .from("site_sections")
    .select("*")
    .order("page_key", { ascending: true })
    .order("sort_order", { ascending: true });

  if (queryError) return NextResponse.json({ error: queryError.message }, { status: 500 });
  return NextResponse.json({ items: (data || []) as SiteSectionRow[] });
}

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const payload = (await request.json().catch(() => null)) as SectionPayload | null;
  if (!payload?.pageKey || !payload.sectionKey) {
    return NextResponse.json({ error: "A página e a seção são obrigatórias." }, { status: 400 });
  }

  if (payload.pageKey === "home" && /^partner-(?:[1-9]|[1-9]\d+)$/.test(payload.sectionKey)) {
    const partnerNumber = Number(payload.sectionKey.replace("partner-", ""));
    if (partnerNumber > 9) {
      return NextResponse.json({ error: "O limite de parceiros e 9." }, { status: 400 });
    }
  }

  if (payload.isPublished) {
    const missing = missingTranslations(payload);
    if (missing.length) {
      return NextResponse.json(
        { error: `Complete as traduções antes de publicar: ${missing.join(", ")}.` },
        { status: 400 },
      );
    }
  }

  const allowsMedia = sectionAllowsMedia(payload.pageKey, payload.sectionKey);
  const record = {
    body: payload.body || {},
    description: payload.description || {},
    eyebrow: payload.eyebrow || {},
    image_alt: allowsMedia ? payload.imageAlt || {} : {},
    image_url: allowsMedia ? payload.imageUrl || null : null,
    is_published: Boolean(payload.isPublished),
    page_key: payload.pageKey,
    primary_cta_href: payload.primaryCtaHref || null,
    primary_cta_label: payload.primaryCtaLabel || {},
    secondary_cta_href: payload.secondaryCtaHref || null,
    secondary_cta_label: payload.secondaryCtaLabel || {},
    section_key: payload.sectionKey,
    sort_order: payload.sortOrder || 0,
    title: payload.title || {},
  };

  if (!payload.updatedAt) {
    const { data: existing, error: lookupError } = await supabase
      .from("site_sections")
      .select("id")
      .eq("page_key", payload.pageKey)
      .eq("section_key", payload.sectionKey)
      .maybeSingle();
    if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 500 });
    if (existing) return NextResponse.json({ error: "Atualize o painel antes de guardar. Esta página está desatualizada." }, { status: 409 });
  }

  const mutation = payload.updatedAt
    ? await supabase
      .from("site_sections")
      .update(record)
      .eq("page_key", payload.pageKey)
      .eq("section_key", payload.sectionKey)
      .eq("updated_at", payload.updatedAt)
      .select("*")
      .maybeSingle()
    : await supabase
      .from("site_sections")
      .upsert(record, { onConflict: "page_key,section_key" })
      .select("*")
      .maybeSingle();
  const { data, error: mutationError } = mutation;

  if (mutationError) return NextResponse.json({ error: mutationError.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Este conteúdo foi alterado noutra sessão. Atualize o painel antes de guardar novamente." }, { status: 409 });
  const pagePath = payload.pageKey === "home"
    ? ""
    : payload.pageKey === "about"
      ? "/quem-somos"
      : `/${payload.pageKey === "sessions" ? "sessoes" : payload.pageKey === "courses" ? "cursos" : "blog"}`;
  for (const locale of localeKeys) revalidatePath(`/${locale}${pagePath}`);
  return NextResponse.json({ item: data });
}
