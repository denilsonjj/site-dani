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
  return "min-h-11 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 text-sm outline-none focus:border-[#1f5742]";
}

function textareaClass() {
  return "min-h-24 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 py-3 text-sm outline-none focus:border-[#1f5742]";
}

function Field({
  label,
  children,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#40564d]">
      {label}
      {children}
    </label>
  );
}

function LocalisedInputs({
  label,
  onChange,
  textarea = false,
  value,
}: {
  label: string;
  onChange: (value: LocalisedValue) => void;
  textarea?: boolean;
  value: LocalisedValue;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#123c2d]/10 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#547461]">{label}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {locales.map((locale) => (
          <Field key={locale} label={localeLabels[locale]}>
            {textarea ? (
              <textarea
                className={textareaClass()}
                onChange={(event) => onChange(setLocalisedValue(value, locale, event.target.value))}
                value={localisedValue(value, locale)}
              />
            ) : (
              <input
                className={inputClass()}
                onChange={(event) => onChange(setLocalisedValue(value, locale, event.target.value))}
                value={localisedValue(value, locale)}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );
}

export function AdminContentEditor({ blogPosts, courses, services }: AdminContentEditorProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-8">
      <ServiceEditor emptyText="Nenhuma sessão cadastrada." initialItems={services} title="Sessões" />
      <ServiceEditor emptyText="Nenhum curso cadastrado." initialItems={courses} title="Cursos" />
      <BlogEditor emptyText="Nenhum post cadastrado." initialItems={blogPosts} title="Blog" />
    </div>
  );
}

function ServiceEditor({
  emptyText,
  initialItems,
  title,
}: {
  emptyText: string;
  initialItems: AdminServiceItem[];
  title: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Record<string, string>>({});

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display text-4xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#52675e]">
            Edite textos, imagem, preço, publicação, ordem e limite de vagas.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <details className="rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec] p-5" key={item.product_id}>
              <summary className="cursor-pointer text-xl font-bold text-[#123c2d]">
                {localisedValue(item.title, "pt") || item.product_id}
              </summary>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Publicado">
                    <select
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { is_published: event.target.value === "true" })}
                      value={String(item.is_published)}
                    >
                      <option value="true">Publicado</option>
                      <option value="false">Rascunho</option>
                    </select>
                  </Field>
                  <Field label="Categoria">
                    <select
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { category: event.target.value as AdminServiceItem["category"] })}
                      value={item.category}
                    >
                      <option value="session">Sessão</option>
                      <option value="course">Curso</option>
                    </select>
                  </Field>
                  <Field label="Ordem">
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
                      placeholder="Sem limite"
                      type="number"
                      value={item.capacity_limit ?? ""}
                    />
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Slug">
                    <input className={inputClass()} onChange={(event) => updateItem(item.product_id, { slug: event.target.value })} value={item.slug} />
                  </Field>
                  <Field label="Product ID">
                    <input className={inputClass()} readOnly value={item.product_id} />
                  </Field>
                  <Field label="Imagem/Fotografia">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { image_url: event.target.value })}
                      placeholder="/services/foto.webp"
                      value={item.image_url || ""}
                    />
                  </Field>
                  <Field label="Stripe price env">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.product_id, { stripe_price_env: event.target.value })}
                      value={item.stripe_price_env || ""}
                    />
                  </Field>
                  <Field label="Valor em centavos">
                    <input
                      className={inputClass()}
                      onChange={(event) =>
                        updateItem(item.product_id, {
                          amount_cents: event.target.value === "" ? null : Number(event.target.value),
                        })
                      }
                      type="number"
                      value={item.amount_cents ?? ""}
                    />
                  </Field>
                  <Field label="Moeda">
                    <input className={inputClass()} onChange={(event) => updateItem(item.product_id, { currency: event.target.value })} value={item.currency || "EUR"} />
                  </Field>
                </div>

                <LocalisedInputs label="Nome/Título" onChange={(value) => updateItem(item.product_id, { title: value })} value={item.title} />
                <LocalisedInputs label="Chamada curta" onChange={(value) => updateItem(item.product_id, { summary: value })} textarea value={item.summary} />
                <LocalisedInputs label="Descrição completa" onChange={(value) => updateItem(item.product_id, { description: value })} textarea value={item.description} />
                <LocalisedInputs label="Duração" onChange={(value) => updateItem(item.product_id, { duration: value })} value={item.duration} />
                <LocalisedInputs label="Preço exibido" onChange={(value) => updateItem(item.product_id, { price_label: value })} value={item.price_label} />
                <LocalisedInputs label="Selo/Badge" onChange={(value) => updateItem(item.product_id, { badge: value })} value={item.badge} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
      <h2 className="display text-4xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl leading-7 text-[#52675e]">
        Edite posts, textos, imagem, autor, tempo de leitura e publicação.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <details className="rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec] p-5" key={item.slug}>
              <summary className="cursor-pointer text-xl font-bold text-[#123c2d]">
                {localisedValue(item.title, "pt") || item.slug}
              </summary>
              <div className="mt-5 grid gap-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Publicado">
                    <select
                      className={inputClass()}
                      onChange={(event) => updateItem(item.slug, { is_published: event.target.value === "true" })}
                      value={String(item.is_published)}
                    >
                      <option value="true">Publicado</option>
                      <option value="false">Rascunho</option>
                    </select>
                  </Field>
                  <Field label="Ordem">
                    <input
                      className={inputClass()}
                      onChange={(event) => updateItem(item.slug, { sort_order: Number(event.target.value) || 0 })}
                      type="number"
                      value={item.sort_order || 0}
                    />
                  </Field>
                  <Field label="Slug">
                    <input className={inputClass()} readOnly value={item.slug} />
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Imagem">
                    <input className={inputClass()} onChange={(event) => updateItem(item.slug, { image_url: event.target.value })} value={item.image_url || ""} />
                  </Field>
                  <Field label="Autor">
                    <input className={inputClass()} onChange={(event) => updateItem(item.slug, { author: event.target.value })} value={item.author || ""} />
                  </Field>
                  <LocalisedInputs label="Tempo de leitura" onChange={(value) => updateItem(item.slug, { reading_time: value })} value={item.reading_time} />
                </div>

                <LocalisedInputs label="Título" onChange={(value) => updateItem(item.slug, { title: value })} value={item.title} />
                <LocalisedInputs label="Resumo" onChange={(value) => updateItem(item.slug, { excerpt: value })} textarea value={item.excerpt} />
                <LocalisedInputs label="Texto completo" onChange={(value) => updateItem(item.slug, { body: value })} textarea value={item.body} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
