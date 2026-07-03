import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedSiteSections } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { aboutPageContent } from "@/lib/detail-content";
import { getAboutSectionFallbacks, splitParagraphs } from "@/lib/site-sections";

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

  const locale = rawLocale as Locale;
  const page = aboutPageContent[locale];
  return {
    title: `${page.eyebrow} | Dani Therapies`,
    description: page.intro[0],
    alternates: {
      canonical: `/${locale}/quem-somos`,
      languages: {
        "pt-PT": "/pt/quem-somos",
        "en-US": "/en/quem-somos",
        "es-ES": "/es/quem-somos",
        "nl-NL": "/nl/quem-somos",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const page = aboutPageContent[locale];
  const sections = await getPublishedSiteSections("about", locale, getAboutSectionFallbacks(locale));
  const introduction = sections.introduction;
  const work = sections.work;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#c6a15b] transition hover:text-[#dfc27a]" href={`/${locale}`}>
            <ArrowLeft aria-hidden="true" size={17} />
            {page.back}
          </Link>

          <div className="mx-auto mt-12 max-w-5xl text-center" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6a15b]">Dani Therapies</p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">{introduction.title}</h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl font-semibold leading-8 text-[#dfc27a]">{introduction.description}</p>
              <div className="mt-10 grid gap-5 text-left text-base leading-8 text-white/70 sm:text-lg">
                {splitParagraphs(introduction.body).map((paragraph, index) => <p key={`about-intro-${index}`}>{paragraph}</p>)}
              </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-[2rem] bg-[#e4eee6] p-7 sm:p-10" data-reveal>
            <Sparkles aria-hidden="true" className="text-[#a77b2f]" size={32} strokeWidth={1.5} />
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">{work.eyebrow}</p>
            <h2 className="display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{work.title}</h2>
          </div>

          <div className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_22px_70px_rgba(19,35,29,0.08)] sm:p-10" data-reveal>
            <div className="grid gap-6 text-base leading-8 text-[#52675e] sm:text-lg">
              {splitParagraphs(work.body).map((paragraph, index) => <p key={`about-services-${index}`}>{paragraph}</p>)}
            </div>
            <Link
              className="mt-9 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={work.primaryCtaHref}
            >
              {work.primaryCtaLabel}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
