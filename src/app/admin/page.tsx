import Link from "next/link";
import { BookOpenText, CheckCircle2, Database, Eye, LockKeyhole } from "lucide-react";
import { AdminContentEditor } from "@/components/admin-content-editor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminOverview } from "@/lib/cms";

export const dynamic = "force-dynamic";

function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-10">
        <LockKeyhole className="text-[#c6a15b]" size={34} strokeWidth={1.5} />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#547461]">
          Acesso restrito
        </p>
        <h1 className="display mt-3 text-5xl font-semibold leading-tight">
          Painel administrativo
        </h1>
        <p className="mt-5 leading-7 text-[#52675e]">
          Entre com a senha administrativa para editar conteúdo, fotos, preços e limites de vagas.
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
            <Link className="inline-flex text-sm font-bold text-[#d8b96a]" href="/pt">
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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6a15b]">
                Painel administrativo
              </p>
              <h1 className="display mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] sm:text-7xl">
                Gestão de conteúdo
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
                Edite sessões, cursos, blog, imagens, preços e publicação. O conteúdo salvo aparece no site automaticamente.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#c6a15b]/25 bg-white/[0.08] p-5 shadow-2xl shadow-black/20">
              {overview.configured ? (
                <CheckCircle2 className="text-[#c6a15b]" size={28} strokeWidth={1.5} />
              ) : (
                <LockKeyhole className="text-[#c6a15b]" size={28} strokeWidth={1.5} />
              )}
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-[#c6a15b]">
                Conteúdo
              </p>
              <p className="mt-2 leading-7 text-white/72">
                {overview.configured
                  ? "Base de conteúdo conectada."
                  : "Base de conteúdo aguardando configuração."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ["Sessões publicadas", `${publishedServices}/${overview.services.length}`, Database],
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
            <h2 className="display text-4xl font-semibold">Conteúdo ainda não conectado</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#52675e]">
              Quando a base de conteúdo estiver configurada, esta tela passa a listar sessões, cursos e posts cadastrados.
            </p>
          </div>
        </section>
      ) : (
        <section className="px-5 pb-16">
          <AdminContentEditor
            blogPosts={overview.blogPosts}
            courses={overview.courses}
            sections={overview.sections}
            services={overview.services}
          />
        </section>
      )}
    </main>
  );
}
