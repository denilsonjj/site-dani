"use client";

import Image from "next/image";
import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import {
  BookOpenText,
  Eye,
  EyeOff,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  Pencil,
  Plus,
  Save,
  UploadCloud,
  Video,
} from "lucide-react";
import type { BlogRow, ServiceRow, SiteSectionRow } from "@/lib/cms";

type AdminDashboardProps = {
  blogPosts: BlogRow[];
  courses: ServiceRow[];
  sections: SiteSectionRow[];
  services: ServiceRow[];
};

type LocaleKey = "pt" | "en" | "es" | "nl";
type TabKey = "overview" | "pages" | "sessions" | "courses" | "blog";
type LocalisedValue = Record<string, string> | null;
type StatusState = Record<string, string>;

const localeLabels: Record<LocaleKey, string> = {
  pt: "Português",
  en: "Inglês",
  es: "Espanhol",
  nl: "Holandês",
};

const pageLabels: Record<string, string> = {
  about: "Quem Somos",
  blog: "Blog",
  courses: "Cursos",
  home: "Página inicial",
  sessions: "Sessões",
};

const sectionLabels: Record<string, string> = {
  about: "Chamada Quem Somos",
  "about-stat-1": "Card pessoal 1",
  "about-stat-2": "Card pessoal 2",
  "about-stat-3": "Card pessoal 3",
  blog: "Prévia do blog",
  contact: "Contato",
  course: "Prévia do curso",
  "first-visit": "Primeira consulta",
  hero: "Abertura com aurora",
  introduction: "Quem Somos",
  "prompt-1": "Carrossel 1",
  "prompt-2": "Carrossel 2",
  "prompt-3": "Carrossel 3",
  "prompt-4": "Carrossel 4",
  "prompt-5": "Carrossel 5",
  "prompt-6": "Carrossel 6",
  prompts: "Título do carrossel",
  sessions: "Prévia das sessões",
  work: "Continuação Quem Somos",
};

const tabs: Array<{ icon: ComponentType<{ size?: number }>; key: TabKey; label: string }> = [
  { icon: LayoutDashboard, key: "overview", label: "Visão geral" },
  { icon: Home, key: "pages", label: "Páginas" },
  { icon: ListChecks, key: "sessions", label: "Sessões" },
  { icon: BookOpenText, key: "courses", label: "Curso" },
  { icon: FileText, key: "blog", label: "Blog" },
];

function localised(value: LocalisedValue, locale: LocaleKey = "pt") {
  return value?.[locale] || value?.pt || value?.en || value?.es || value?.nl || "";
}

function setLocalised(value: LocalisedValue, locale: LocaleKey, next: string) {
  return { ...(value || {}), [locale]: next };
}

function isVideo(src?: string | null) {
  return Boolean(src && /\.(?:mp4|webm|mov)(?:\?|$)/i.test(src));
}

function isImage(src?: string | null) {
  return Boolean(src && !isVideo(src));
}

function inputClass() {
  return "min-h-11 rounded-xl border border-[#123c2d]/15 bg-white px-4 text-sm font-normal outline-none transition focus:border-[#123c2d] focus:ring-2 focus:ring-[#C9A227]/25";
}

function textareaClass(minHeight = "min-h-28") {
  return `${minHeight} rounded-xl border border-[#123c2d]/15 bg-white px-4 py-3 text-sm font-normal leading-6 outline-none transition focus:border-[#123c2d] focus:ring-2 focus:ring-[#C9A227]/25`;
}

function servicePayload(item: ServiceRow, isPublished = item.is_published) {
  return {
    amountCents: item.amount_cents,
    badge: item.badge || {},
    capacityLimit: item.capacity_limit ?? null,
    category: item.category,
    currency: item.currency || "EUR",
    description: item.description || {},
    duration: item.duration || {},
    imageUrl: item.image_url || "",
    isPublished,
    priceLabel: item.price_label || {},
    productId: item.product_id,
    requiresIntake: item.requires_intake,
    requiresPolicyAcceptance: item.requires_policy_acceptance,
    slug: item.slug,
    sortOrder: item.sort_order || 0,
    stripePriceEnv: item.stripe_price_env || "",
    summary: item.summary || {},
    title: item.title || {},
  };
}

function blogPayload(item: BlogRow, isPublished = item.is_published) {
  return {
    author: item.author,
    body: item.body || {},
    excerpt: item.excerpt || {},
    imageUrl: item.image_url || "",
    isPublished,
    publishedAt: item.published_at || new Date().toISOString(),
    readingTime: item.reading_time || {},
    slug: item.slug,
    sortOrder: item.sort_order || 0,
    title: item.title || {},
  };
}

function sectionPayload(item: SiteSectionRow, isPublished = item.is_published) {
  return {
    body: item.body || {},
    description: item.description || {},
    eyebrow: item.eyebrow || {},
    imageAlt: item.image_alt || {},
    imageUrl: item.image_url || "",
    isPublished,
    pageKey: item.page_key,
    primaryCtaHref: item.primary_cta_href || "",
    primaryCtaLabel: item.primary_cta_label || {},
    secondaryCtaHref: item.secondary_cta_href || "",
    secondaryCtaLabel: item.secondary_cta_label || {},
    sectionKey: item.section_key,
    sortOrder: item.sort_order || 0,
    title: item.title || {},
  };
}

async function saveItem(url: string, body: object) {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Não foi possível salvar esta alteração.");
  return result.item;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function makeDraftId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function Panel({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl border border-[#123c2d]/10 bg-white shadow-sm">{children}</section>;
}

function PanelHeader({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#123c2d]/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[#617268]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-[#dff1e5] px-2.5 py-1 text-xs font-bold text-[#176437]"
          : "rounded-full bg-[#f4e5e2] px-2.5 py-1 text-xs font-bold text-[#984539]"
      }
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function VisibilityButton({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = active ? EyeOff : Eye;
  return (
    <button
      aria-label={active ? "Desativar" : "Ativar"}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#123c2d]/12 bg-white text-[#123c2d] transition hover:bg-[#e8f0e9] disabled:cursor-wait disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      title={active ? "Desativar" : "Ativar"}
      type="button"
    >
      <Icon size={18} />
    </button>
  );
}

function Thumb({ icon: Icon, src }: { icon: ComponentType<{ size?: number }>; src?: string | null }) {
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#edf2ed] text-[#547461]">
      {isImage(src) ? <Image alt="" className="object-cover" fill sizes="64px" src={src as string} /> : isVideo(src) ? <Video size={24} /> : <Icon size={24} />}
    </div>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#40564d]">
      {label}
      {children}
    </label>
  );
}

function LocaleSelector({ locale, onChange }: { locale: LocaleKey; onChange: (locale: LocaleKey) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm font-bold">
      Idioma
      <select className={inputClass()} onChange={(event) => onChange(event.target.value as LocaleKey)} value={locale}>
        {Object.entries(localeLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LocalisedInput({
  label,
  locale,
  onChange,
  textarea = false,
  value,
}: {
  label: string;
  locale: LocaleKey;
  onChange: (value: LocalisedValue) => void;
  textarea?: boolean;
  value: LocalisedValue;
}) {
  return (
    <Field label={`${label} (${localeLabels[locale]})`}>
      {textarea ? (
        <textarea
          className={textareaClass()}
          onChange={(event) => onChange(setLocalised(value, locale, event.target.value))}
          value={localised(value, locale)}
        />
      ) : (
        <input
          className={inputClass()}
          onChange={(event) => onChange(setLocalised(value, locale, event.target.value))}
          value={localised(value, locale)}
        />
      )}
    </Field>
  );
}

function MediaField({
  acceptVideo = false,
  label,
  onChange,
  section,
  value,
}: {
  acceptVideo?: boolean;
  label: string;
  onChange: (value: string) => void;
  section: string;
  value?: string | null;
}) {
  const [status, setStatus] = useState("");
  const accept = acceptVideo
    ? "image/avif,image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
    : "image/avif,image/jpeg,image/png,image/webp";

  async function upload(file?: File) {
    if (!file) return;
    setStatus(acceptVideo && file.type.startsWith("video/") ? "Otimizando vídeo..." : "Otimizando imagem...");

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
    setStatus(result.kind === "video" ? "Vídeo convertido e enviado. Salve para aplicar." : "Imagem convertida para WebP. Salve para aplicar.");
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm font-bold text-[#40564d]">{label}</p>
      {isImage(value) ? (
        <div className="relative h-40 overflow-hidden rounded-xl border border-[#123c2d]/10 bg-[#edf2ed]">
          <Image alt="" className="object-cover" fill sizes="420px" src={value as string} />
        </div>
      ) : isVideo(value) ? (
        <video className="h-40 w-full rounded-xl border border-[#123c2d]/10 bg-[#123c2d] object-cover" muted playsInline src={value || ""} />
      ) : null}
      <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#123c2d]/25 bg-white px-4 text-sm font-bold text-[#123c2d] transition hover:bg-[#edf2ed]">
        <UploadCloud size={17} />
        Enviar arquivo
        <input accept={accept} className="sr-only" onChange={(event) => upload(event.target.files?.[0])} type="file" />
      </label>
      <input
        className={inputClass()}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ou cole um link"
        value={value || ""}
      />
      {status ? <p className="text-xs font-bold text-[#547461]">{status}</p> : null}
    </div>
  );
}

function OverviewCard({
  active,
  icon: Icon,
  inactive,
  label,
}: {
  active: number;
  icon: ComponentType<{ size?: number }>;
  inactive: number;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-[#123c2d]/10 bg-white p-5 shadow-sm">
      <Icon size={23} />
      <p className="mt-5 text-sm font-bold text-[#52675e]">{label}</p>
      <div className="mt-3 flex items-end gap-5">
        <div>
          <strong className="text-3xl">{active}</strong>
          <span className="ml-2 text-sm text-[#617268]">ativos</span>
        </div>
        <div>
          <strong className="text-xl text-[#8a5c55]">{inactive}</strong>
          <span className="ml-2 text-sm text-[#617268]">inativos</span>
        </div>
      </div>
    </article>
  );
}

export function AdminDashboard({ blogPosts, courses, sections, services }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [serviceItems, setServiceItems] = useState(services);
  const [courseItems, setCourseItems] = useState(courses);
  const [postItems, setPostItems] = useState(blogPosts);
  const [sectionItems, setSectionItems] = useState(sections);
  const [locale, setLocale] = useState<LocaleKey>("pt");
  const [pending, setPending] = useState("");
  const [status, setStatus] = useState<StatusState>({});

  const activeServices = serviceItems.filter((item) => item.is_published).length;
  const activeCourses = courseItems.filter((item) => item.is_published).length;
  const activePosts = postItems.filter((item) => item.is_published).length;
  const activeSections = sectionItems.filter((item) => item.is_published).length;
  const groupedSections = useMemo(
    () =>
      sectionItems.reduce<Record<string, SiteSectionRow[]>>((pages, item) => {
        pages[item.page_key] ||= [];
        pages[item.page_key].push(item);
        return pages;
      }, {}),
    [sectionItems],
  );

  function showStatus(key: string, message: string) {
    setStatus((current) => ({ ...current, [key]: message }));
  }

  function updateService(productId: string, patch: Partial<ServiceRow>, type: "session" | "course") {
    const setter = type === "session" ? setServiceItems : setCourseItems;
    setter((current) => current.map((item) => (item.product_id === productId ? { ...item, ...patch } : item)));
  }

  function updatePost(slug: string, patch: Partial<BlogRow>) {
    setPostItems((current) => current.map((item) => (item.slug === slug ? { ...item, ...patch } : item)));
  }

  function updateSection(id: string, patch: Partial<SiteSectionRow>) {
    setSectionItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function saveService(item: ServiceRow, type: "session" | "course", nextPublished = item.is_published) {
    const key = `${type}-${item.product_id}`;
    setPending(key);
    showStatus(key, "Salvando...");
    try {
      const saved = await saveItem("/api/admin/services", servicePayload(item, nextPublished));
      updateService(item.product_id, saved, type);
      showStatus(key, nextPublished ? "Salvo e ativo no site." : "Salvo como inativo.");
    } catch (error) {
      showStatus(key, error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setPending("");
    }
  }

  async function savePost(item: BlogRow, nextPublished = item.is_published) {
    const key = `blog-${item.slug}`;
    setPending(key);
    showStatus(key, "Salvando...");
    try {
      const saved = await saveItem("/api/admin/blog", blogPayload(item, nextPublished));
      updatePost(item.slug, saved);
      showStatus(key, nextPublished ? "Salvo e publicado." : "Salvo como rascunho.");
    } catch (error) {
      showStatus(key, error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setPending("");
    }
  }

  async function saveSection(item: SiteSectionRow, nextPublished = item.is_published) {
    const key = `section-${item.id}`;
    setPending(key);
    showStatus(key, "Salvando...");
    try {
      const saved = await saveItem("/api/admin/sections", sectionPayload(item, nextPublished));
      updateSection(item.id, saved);
      showStatus(key, nextPublished ? "Salvo e ativo no site." : "Salvo como inativo.");
    } catch (error) {
      showStatus(key, error instanceof Error ? error.message : "Erro ao salvar.");
    } finally {
      setPending("");
    }
  }

  function createServiceDraft(type: "session" | "course") {
    const id = makeDraftId(type);
    const title = type === "session" ? "Nova sessão" : "Novo curso";
    const draft: ServiceRow = {
      amount_cents: null,
      badge: { pt: "Rascunho" },
      capacity_limit: null,
      category: type,
      currency: "EUR",
      description: { pt: "" },
      duration: { pt: "" },
      id,
      image_url: null,
      is_published: false,
      price_label: { pt: "" },
      product_id: id,
      requires_intake: true,
      requires_policy_acceptance: true,
      seats_paid: 0,
      seats_reserved: 0,
      slug: id,
      sort_order: type === "session" ? serviceItems.length + 1 : courseItems.length + 1,
      stripe_price_env: "",
      summary: { pt: "" },
      title: { pt: title },
    };

    if (type === "session") setServiceItems((current) => [draft, ...current]);
    else setCourseItems((current) => [draft, ...current]);
    showStatus(`${type}-${id}`, "Rascunho criado. Preencha e salve.");
  }

  function createPostDraft() {
    const slug = makeDraftId("post");
    setPostItems((current) => [
      {
        author: "Dani Therapies",
        body: { pt: "" },
        excerpt: { pt: "" },
        image_url: null,
        is_published: false,
        published_at: new Date().toISOString(),
        reading_time: { pt: "4 min" },
        slug,
        sort_order: current.length + 1,
        title: { pt: "Novo post" },
      },
      ...current,
    ]);
    showStatus(`blog-${slug}`, "Rascunho criado. Preencha e salve.");
  }

  return (
    <div className="grid gap-6">
      <nav className="flex w-full gap-2 overflow-x-auto rounded-xl border border-[#123c2d]/10 bg-white/80 p-1 shadow-sm" aria-label="Áreas do painel">
        {tabs.map(({ icon: Icon, key, label }) => (
          <button
            className={
              activeTab === key
                ? "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#123c2d] px-4 text-sm font-bold text-white"
                : "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-bold text-[#52675e] transition hover:bg-[#edf2ed]"
            }
            key={key}
            onClick={() => setActiveTab(key)}
            type="button"
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard active={activeServices} icon={ListChecks} inactive={serviceItems.length - activeServices} label="Sessões" />
            <OverviewCard active={activeCourses} icon={BookOpenText} inactive={courseItems.length - activeCourses} label="Curso" />
            <OverviewCard active={activePosts} icon={FileText} inactive={postItems.length - activePosts} label="Blog" />
            <OverviewCard active={activeSections} icon={Home} inactive={sectionItems.length - activeSections} label="Páginas" />
          </div>
          <Panel>
            <PanelHeader description="Escolha uma área para editar textos, imagens, vídeo da abertura, preços, vagas e publicação." title="Gestão do site" />
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              {tabs.slice(1).map(({ icon: Icon, key, label }) => (
                <button className="flex items-center gap-4 rounded-xl border border-[#123c2d]/10 p-4 text-left transition hover:bg-[#edf2ed]" key={key} onClick={() => setActiveTab(key)} type="button">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#123c2d] text-white"><Icon size={18} /></span>
                  <span><strong className="block">{label}</strong><span className="text-sm text-[#617268]">Abrir gerenciamento</span></span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}

      {activeTab === "pages" ? (
        <Panel>
          <PanelHeader
            action={<LocaleSelector locale={locale} onChange={setLocale} />}
            description="Edite textos e fotos por seção. A abertura aceita vídeo; as outras áreas usam foto."
            title="Páginas e seções"
          />
          <div className="grid gap-5 p-4 sm:p-6">
            {Object.entries(groupedSections).map(([pageKey, items]) => (
              <div className="rounded-2xl bg-[#f7f4ef] p-4" key={pageKey}>
                <h3 className="text-lg font-bold">{pageLabels[pageKey] || pageKey}</h3>
                <div className="mt-4 grid gap-3">
                  {items.map((item) => (
                    <SectionEditor
                      item={item}
                      key={item.id}
                      locale={locale}
                      onSave={(nextPublished) => saveSection(item, nextPublished)}
                      onUpdate={(patch) => updateSection(item.id, patch)}
                      pending={pending === `section-${item.id}`}
                      status={status[`section-${item.id}`]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {activeTab === "sessions" ? (
        <ServiceListEditor
          actionLabel="Nova sessão"
          description="Edite nome, descrição, preço, duração, foto, vagas e publicação das sessões."
          emptyText="Nenhuma sessão cadastrada."
          items={serviceItems}
          locale={locale}
          onCreate={() => createServiceDraft("session")}
          onLocaleChange={setLocale}
          onSave={(item, nextPublished) => saveService(item, "session", nextPublished)}
          onUpdate={(productId, patch) => updateService(productId, patch, "session")}
          pending={pending}
          status={status}
          title="Sessões"
          type="session"
        />
      ) : null}

      {activeTab === "courses" ? (
        <ServiceListEditor
          actionLabel="Novo curso"
          description="Edite o curso disponível no site: texto, imagem, valor, vagas e publicação."
          emptyText="Nenhum curso cadastrado."
          items={courseItems}
          locale={locale}
          onCreate={() => createServiceDraft("course")}
          onLocaleChange={setLocale}
          onSave={(item, nextPublished) => saveService(item, "course", nextPublished)}
          onUpdate={(productId, patch) => updateService(productId, patch, "course")}
          pending={pending}
          status={status}
          title="Curso"
          type="course"
        />
      ) : null}

      {activeTab === "blog" ? (
        <BlogEditor
          items={postItems}
          locale={locale}
          onCreate={createPostDraft}
          onLocaleChange={setLocale}
          onSave={savePost}
          onUpdate={updatePost}
          pending={pending}
          status={status}
        />
      ) : null}
    </div>
  );
}

function SectionEditor({
  item,
  locale,
  onSave,
  onUpdate,
  pending,
  status,
}: {
  item: SiteSectionRow;
  locale: LocaleKey;
  onSave: (nextPublished?: boolean) => void;
  onUpdate: (patch: Partial<SiteSectionRow>) => void;
  pending: boolean;
  status?: string;
}) {
  const canUploadVideo = item.page_key === "home" && item.section_key === "hero";
  const canUploadMedia =
    canUploadVideo
    || (item.page_key === "home" && /^prompt-\d+$/.test(item.section_key))
    || (item.page_key === "about" && item.section_key === "introduction");

  return (
    <article className="rounded-xl border border-[#123c2d]/10 bg-white">
      <div className="flex items-center gap-3 p-4">
        <Thumb icon={canUploadVideo ? Video : Home} src={canUploadMedia ? item.image_url : null} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <strong>{sectionLabels[item.section_key] || item.section_key}</strong>
            <StatusBadge active={item.is_published} />
          </div>
          <p className="mt-1 truncate text-sm text-[#617268]">{localised(item.title, locale) || "Sem título"}</p>
          {status ? <p className="mt-1 text-xs font-bold text-[#6f8378]">{status}</p> : null}
        </div>
        <VisibilityButton active={item.is_published} disabled={pending} onClick={() => onSave(!item.is_published)} />
      </div>
      <details className="border-t border-[#123c2d]/10 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#52675e]"><Pencil size={15} /> Editar conteúdo</summary>
        <div className="mt-4 grid gap-4 pb-2">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ordem na página">
              <input className={inputClass()} onChange={(event) => onUpdate({ sort_order: Number(event.target.value) || 0 })} type="number" value={item.sort_order || 0} />
            </Field>
            {canUploadMedia ? <MediaField
              acceptVideo={canUploadVideo}
              label={canUploadVideo ? "Vídeo da abertura ou imagem" : "Foto da seção"}
              onChange={(value) => onUpdate({ image_url: value })}
              section={`${item.page_key}-${item.section_key}`}
              value={item.image_url}
            /> : null}
          </div>
          <LocalisedInput label="Linha pequena" locale={locale} onChange={(value) => onUpdate({ eyebrow: value })} value={item.eyebrow} />
          <LocalisedInput label="Título" locale={locale} onChange={(value) => onUpdate({ title: value })} value={item.title} />
          <LocalisedInput label="Subtítulo" locale={locale} onChange={(value) => onUpdate({ description: value })} textarea value={item.description} />
          <LocalisedInput label="Texto principal" locale={locale} onChange={(value) => onUpdate({ body: value })} textarea value={item.body} />
          {item.image_url ? <LocalisedInput label="Descrição acessível da imagem" locale={locale} onChange={(value) => onUpdate({ image_alt: value })} value={item.image_alt} /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <LocalisedInput label="Texto do botão principal" locale={locale} onChange={(value) => onUpdate({ primary_cta_label: value })} value={item.primary_cta_label} />
            <Field label="Link do botão principal">
              <input className={inputClass()} onChange={(event) => onUpdate({ primary_cta_href: event.target.value })} value={item.primary_cta_href || ""} />
            </Field>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#123c2d] px-5 text-sm font-bold text-white disabled:opacity-50" disabled={pending} onClick={() => onSave()} type="button">
              <Save size={16} />
              Salvar seção
            </button>
          </div>
        </div>
      </details>
    </article>
  );
}

function ServiceListEditor({
  actionLabel,
  description,
  emptyText,
  items,
  locale,
  onCreate,
  onLocaleChange,
  onSave,
  onUpdate,
  pending,
  status,
  title,
  type,
}: {
  actionLabel: string;
  description: string;
  emptyText: string;
  items: ServiceRow[];
  locale: LocaleKey;
  onCreate: () => void;
  onLocaleChange: (locale: LocaleKey) => void;
  onSave: (item: ServiceRow, nextPublished?: boolean) => void;
  onUpdate: (productId: string, patch: Partial<ServiceRow>) => void;
  pending: string;
  status: StatusState;
  title: string;
  type: "session" | "course";
}) {
  return (
    <Panel>
      <PanelHeader
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LocaleSelector locale={locale} onChange={onLocaleChange} />
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-4 text-sm font-bold text-[#123c2d]" onClick={onCreate} type="button">
              <Plus size={16} />
              {actionLabel}
            </button>
          </div>
        }
        description={description}
        title={`${title} (${items.length})`}
      />
      {items.length === 0 ? <p className="p-6 text-[#617268]">{emptyText}</p> : (
        <div className="grid gap-3 p-4 sm:p-6">
          {items.map((item) => {
            const key = `${type}-${item.product_id}`;
            return (
              <ServiceEditor
                item={item}
                key={item.product_id}
                locale={locale}
                onSave={(nextPublished) => onSave(item, nextPublished)}
                onUpdate={(patch) => onUpdate(item.product_id, patch)}
                pending={pending === key}
                status={status[key]}
                type={type}
              />
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function ServiceEditor({
  item,
  locale,
  onSave,
  onUpdate,
  pending,
  status,
  type,
}: {
  item: ServiceRow;
  locale: LocaleKey;
  onSave: (nextPublished?: boolean) => void;
  onUpdate: (patch: Partial<ServiceRow>) => void;
  pending: boolean;
  status?: string;
  type: "session" | "course";
}) {
  const title = localised(item.title, locale);

  return (
    <article className="rounded-xl border border-[#123c2d]/10 bg-[#fbfaf7]">
      <div className="flex items-center gap-3 p-4">
        <Thumb icon={type === "course" ? BookOpenText : ListChecks} src={item.image_url} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="truncate">{title || "Sem nome"}</strong>
            <StatusBadge active={item.is_published} />
          </div>
          <p className="mt-1 text-sm text-[#617268]">{localised(item.price_label) || localised(item.duration) || "Sem preço"}</p>
          {status ? <p className="mt-1 text-xs font-bold text-[#6f8378]">{status}</p> : null}
        </div>
        <VisibilityButton active={item.is_published} disabled={pending} onClick={() => onSave(!item.is_published)} />
      </div>
      <details className="border-t border-[#123c2d]/10 px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#52675e]"><Pencil size={15} /> Editar conteúdo</summary>
        <div className="mt-4 grid gap-4 pb-2">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Ordem">
              <input className={inputClass()} onChange={(event) => onUpdate({ sort_order: Number(event.target.value) || 0 })} type="number" value={item.sort_order || 0} />
            </Field>
            <Field label="Valor em centavos para controle">
              <input className={inputClass()} onChange={(event) => onUpdate({ amount_cents: event.target.value === "" ? null : Number(event.target.value) })} placeholder="Ex: 11499" type="number" value={item.amount_cents ?? ""} />
            </Field>
            <Field label="Limite de vagas">
              <input className={inputClass()} onChange={(event) => onUpdate({ capacity_limit: event.target.value === "" ? null : Number(event.target.value) })} placeholder="Sem limite" type="number" value={item.capacity_limit ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <MediaField label={type === "course" ? "Imagem do curso" : "Foto da sessão"} onChange={(value) => onUpdate({ image_url: value })} section={`${type}-${item.product_id}`} value={item.image_url} />
            <LocalisedInput label="Preço mostrado no site" locale={locale} onChange={(value) => onUpdate({ price_label: value })} value={item.price_label} />
          </div>
          <LocalisedInput label="Nome" locale={locale} onChange={(value) => {
            const nextSlug = item.slug.startsWith(`${type}-`) ? slugify(localised(value, "pt")) || item.slug : item.slug;
            onUpdate({ slug: nextSlug, title: value });
          }} value={item.title} />
          <LocalisedInput label="Resumo curto" locale={locale} onChange={(value) => onUpdate({ summary: value })} textarea value={item.summary} />
          <LocalisedInput label="Descrição completa" locale={locale} onChange={(value) => onUpdate({ description: value })} textarea value={item.description} />
          <div className="grid gap-4 md:grid-cols-2">
            <LocalisedInput label="Duração" locale={locale} onChange={(value) => onUpdate({ duration: value })} value={item.duration} />
            <LocalisedInput label="Selo pequeno" locale={locale} onChange={(value) => onUpdate({ badge: value })} value={item.badge} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Formulário obrigatório antes do pagamento">
              <select className={inputClass()} onChange={(event) => onUpdate({ requires_intake: event.target.value === "true" })} value={String(item.requires_intake)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </Field>
            <Field label="Aceite de termo obrigatório">
              <select className={inputClass()} onChange={(event) => onUpdate({ requires_policy_acceptance: event.target.value === "true" })} value={String(item.requires_policy_acceptance)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </Field>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#123c2d] px-5 text-sm font-bold text-white disabled:opacity-50" disabled={pending} onClick={() => onSave()} type="button">
              <Save size={16} />
              Salvar alterações
            </button>
          </div>
        </div>
      </details>
    </article>
  );
}

function BlogEditor({
  items,
  locale,
  onCreate,
  onLocaleChange,
  onSave,
  onUpdate,
  pending,
  status,
}: {
  items: BlogRow[];
  locale: LocaleKey;
  onCreate: () => void;
  onLocaleChange: (locale: LocaleKey) => void;
  onSave: (item: BlogRow, nextPublished?: boolean) => void;
  onUpdate: (slug: string, patch: Partial<BlogRow>) => void;
  pending: string;
  status: StatusState;
}) {
  return (
    <Panel>
      <PanelHeader
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LocaleSelector locale={locale} onChange={onLocaleChange} />
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-4 text-sm font-bold text-[#123c2d]" onClick={onCreate} type="button">
              <Plus size={16} />
              Novo post
            </button>
          </div>
        }
        description="Crie ou edite posts usando título, resumo, texto e foto."
        title={`Blog (${items.length})`}
      />
      <div className="grid gap-3 p-4 sm:p-6">
        {items.map((item) => {
          const key = `blog-${item.slug}`;
          return (
            <article className="rounded-xl border border-[#123c2d]/10 bg-[#fbfaf7]" key={item.slug}>
              <div className="flex items-center gap-3 p-4">
                <Thumb icon={FileText} src={item.image_url} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="truncate">{localised(item.title, locale) || "Sem título"}</strong>
                    <StatusBadge active={item.is_published} />
                  </div>
                  <p className="mt-1 text-sm text-[#617268]">{item.published_at ? new Date(item.published_at).toLocaleDateString("pt-PT") : "Sem data"}</p>
                  {status[key] ? <p className="mt-1 text-xs font-bold text-[#6f8378]">{status[key]}</p> : null}
                </div>
                <VisibilityButton active={item.is_published} disabled={pending === key} onClick={() => onSave(item, !item.is_published)} />
              </div>
              <details className="border-t border-[#123c2d]/10 px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#52675e]"><Pencil size={15} /> Editar conteúdo</summary>
                <div className="mt-4 grid gap-4 pb-2">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Ordem">
                      <input className={inputClass()} onChange={(event) => onUpdate(item.slug, { sort_order: Number(event.target.value) || 0 })} type="number" value={item.sort_order || 0} />
                    </Field>
                    <Field label="Autor">
                      <input className={inputClass()} onChange={(event) => onUpdate(item.slug, { author: event.target.value })} value={item.author || ""} />
                    </Field>
                    <LocalisedInput label="Tempo de leitura" locale={locale} onChange={(value) => onUpdate(item.slug, { reading_time: value })} value={item.reading_time} />
                  </div>
                  <MediaField label="Foto do post" onChange={(value) => onUpdate(item.slug, { image_url: value })} section={`blog-${item.slug}`} value={item.image_url} />
                  <LocalisedInput label="Título" locale={locale} onChange={(value) => {
                    const nextSlug = item.slug.startsWith("post-") ? slugify(localised(value, "pt")) || item.slug : item.slug;
                    onUpdate(item.slug, { slug: nextSlug, title: value });
                  }} value={item.title} />
                  <LocalisedInput label="Resumo" locale={locale} onChange={(value) => onUpdate(item.slug, { excerpt: value })} textarea value={item.excerpt} />
                  <LocalisedInput label="Texto completo" locale={locale} onChange={(value) => onUpdate(item.slug, { body: value })} textarea value={item.body} />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#123c2d] px-5 text-sm font-bold text-white disabled:opacity-50" disabled={pending === key} onClick={() => onSave(item)} type="button">
                      <Save size={16} />
                      Salvar post
                    </button>
                  </div>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
