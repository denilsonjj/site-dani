import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getContent, locales, type Locale } from "@/lib/content";
import { aboutPageContent } from "@/lib/detail-content";

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

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#d8bd82] transition hover:text-[#ead7aa]" href={`/${locale}`}>
            <ArrowLeft aria-hidden="true" size={17} />
            {page.back}
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="relative min-h-[34rem] overflow-hidden rounded-[2.5rem] border border-white/12 bg-[#123c2d] shadow-2xl shadow-black/20" data-reveal>
              <Image
                alt={copy.about.imageAlt}
                className="object-cover object-[52%_40%]"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                src="/dani-quem-somos.webp"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,28,21,0.76)_100%)]" />
              <p className="absolute bottom-7 left-7 right-7 text-xl font-semibold leading-8">{page.quote}</p>
            </div>

            <div data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">{page.eyebrow}</p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">{page.title}</h1>
              <div className="mt-8 grid gap-5 text-base leading-8 text-white/70 sm:text-lg">
                {page.intro.map((paragraph, index) => <p key={`about-intro-${index}`}>{paragraph}</p>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="rounded-[2rem] bg-[#e4eee6] p-7 sm:p-10" data-reveal>
            <Sparkles aria-hidden="true" className="text-[#b38f4f]" size={32} strokeWidth={1.5} />
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">{page.servicesEyebrow}</p>
            <h2 className="display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{page.servicesTitle}</h2>
          </div>

          <div className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_22px_70px_rgba(19,35,29,0.08)] sm:p-10" data-reveal>
            <div className="grid gap-6 text-base leading-8 text-[#52675e] sm:text-lg">
              {page.servicesBody.map((paragraph, index) => <p key={`about-services-${index}`}>{paragraph}</p>)}
            </div>
            <Link
              className="mt-9 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={`/${locale}/sessoes`}
            >
              {page.sessionsAction}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
