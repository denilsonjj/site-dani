import type { Metadata } from "next";
import Link from "next/link";
import { AutoCarousel } from "@/components/auto-carousel";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedServices, getPublishedSiteSections } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { getListingSectionFallbacks } from "@/lib/site-sections";

const pageCopy = {
  pt: { catalog: "Catálogo", count: (value: number) => `${value} sessões carregadas`, question: "Tirar dúvida" },
  en: { catalog: "Catalogue", count: (value: number) => `${value} sessions available`, question: "Ask a question" },
  es: { catalog: "Catálogo", count: (value: number) => `${value} sesiones disponibles`, question: "Hacer una consulta" },
  nl: { catalog: "Overzicht", count: (value: number) => `${value} sessies beschikbaar`, question: "Stel een vraag" },
} as const;

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
  const [services, sections] = await Promise.all([
    getPublishedServices(locale),
    getPublishedSiteSections("sessions", locale, getListingSectionFallbacks("sessions", locale)),
  ]);
  const hero = sections.hero;
  const labels = pageCopy[locale];

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#c6a15b]" href={`/${locale}`}>
            ← Dani Therapies
          </Link>
          <div className="mt-14 max-w-4xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6a15b]">
                {hero.eyebrow}
              </p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
                {hero.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-[#123c2d]/10 bg-white p-6 shadow-[0_18px_55px_rgba(19,35,29,0.08)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#547461]">
                {labels.catalog}
              </p>
              <p className="mt-2 text-2xl font-bold">{labels.count(services.length)}</p>
            </div>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-5 font-bold text-white transition hover:bg-[#1f5742]"
              href={`/${locale}#contato`}
            >
              {labels.question}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <AutoCarousel
            className="service-auto-carousel"
            duplicateChildren={services.map((service, index) => (
              <div className="service-slide shrink-0 snap-start" key={service.productId}>
                <ServiceCard actionLabel={copy.services.action} anchor={false} detailsLabel={copy.services.detailsLabel} index={index} locale={locale} service={service} />
              </div>
            ))}
            duration={services.length * 11}
          >
            {services.map((service, index) => (
              <div className="service-slide shrink-0 snap-start" key={service.productId}>
                <ServiceCard actionLabel={copy.services.action} detailsLabel={copy.services.detailsLabel} index={index} locale={locale} service={service} />
              </div>
            ))}
          </AutoCarousel>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
