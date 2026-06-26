"use client";

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

type AdminContentEditorProps = {
  blogPosts: AdminBlogItem[];
  courses: AdminServiceItem[];
  services: AdminServiceItem[];
};

const locales: LocaleKey[] = ["pt", "en", "es", "nl"];
const localeLabels: Record<LocaleKey, string> = {
  en: "Inglês",
  es: "Espanhol",
  nl: "Holandês",
  pt: "Português",
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
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8bd82] px-6 text-sm font-bold text-[#123c2d] transition hover:bg-[#e7ce93]"
          onClick={onCreate}
          type="button"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export function AdminContentEditor({ blogPosts, courses, services }: AdminContentEditorProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8">
      <ServiceEditor emptyText="Nenhuma sessão cadastrada." initialItems={services} title="Sessões" type="session" />
      <ServiceEditor emptyText="Nenhum curso cadastrado." initialItems={courses} title="Cursos" type="course" />
      <BlogEditor emptyText="Nenhum post cadastrado." initialItems={blogPosts} title="Blog" />
    </div>
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
                  <Field label="Foto">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { image_url: event.target.value })}
                      placeholder="Cole o link ou caminho da foto"
                      value={item.image_url || ""}
                    />
                  </Field>
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
                  <Field label="Foto">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.slug, { image_url: event.target.value })}
                      placeholder="Cole o link ou caminho da foto"
                      value={item.image_url || ""}
                    />
                  </Field>
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
