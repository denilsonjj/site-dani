import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedSiteSections } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};
  const partners = (await getPublishedSiteSections("home", rawLocale as Locale)).partners;
  return partners ? { title: `${partners.title} | Dani Therapies`, description: partners.body } : {};
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) return null;

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const sections = await getPublishedSiteSections("home", locale);
  const partners = sections.partners;
  const cards = Object.values(sections)
    .filter((section) => /^partner-\d+$/.test(section.sectionKey))
    .sort((a, b) => Number(a.sectionKey.replace("partner-", "")) - Number(b.sectionKey.replace("partner-", "")))
    .slice(0, 9)
    .filter((section) => [section.title, section.body, section.description, section.imageUrl, section.primaryCtaHref, section.primaryCtaLabel].some((value) => value.trim()));

  if (!partners) return null;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />
      <section className="bg-[#0d3024] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#C9A227]" href={`/${locale}`}>← Dani Therapies</Link>
          <div className="mt-14 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">{partners.eyebrow}</p>
            <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">{partners.title}</h1>
            {partners.body ? <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{partners.body}</p> : null}
          </div>
        </div>
      </section>
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {cards.map((partner) => (
            <article className="overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-white shadow-[0_18px_55px_rgba(19,35,29,0.08)]" data-reveal key={partner.sectionKey}>
              {partner.imageUrl ? <div className="relative h-56"><Image alt={partner.imageAlt || partner.title} className="object-cover" fill sizes="(min-width: 768px) 33vw, 100vw" src={partner.imageUrl} /></div> : null}
              <div className="p-6">
                {partner.description ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#799a81]">{partner.description}</p> : null}
                <h2 className="display mt-3 text-2xl font-semibold leading-tight text-[#123c2d]">{partner.title}</h2>
                {partner.body ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#52675e]">{partner.body}</p> : null}
                {partner.primaryCtaHref && partner.primaryCtaLabel ? <a className="mt-5 inline-flex items-center gap-2 font-bold text-[#123c2d] transition hover:text-[#C9A227]" href={partner.primaryCtaHref} rel="noreferrer" target={partner.primaryCtaHref.startsWith("http") ? "_blank" : undefined}>{partner.primaryCtaLabel}<ArrowRight aria-hidden="true" size={16} /></a> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
