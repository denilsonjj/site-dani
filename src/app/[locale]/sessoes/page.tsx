import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedServices } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};

  return {
    title: "Sessões | Dani Therapies",
    description: "Lista completa de sessões energéticas e espirituais da Dani Therapies, com duração, valores e checkout preparado.",
  };
}

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const services = await getPublishedServices(locale);

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#d8bd82]" href={`/${locale}`}>
            ← Dani Therapies
          </Link>
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
                {copy.services.eyebrow}
              </p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
                Sessões disponíveis
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/68">
              Esta página concentra as sessões completas, os valores e os caminhos de pagamento.
              A lista principal fica disponível no próprio site para manter a navegação clara.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-[#123c2d]/10 bg-white p-6 shadow-[0_18px_55px_rgba(19,35,29,0.08)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#547461]">
                Catálogo
              </p>
              <p className="mt-2 text-2xl font-bold">{services.length} sessões carregadas</p>
            </div>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-5 font-bold text-white transition hover:bg-[#1f5742]"
              href={`/${locale}#contato`}
            >
              Tirar dúvida
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard
                actionLabel={copy.services.action}
                index={index}
                key={service.productId}
                locale={locale}
                service={service}
              />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
