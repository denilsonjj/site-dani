import Image from "next/image";
import Link from "next/link";
import { BookOpenText, CheckCircle2, Database, Eye, LockKeyhole, PlusCircle } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminOverview, getLocalisedAdminValue } from "@/lib/cms";

export const dynamic = "force-dynamic";

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
        published
          ? "bg-[#dcebe0] text-[#174c38]"
          : "bg-[#f3e8c9] text-[#7a5b12]"
      }`}
    >
      {published ? "Publicado" : "Rascunho"}
    </span>
  );
}

function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-10">
        <LockKeyhole className="text-[#d8bd82]" size={34} strokeWidth={1.5} />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#547461]">
          Acesso restrito
        </p>
        <h1 className="display mt-3 text-5xl font-semibold leading-tight">
          Painel administrativo
        </h1>
        <p className="mt-5 leading-7 text-[#52675e]">
          Entre com a senha administrativa para editar conteÃºdo e limites de vagas.
        </p>
        <form action="/api/admin/login" className="mt-7 grid gap-4" method="post">
          <label className="grid gap-2 text-sm font-bold text-[#40564d]">
            Senha do painel
            <input
              autoComplete="current-password"
              className="min-h-13 rounded-2xl border border-[#123c2d]/15 bg-[#f8f5ec] px-4 font-normal outline-none focus:border-[#1f5742]"
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-5 text-sm font-bold text-white transition hover:bg-[#1f5742]"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const overview = await getAdminOverview();
  const publishedServices = overview.services.filter((service) => service.is_published).length;
  const publishedCourses = overview.courses.filter((course) => course.is_published).length;
  const publishedPosts = overview.blogPosts.filter((post) => post.is_published).length;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <section className="bg-[#0b2a20] px-5 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link className="inline-flex text-sm font-bold text-[#e5cc96]" href="/pt">
              ← Voltar ao site
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                className="inline-flex min-h-10 items-center rounded-full border border-white/15 px-4 text-sm font-bold text-white/78 transition hover:bg-white/10"
                type="submit"
              >
                Sair do painel
              </button>
            </form>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
                Painel administrativo
              </p>
              <h1 className="display mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] sm:text-7xl">
                GestÃ£o de conteÃºdo
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
                SessÃµes, cursos e blog podem ser organizados em uma base editÃ¡vel.
                Tudo que estiver marcado como publicado aparece no site automaticamente.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#d8bd82]/25 bg-white/[0.08] p-5 shadow-2xl shadow-black/20">
              {overview.configured ? (
                <CheckCircle2 className="text-[#d8bd82]" size={28} strokeWidth={1.5} />
              ) : (
                <LockKeyhole className="text-[#d8bd82]" size={28} strokeWidth={1.5} />
              )}
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#d8bd82]">
                ConteÃºdo
              </p>
              <p className="mt-2 leading-7 text-white/72">
                {overview.configured
                  ? "Base de conteÃºdo conectada."
                  : "Base de conteÃºdo aguardando configuraÃ§Ã£o."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ["Sessoes publicadas", `${publishedServices}/${overview.services.length}`, Database],
            ["Cursos publicados", `${publishedCourses}/${overview.courses.length}`, BookOpenText],
            ["Posts publicados", `${publishedPosts}/${overview.blogPosts.length}`, Eye],
          ].map(([label, value, Icon]) => (
            <article className="rounded-[1.5rem] bg-white p-6 shadow-[0_18px_50px_rgba(19,35,29,0.08)]" key={label as string}>
              <Icon className="text-[#1f5742]" size={28} strokeWidth={1.6} />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#547461]">
                {label as string}
              </p>
              <p className="mt-2 text-3xl font-bold">{value as string}</p>
            </article>
          ))}
        </div>
      </section>

      {!overview.configured ? (
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_20px_60px_rgba(19,35,29,0.08)]">
            <h2 className="display text-4xl font-semibold">ConteÃºdo ainda nÃ£o conectado</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#52675e]">
              Quando a base de conteÃºdo estiver configurada, esta tela passa a listar
              sessÃµes, cursos e posts cadastrados.
            </p>
          </div>
        </section>
      ) : (
        <section className="px-5 pb-16">
          <div className="mx-auto grid max-w-7xl gap-8">
            <ContentTable
              emptyText="Nenhuma sessao cadastrada."
              items={overview.services}
              title="Sessoes"
            />
            <ContentTable
              emptyText="Nenhum curso cadastrado."
              items={overview.courses}
              title="Cursos"
            />
            <BlogTable emptyText="Nenhum post cadastrado." items={overview.blogPosts} title="Blog" />
          </div>
        </section>
      )}
    </main>
  );
}

function ContentTable({
  emptyText,
  items,
  title,
}: {
  emptyText: string;
  items: Awaited<ReturnType<typeof getAdminOverview>>["services"];
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="display text-4xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#52675e]">
            Publicado aparece no site. Rascunho fica guardado no banco ate ser aprovado.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e4eee6] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1f5742]">
          <PlusCircle size={14} />
          Criacao por API pronta
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article className="overflow-hidden rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec]" key={item.id}>
              {item.image_url ? (
                <div className="relative h-44 bg-[#123c2d]">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    src={item.image_url}
                  />
                </div>
              ) : null}
              <div className="p-5">
                <StatusBadge published={item.is_published} />
                <h3 className="mt-4 text-2xl font-bold leading-tight">
                  {getLocalisedAdminValue(item.title)}
                </h3>
                <p className="mt-3 leading-7 text-[#52675e]">
                  {getLocalisedAdminValue(item.summary)}
                </p>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#123c2d]/10 pt-4">
                  <p className="text-sm font-bold text-[#547461]">
                    {getLocalisedAdminValue(item.duration)}
                  </p>
                  <p className="price-text text-2xl font-bold">
                    {getLocalisedAdminValue(item.price_label)}
                  </p>
                </div>
                <p className="mt-4 font-mono text-[11px] text-[#6b7d74]">{item.product_id}</p>
                <div className="mt-5 rounded-2xl border border-[#123c2d]/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#547461]">
                    Limite de vagas
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#52675e]">
                    {item.capacity_limit === null || item.capacity_limit === undefined
                      ? "Sem limite definido"
                      : `${Math.max(item.capacity_limit - (item.seats_reserved || 0), 0)} restantes de ${
                          item.capacity_limit
                        }`}
                    {item.seats_reserved ? ` · ${item.seats_reserved} reservadas/pagas` : ""}
                  </p>
                  <form action="/api/admin/services/capacity" className="mt-4 flex gap-2" method="post">
                    <input name="productId" type="hidden" value={item.product_id} />
                    <input
                      className="min-h-11 min-w-0 flex-1 rounded-full border border-[#123c2d]/15 bg-[#f8f5ec] px-4 text-sm outline-none focus:border-[#1f5742]"
                      defaultValue={item.capacity_limit ?? ""}
                      min={0}
                      name="capacityLimit"
                      placeholder="Ex: 20"
                      type="number"
                    />
                    <button
                      className="inline-flex min-h-11 items-center rounded-full bg-[#123c2d] px-4 text-sm font-bold text-white transition hover:bg-[#1f5742]"
                      type="submit"
                    >
                      Salvar
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function BlogTable({
  emptyText,
  items,
  title,
}: {
  emptyText: string;
  items: Awaited<ReturnType<typeof getAdminOverview>>["blogPosts"];
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-5 shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-7">
      <h2 className="display text-4xl font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-[#f8f5ec] p-5 text-[#52675e]">{emptyText}</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article className="rounded-[1.5rem] border border-[#123c2d]/10 bg-[#f8f5ec] p-5" key={item.slug}>
              <StatusBadge published={item.is_published} />
              <h3 className="mt-4 text-2xl font-bold leading-tight">
                {getLocalisedAdminValue(item.title)}
              </h3>
              <p className="mt-3 leading-7 text-[#52675e]">
                {getLocalisedAdminValue(item.excerpt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

