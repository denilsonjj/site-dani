import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedSiteSections } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { aboutPageContent } from "@/lib/detail-content";
import { getAboutSectionFallbacks, splitParagraphs } from "@/lib/site-sections";

const legacyIntroductionDescriptions: Partial<Record<Locale, string[]>> = {
  pt: [
    "Não prometo milagres! Mas ofereço qualidade de vida.",
    "Não prometo milagres. Mas ofereço qualidade de vida.",
  ],
};

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
  const storedIntroduction = sections.introduction;
  const introduction = legacyIntroductionDescriptions[locale]?.includes(storedIntroduction.description.trim())
    ? { ...storedIntroduction, description: page.quote }
    : storedIntroduction;
  const work = sections.work;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#C9A227] transition hover:text-[#C9A227]" href={`/${locale}`}>
            <ArrowLeft aria-hidden="true" size={17} />
            {page.back}
          </Link>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]" data-reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">Dani Therapies</p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">{introduction.title}</h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-[#C9A227]">{introduction.description}</p>
              <div className="mt-10 grid gap-5 text-base leading-8 text-white/70 sm:text-lg">
                {splitParagraphs(introduction.body).map((paragraph, index) => <p key={`about-intro-${index}`}>{paragraph}</p>)}
              </div>
            </div>
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-[#f8f5ec] shadow-[0_26px_80px_rgba(0,0,0,0.22)]">
              <Image
                alt={introduction.imageAlt}
                className="h-auto w-full object-cover"
                height={1200}
                priority
                src={introduction.imageUrl || "/dani-quem-somos.webp"}
                width={900}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_22px_70px_rgba(19,35,29,0.08)] sm:p-10 lg:p-12" data-reveal>
            <div className="mb-9 flex flex-wrap items-center gap-5 border-b border-[#123c2d]/10 pb-8">
              <h2 className="display text-4xl font-semibold leading-tight sm:text-5xl">{page.eyebrow}</h2>
              <div className="flex h-20 w-32 items-center justify-center rounded-2xl bg-[#123c2d] p-3 sm:h-24 sm:w-40">
                <Image
                  alt="Dani Therapies"
                  className="h-auto w-full"
                  height={560}
                  src="/dani-therapies-logo-cropped.webp"
                  width={980}
                />
              </div>
            </div>
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
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
