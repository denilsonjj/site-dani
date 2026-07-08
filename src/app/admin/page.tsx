import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminOverview } from "@/lib/cms";

export const dynamic = "force-dynamic";

function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-10">
        <LockKeyhole className="text-[#C9A227]" size={34} strokeWidth={1.5} />
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
  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 text-[#123c2d] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link className="inline-flex text-sm font-bold text-[#8b711b] transition hover:text-[#123c2d]" href="/pt">
              ← Voltar ao site
            </Link>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#6f8378]">Dani Therapies</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Painel administrativo</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#617268]">
              Controle o que aparece no site de forma simples e organizada.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="inline-flex min-h-11 items-center rounded-xl border border-[#123c2d]/15 bg-white px-5 text-sm font-bold shadow-sm transition hover:bg-[#edf3ee]" type="submit">
              Sair do painel
            </button>
          </form>
        </header>

      {!overview.configured ? (
        <section className="mt-8 rounded-2xl border border-[#123c2d]/10 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold">Conteúdo ainda não conectado</h2>
            <p className="mt-4 max-w-3xl leading-7 text-[#52675e]">
              Quando a base de conteúdo estiver configurada, esta tela passa a listar sessões, cursos e posts cadastrados.
            </p>
        </section>
      ) : (
        <section className="mt-8">
          <AdminDashboard
            blogPosts={overview.blogPosts}
            courses={overview.courses}
            sections={overview.sections}
            services={overview.services}
          />
        </section>
      )}
      </div>
    </main>
  );
}
