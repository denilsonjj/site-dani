"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type LocaleKey = "pt" | "en" | "es" | "nl";
type LocalisedValue = Partial<Record<LocaleKey, string>> | null;

type AdminServiceItem = {
  amount_cents: number | null;
  badge: LocalisedValue;
  capacity_limit?: number | null;
  category: "session" | "course";
  currency: string;
  description: LocalisedValue;
  duration: LocalisedValue;
  id: string;
  image_url: string | null;
  is_published: boolean;
  price_label: LocalisedValue;
  product_id: string;
  requires_intake: boolean;
  requires_policy_acceptance: boolean;
  seats_reserved?: number;
  slug: string;
  sort_order: number;
  stripe_price_env: string | null;
  summary: LocalisedValue;
  title: LocalisedValue;
};

type AdminBlogItem = {
  author: string;
  body: LocalisedValue;
  excerpt: LocalisedValue;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  reading_time: LocalisedValue;
  slug: string;
  sort_order: number;
  title: LocalisedValue;
};

type AdminSectionItem = {
  body: LocalisedValue;
  description: LocalisedValue;
  eyebrow: LocalisedValue;
  id: string;
  image_alt: LocalisedValue;
  image_url: string | null;
  is_published: boolean;
  page_key: string;
  primary_cta_href: string | null;
  primary_cta_label: LocalisedValue;
  section_key: string;
  secondary_cta_href: string | null;
  secondary_cta_label: LocalisedValue;
  sort_order: number;
  title: LocalisedValue;
};

type AdminContentEditorProps = {
  blogPosts: AdminBlogItem[];
  courses: AdminServiceItem[];
  sections: AdminSectionItem[];
  services: AdminServiceItem[];
};

const locales: LocaleKey[] = ["pt", "en", "es", "nl"];
const localeLabels: Record<LocaleKey, string> = {
  en: "Inglês",
  es: "Espanhol",
  nl: "Holandês",
  pt: "Português",
};

const pageLabels: Record<string, string> = {
  about: "Quem Somos",
  blog: "Blog",
  courses: "Cursos",
  home: "Página inicial",
  sessions: "Sessões",
};

const sectionLabels: Record<string, string> = {
  about: "Apresentação da Dani",
  "about-stat-1": "Destaque 1",
  "about-stat-2": "Destaque 2",
  "about-stat-3": "Destaque 3",
  blog: "Prévia do blog",
  contact: "Contato",
  course: "Prévia do curso",
  "first-visit": "Primeira consulta",
  hero: "Abertura com aurora",
  introduction: "Quem Somos - introdução",
  "prompt-1": "Pergunta 1",
  "prompt-2": "Pergunta 2",
  "prompt-3": "Pergunta 3",
  prompts: "Título das perguntas",
  sessions: "Prévia das sessões",
  work: "Quem Somos - continuação",
};

function localisedValue(value: LocalisedValue, locale: LocaleKey) {
  return value?.[locale] || "";
}

function setLocalisedValue(value: LocalisedValue, locale: LocaleKey, nextValue: string) {
  return {
    ...(value || {}),
    [locale]: nextValue,
  };
}

function inputClass() {
  return "min-h-11 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 text-sm outline-none transition focus:border-[#1f5742] focus:bg-white";
}

function textareaClass() {
  return "min-h-28 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 py-3 text-sm outline-none transition focus:border-[#1f5742] focus:bg-white";
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#40564d]">
      {label}
      {children}
    </label>
  );
}

function LanguageSelector({
  locale,
  onChange,
}: {
  locale: LocaleKey;
  onChange: (locale: LocaleKey) => void;
}) {
  return (
    <Field label="Idioma que deseja editar">
      <select className={inputClass()} onChange={(event) => onChange(event.target.value as LocaleKey)} value={locale}>
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </Field>
  );
}

function LocalisedField({
  locale,
  label,
  onChange,
  placeholder,
  textarea = false,
  value,
}: {
  locale: LocaleKey;
  label: string;
  onChange: (value: LocalisedValue) => void;
  placeholder?: string;
  textarea?: boolean;
  value: LocalisedValue;
}) {
  return (
    <Field label={`${label} (${localeLabels[locale]})`}>
      {textarea ? (
        <textarea
          className={textareaClass()}
          onChange={(event) => onChange(setLocalisedValue(value, locale, event.target.value))}
          placeholder={placeholder}
          value={localisedValue(value, locale)}
        />
      ) : (
        <input
          className={inputClass()}
          onChange={(event) => onChange(setLocalisedValue(value, locale, event.target.value))}
          placeholder={placeholder}
          value={localisedValue(value, locale)}
        />
      )}
    </Field>
  );
}

function ImageUploadField({
  label = "Foto ou vídeo",
  onChange,
  section,
  value,
}: {
  label?: string;
  onChange: (value: string) => void;
  section: string;
  value: string | null;
}) {
  const [status, setStatus] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setStatus("Enviando arquivo...");
    const formData = new FormData();
    formData.set("file", file);
    formData.set("section", section);

    const response = await fetch("/api/admin/media", { body: formData, method: "POST" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(result.error || "Não foi possível enviar o arquivo.");
      return;
    }

    onChange(result.url);
    setStatus("Arquivo enviado. Salve para aplicar.");
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm font-bold text-[#40564d]">{label}</p>
      {value && !/\.(?:mp4|webm)(?:\?|$)/i.test(value) ? (
        <div className="overflow-hidden rounded-2xl border border-[#123c2d]/10 bg-white p-2">
          <Image alt="Prévia do arquivo" className="h-36 w-full rounded-xl object-cover" height={288} src={value} width={720} />
        </div>
      ) : null}
      <input
        accept="image/avif,image/jpeg,image/png,image/webp,video/mp4,video/webm"
        className={inputClass()}
        onChange={(event) => upload(event.target.files?.[0])}
        type="file"
      />
      <input
        className={inputClass()}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ou cole o link do arquivo"
        value={value || ""}
      />
      {status ? <p className="text-xs font-bold text-[#547461]">{status}</p> : null}
    </div>
  );
}

function makeDraftId(prefix: "session" | "course" | "post") {
  return `${prefix}-${Date.now()}`;
}

function SectionHeader({
  actionLabel,
  activeLocale,
  description,
  onCreate,
  onLocaleChange,
  title,
}: {
  actionLabel: string;
  activeLocale: LocaleKey;
  description: string;
  onCreate: () => void;
  onLocaleChange: (locale: LocaleKey) => void;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="display text-4xl font-semibold">{title}</h2>
        <p className="mt-2 max-w-2xl leading-7 text-[#52675e]">{description}</p>
      </div>
      <div className="grid gap-3 sm:min-w-64">
        <LanguageSelector locale={activeLocale} onChange={onLocaleChange} />
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#C9A227] px-6 text-sm font-bold text-[#123c2d] transition hover:bg-[#C9A227]"
          onClick={onCreate}
          type="button"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export function AdminContentEditor({ blogPosts, courses, sections, services }: AdminContentEditorProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8">
      <SiteSectionsEditor initialItems={sections} />
      <ServiceEditor emptyText="Nenhuma sessão cadastrada." initialItems={services} title="Sessões" type="session" />
      <ServiceEditor emptyText="Nenhum curso cadastrado." initialItems={courses} title="Cursos" type="course" />
      <BlogEditor emptyText="Nenhum post cadastrado." initialItems={blogPosts} title="Blog" />
    </div>
  );
}

function SiteSectionsEditor({ initialItems }: { initialItems: AdminSectionItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("pt");

  function updateItem(id: string, patch: Partial<AdminSectionItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function save(item: AdminSectionItem) {
    setStatus((current) => ({ ...current, [item.id]: "Salvando..." }));
    const response = await fetch("/api/admin/sections", {
      body: JSON.stringify({
        body: item.body || {},
        description: item.description || {},
        eyebrow: item.eyebrow || {},
        imageAlt: item.image_alt || {},
        imageUrl: item.image_url || "",
        isPublished: item.is_published,
        pageKey: item.page_key,
        primaryCtaHref: item.primary_cta_href || "",
        primaryCtaLabel: item.primary_cta_label || {},
        secondaryCtaHref: item.secondary_cta_href || "",
        secondaryCtaLabel: item.secondary_cta_label || {},
        sectionKey: item.section_key,
        sortOrder: item.sort_order || 0,
        title: item.title || {},
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus((current) => ({ ...current, [item.id]: result.error || "Erro ao salvar." }));
      return;
    }

    if (result.item) updateItem(item.id, result.item);
    setStatus((current) => ({ ...current, [item.id]: "Salvo e sincronizado com o site." }));
  }

  const grouped = items.reduce<Record<string, AdminSectionItem[]>>((pages, item) => {
    pages[item.page_key] ||= [];
    pages[item.page_key].push(item);
    return pages;
  }, {});

  return (
    <section className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#799a81]">Site completo</p>
          <h2 className="display mt-3 text-4xl font-semibold">Páginas e seções</h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#52675e]">
            Escolha uma seção, selecione o idioma e altere somente o conteúdo que deseja. Fotos são enviadas diretamente daqui.
          </p>
        </div>
        <div className="sm:min-w-64">
          <LanguageSelector locale={activeLocale} onChange={setActiveLocale} />
        </div>
      </div>

      <div className="mt-7 grid gap-6">
        {Object.entries(grouped).map(([pageKey, pageItems]) => (
          <div className="rounded-[1.75rem] bg-[#e4eee6]/60 p-4 sm:p-5" key={pageKey}>
            <h3 className="text-xl font-bold text-[#123c2d]">{pageLabels[pageKey] || pageKey}</h3>
            <div className="mt-4 grid gap-3">
              {pageItems?.map((item) => (
                <details className="rounded-[1.5rem] border border-[#123c2d]/10 bg-white p-5" key={item.id}>
                  <summary className="cursor-pointer font-bold text-[#123c2d]">
                    {sectionLabels[item.section_key] || item.section_key}
                  </summary>
                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Situação no site">
                        <select
                          className={inputClass()}
                          onChange={(event) => updateItem(item.id, { is_published: event.target.value === "true" })}
                          value={String(item.is_published)}
                        >
                          <option value="false">Rascunho</option>
                          <option value="true">Publicado</option>
                        </select>
                      </Field>
                      <ImageUploadField
                        onChange={(value) => updateItem(item.id, { image_url: value })}
                        section={`${item.page_key}-${item.section_key}`}
                        value={item.image_url}
                      />
                    </div>
                    <LocalisedField locale={activeLocale} label="Linha pequena" onChange={(value) => updateItem(item.id, { eyebrow: value })} value={item.eyebrow} />
                    <LocalisedField locale={activeLocale} label="Título" onChange={(value) => updateItem(item.id, { title: value })} value={item.title} />
                    <LocalisedField locale={activeLocale} label="Descrição" onChange={(value) => updateItem(item.id, { description: value })} textarea value={item.description} />
                    <LocalisedField locale={activeLocale} label="Texto principal" onChange={(value) => updateItem(item.id, { body: value })} textarea value={item.body} />
                    {item.image_url ? (
                      <LocalisedField locale={activeLocale} label="Descrição acessível da imagem" onChange={(value) => updateItem(item.id, { image_alt: value })} value={item.image_alt} />
                    ) : null}
                    <div className="grid gap-4 md:grid-cols-2">
                      <LocalisedField locale={activeLocale} label="Texto do botão principal" onChange={(value) => updateItem(item.id, { primary_cta_label: value })} value={item.primary_cta_label} />
                      <Field label="Destino do botão principal">
                        <input className={inputClass()} onChange={(event) => updateItem(item.id, { primary_cta_href: event.target.value })} value={item.primary_cta_href || ""} />
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-[#123c2d]/10 pt-4 sm:flex-row sm:items-center">
                      <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-6 text-sm font-bold text-white transition hover:bg-[#1f5742]" onClick={() => save(item)} type="button">
                        Salvar seção
                      </button>
                      {status[item.id] ? <p className="text-sm font-bold text-[#547461]">{status[item.id]}</p> : null}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceEditor({
  emptyText,
  initialItems,
  title,
  type,
}: {
  emptyText: string;
  initialItems: AdminServiceItem[];
  title: string;
  type: "session" | "course";
}) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("pt");

  function createDraft() {
    const productId = makeDraftId(type);
    const titleLabel = type === "session" ? "Nova sessão" : "Novo curso";

    setItems((current) => [
      {
        amount_cents: null,
        badge: { pt: "Rascunho" },
        capacity_limit: null,
        category: type,
        currency: "EUR",
        description: { pt: "" },
        duration: { pt: "" },
        id: productId,
        image_url: "",
        is_published: false,
        price_label: { pt: "" },
        product_id: productId,
        requires_intake: true,
        requires_policy_acceptance: true,
        seats_reserved: 0,
        slug: productId,
        sort_order: current.length + 1,
        stripe_price_env: "",
        summary: { pt: "" },
        title: { pt: titleLabel },
      },
      ...current,
    ]);
    setStatus((current) => ({ ...current, [productId]: "Rascunho criado. Preencha e salve." }));
  }

  function updateItem(productId: string, patch: Partial<AdminServiceItem>) {
    setItems((current) => current.map((item) => (item.product_id === productId ? { ...item, ...patch } : item)));
  }

  async function save(item: AdminServiceItem) {
    setStatus((current) => ({ ...current, [item.product_id]: "Salvando..." }));

    const response = await fetch("/api/admin/services", {
      body: JSON.stringify({
        amountCents: item.amount_cents,
        badge: item.badge || {},
        capacityLimit: item.capacity_limit ?? null,
        category: item.category,
        currency: item.currency || "EUR",
        description: item.description || {},
        duration: item.duration || {},
        imageUrl: item.image_url || "",
        isPublished: item.is_published,
        priceLabel: item.price_label || {},
        productId: item.product_id,
        requiresIntake: item.requires_intake,
        requiresPolicyAcceptance: item.requires_policy_acceptance,
        slug: item.slug,
        sortOrder: item.sort_order || 0,
        stripePriceEnv: item.stripe_price_env || "",
        summary: item.summary || {},
        title: item.title || {},
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus((current) => ({ ...current, [item.product_id]: result.error || "Erro ao salvar." }));
      return;
    }

    if (result.item) {
      updateItem(item.product_id, result.item);
    }
    setStatus((current) => ({ ...current, [item.product_id]: "Salvo." }));
  }

  return (
    <section className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-7">
      <SectionHeader
        actionLabel={type === "session" ? "Nova sessão" : "Novo curso"}
        activeLocale={activeLocale}
        description="Edite somente o que aparece para o visitante: textos, foto, preço, vagas e publicação."
        onCreate={createDraft}
        onLocaleChange={setActiveLocale}
        title={title}
      />

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <details className="rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec] p-5" key={item.product_id}>
              <summary className="cursor-pointer text-xl font-bold text-[#123c2d]">
                {localisedValue(item.title, activeLocale) || localisedValue(item.title, "pt") || "Novo item"}
              </summary>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Situação no site">
                    <select
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { is_published: event.target.value === "true" })}
                      value={String(item.is_published)}
                    >
                      <option value="false">Rascunho - não aparece no site</option>
                      <option value="true">Publicado - aparece no site</option>
                    </select>
                  </Field>
                  <Field label="Posição na página">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { sort_order: Number(event.target.value) || 0 })}
                      type="number"
                      value={item.sort_order || 0}
                    />
                  </Field>
                  <Field label="Limite de vagas">
                    <input
                      className={inputClass()}
                      onChange={(event) =>
                        updateItem(item.product_id, {
                          capacity_limit: event.target.value === "" ? null : Number(event.target.value),
                        })
                      }
                      placeholder="Deixe vazio se não houver limite"
                      type="number"
                      value={item.capacity_limit ?? ""}
                    />
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <ImageUploadField
                    label="Foto do card"
                    onChange={(value) => updateItem(item.product_id, { image_url: value })}
                    section={`${item.category}-${item.product_id}`}
                    value={item.image_url}
                  />
                  <LocalisedField
                    locale={activeLocale}
                    label="Preço mostrado no site"
                    onChange={(value) => updateItem(item.product_id, { price_label: value })}
                    placeholder="Ex: 114,99 €"
                    value={item.price_label}
                  />
                </div>

                <LocalisedField
                  locale={activeLocale}
                  label="Nome"
                  onChange={(value) => updateItem(item.product_id, { title: value })}
                  value={item.title}
                />
                <LocalisedField
                  locale={activeLocale}
                  label="Resumo curto"
                  onChange={(value) => updateItem(item.product_id, { summary: value })}
                  placeholder="Texto curto que aparece no card"
                  textarea
                  value={item.summary}
                />
                <LocalisedField
                  locale={activeLocale}
                  label="Descrição completa"
                  onChange={(value) => updateItem(item.product_id, { description: value })}
                  placeholder="Texto completo da página ou detalhes do atendimento"
                  textarea
                  value={item.description}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <LocalisedField
                    locale={activeLocale}
                    label="Duração"
                    onChange={(value) => updateItem(item.product_id, { duration: value })}
                    placeholder="Ex: 1 hora online"
                    value={item.duration}
                  />
                  <LocalisedField
                    locale={activeLocale}
                    label="Selo pequeno"
                    onChange={(value) => updateItem(item.product_id, { badge: value })}
                    placeholder="Ex: Novos clientes"
                    value={item.badge}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-[#123c2d]/10 pt-4 sm:flex-row sm:items-center">
                  <button
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-6 text-sm font-bold text-white transition hover:bg-[#1f5742]"
                    onClick={() => save(item)}
                    type="button"
                  >
                    Salvar alterações
                  </button>
                  {status[item.product_id] ? <p className="text-sm font-bold text-[#547461]">{status[item.product_id]}</p> : null}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

function BlogEditor({
  emptyText,
  initialItems,
  title,
}: {
  emptyText: string;
  initialItems: AdminBlogItem[];
  title: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("pt");

  function createDraft() {
    const slug = makeDraftId("post");

    setItems((current) => [
      {
        author: "Dani Therapies",
        body: { pt: "" },
        excerpt: { pt: "" },
        image_url: "",
        is_published: false,
        published_at: new Date().toISOString(),
        reading_time: { pt: "4 min" },
        slug,
        sort_order: current.length + 1,
        title: { pt: "Novo post" },
      },
      ...current,
    ]);
    setStatus((current) => ({ ...current, [slug]: "Rascunho criado. Preencha e salve." }));
  }

  function updateItem(slug: string, patch: Partial<AdminBlogItem>) {
    setItems((current) => current.map((item) => (item.slug === slug ? { ...item, ...patch } : item)));
  }

  async function save(item: AdminBlogItem) {
    setStatus((current) => ({ ...current, [item.slug]: "Salvando..." }));

    const response = await fetch("/api/admin/blog", {
      body: JSON.stringify({
        author: item.author,
        body: item.body || {},
        excerpt: item.excerpt || {},
        imageUrl: item.image_url || "",
        isPublished: item.is_published,
        publishedAt: item.published_at || new Date().toISOString(),
        readingTime: item.reading_time || {},
        slug: item.slug,
        sortOrder: item.sort_order || 0,
        title: item.title || {},
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus((current) => ({ ...current, [item.slug]: result.error || "Erro ao salvar." }));
      return;
    }

    if (result.item) {
      updateItem(item.slug, result.item);
    }
    setStatus((current) => ({ ...current, [item.slug]: "Salvo." }));
  }

  return (
    <section className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-7">
      <SectionHeader
        actionLabel="Novo post"
        activeLocale={activeLocale}
        description="Crie e edite posts usando só título, resumo, texto, foto e publicação."
        onCreate={createDraft}
        onLocaleChange={setActiveLocale}
        title={title}
      />

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <details className="rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec] p-5" key={item.slug}>
              <summary className="cursor-pointer text-xl font-bold text-[#123c2d]">
                {localisedValue(item.title, activeLocale) || localisedValue(item.title, "pt") || "Novo post"}
              </summary>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Situação no site">
                    <select
                      className={inputClass()}
                      onChange={(event) => updateItem(item.slug, { is_published: event.target.value === "true" })}
                      value={String(item.is_published)}
                    >
                      <option value="false">Rascunho - não aparece no site</option>
                      <option value="true">Publicado - aparece no site</option>
                    </select>
                  </Field>
                  <Field label="Posição na página">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.slug, { sort_order: Number(event.target.value) || 0 })}
                      type="number"
                      value={item.sort_order || 0}
                    />
                  </Field>
                  <ImageUploadField
                    label="Foto do post"
                    onChange={(value) => updateItem(item.slug, { image_url: value })}
                    section={`blog-${item.slug}`}
                    value={item.image_url}
                  />
                </div>

                <LocalisedField
                  locale={activeLocale}
                  label="Título"
                  onChange={(value) => updateItem(item.slug, { title: value })}
                  value={item.title}
                />
                <LocalisedField
                  locale={activeLocale}
                  label="Resumo"
                  onChange={(value) => updateItem(item.slug, { excerpt: value })}
                  placeholder="Texto curto que aparece no card do blog"
                  textarea
                  value={item.excerpt}
                />
                <LocalisedField
                  locale={activeLocale}
                  label="Texto completo"
                  onChange={(value) => updateItem(item.slug, { body: value })}
                  placeholder="Conteúdo completo do post"
                  textarea
                  value={item.body}
                />

                <div className="flex flex-col gap-3 border-t border-[#123c2d]/10 pt-4 sm:flex-row sm:items-center">
                  <button
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-6 text-sm font-bold text-white transition hover:bg-[#1f5742]"
                    onClick={() => save(item)}
                    type="button"
                  >
                    Salvar post
                  </button>
                  {status[item.slug] ? <p className="text-sm font-bold text-[#547461]">{status[item.slug]}</p> : null}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
