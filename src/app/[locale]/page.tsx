import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  MessageCircle,
  Video,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { HeroVideo } from "@/components/hero-video";
import { ManualCarousel } from "@/components/manual-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedBlogPosts, getPublishedCourses, getPublishedServices, getPublishedSiteSections } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}`;

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};

  const locale = rawLocale as Locale;
  const sections = await getPublishedSiteSections("home", locale);
  const hero = sections.hero;
  if (!hero) return {};

  return {
    title: `${hero.title} | Dani Therapies`,
    description: hero.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-PT": "/pt",
        "en-US": "/en",
        "es-ES": "/es",
        "nl-NL": "/nl",
        "x-default": "/pt",
      },
    },
    openGraph: {
      title: hero.title,
      description: hero.description,
      images: hero.imageUrl ? [hero.imageUrl] : undefined,
      locale,
      type: "website",
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const [services, blogPosts, courses, sections] = await Promise.all([
    getPublishedServices(locale),
    getPublishedBlogPosts(locale),
    getPublishedCourses(locale),
    getPublishedSiteSections("home", locale),
  ]);
  const servicePreview = services.slice(0, 4);
  const blogPreview = blogPosts.slice(0, 3);
  const hero = sections.hero;
  const firstVisit = sections["first-visit"];
  const promptsHeader = sections.prompts;
  const prompts = Array.from({ length: 6 }, (_, index) => sections[`prompt-${index + 1}`]).filter(Boolean);
  const servicesSection = sections.sessions;
  const courseSection = sections.course;
  const blogSection = sections.blog;
  const contactSection = sections.contact;
  const partnersSection = sections.partners;
  const partnerCards = Object.values(sections)
    .filter((section) => section.pageKey === "home" && /^partner-\d+$/.test(section.sectionKey))
    .sort((a, b) => Number(a.sectionKey.replace("partner-", "")) - Number(b.sectionKey.replace("partner-", "")))
    .filter((section) =>
      [section.title, section.body, section.description, section.imageUrl, section.primaryCtaHref, section.primaryCtaLabel]
        .some((value) => value.trim()),
    );
  if (!hero || !firstVisit || !promptsHeader || !servicesSection || !courseSection || !blogSection || !contactSection) {
    notFound();
  }
  const featuredCourseImage = courseSection.imageUrl || courses[0]?.image || "";
  const featuredCourseLabel = {
    pt: "Curso em destaque",
    en: "Featured course",
    es: "Curso destacado",
    nl: "Uitgelichte cursus",
  }[locale];
  const coursesPreviewTitle = courseSection.title;
  const coursesPreviewBody = courseSection.body;
  const coursesPreviewCount = {
    pt: `${courses.length} cursos disponíveis`,
    en: `${courses.length} available courses`,
    es: `${courses.length} cursos disponibles`,
    nl: `${courses.length} beschikbare cursussen`,
  }[locale];
  const carouselLabels = {
    pt: { next: "Próximo", previous: "Anterior" },
    en: { next: "Next", previous: "Previous" },
    es: { next: "Siguiente", previous: "Anterior" },
    nl: { next: "Volgende", previous: "Vorige" },
  }[locale];
  const heroUsesVideo = /\.(?:mp4|webm)(?:\?|$)/i.test(hero.imageUrl);
  const heroAppleVideo = hero.imageUrl.endsWith(".webm") ? hero.imageUrl.replace(/\.webm$/, ".mp4") : hero.imageUrl;

  return (
    <main>
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="hero relative min-h-[720px] overflow-hidden text-white">
        {heroUsesVideo ? (
          <HeroVideo
            appleSrc={heroAppleVideo}
            defaultSrc={hero.imageUrl}
            poster="/aurora-hero.webp"
          />
        ) : hero.imageUrl ? (
          <Image alt={hero.imageAlt} className="object-cover" fill priority sizes="100vw" src={hero.imageUrl} />
        ) : null}
        <div aria-hidden="true" className="hero-video-scrim absolute inset-0" />

        <div className="hero-content relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 py-20 lg:px-8">
          <div className="hero-copy min-w-0 w-full max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#C9A227]">
              <span className="h-px w-10 bg-[#C9A227]" />
              {hero.eyebrow}
            </p>
            <h1 className="display max-w-3xl text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[4.6rem] lg:leading-[1]">
              {hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
              {hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#C9A227] px-5 text-center font-bold text-[#10251d] transition hover:bg-[#C9A227] sm:w-auto sm:px-7"
                href={hero.primaryCtaHref}
              >
                {hero.primaryCtaLabel}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/35 px-5 text-center font-bold transition hover:bg-white/10 sm:w-auto sm:px-7"
                href={hero.secondaryCtaHref}
              >
                {hero.secondaryCtaLabel}
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <Video aria-hidden="true" size={16} />
              {hero.body}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5" id="consulta">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#f8f5ec] p-8 text-center shadow-[0_25px_80px_rgba(10,43,31,0.16)] sm:p-12 lg:p-16" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">{firstVisit.eyebrow}</p>
            <h2 className="display mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-5xl">
              {firstVisit.title}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#40564d]">
              {firstVisit.body}
            </p>
            <p className="mt-5 text-sm font-bold text-[#547461]">{firstVisit.description.replace("\n", " · ")}</p>
            <a
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <CalendarDays aria-hidden="true" size={18} />
              {firstVisit.primaryCtaLabel}
            </a>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-16" id="sobre">
        <div className="mx-auto max-w-6xl" data-reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-[#123c2d]/10 py-8">
            <p className="text-lg font-bold uppercase tracking-[0.18em] text-[#123c2d] sm:text-xl">
              Dani Therapies
            </p>
            <Link
              className="inline-flex items-center gap-3 text-base font-bold text-[#C9A227] transition hover:gap-4 hover:text-[#C9A227] sm:text-lg"
              href={`/${locale}/quem-somos`}
            >
              <ArrowRight aria-hidden="true" size={22} />
              {copy.nav.about}
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((index) => sections[`about-stat-${index}`]).filter(Boolean).map(({ title, body }) => (
              <div className="rounded-[1.5rem] bg-white p-6 text-center shadow-[0_18px_50px_rgba(19,35,29,0.08)]" key={title}>
                <p className="text-lg font-bold text-[#123c2d]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#52675e]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center" data-reveal>
            <h2 className="display mx-auto max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
              {promptsHeader.title}
            </h2>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
              {promptsHeader.body}
            </p>
          </div>
          <ManualCarousel nextLabel={carouselLabels.next} previousLabel={carouselLabels.previous}>
            {prompts.map((prompt, index) => (
              <article
                className="manual-carousel-item prompt-card group relative min-h-72 shrink-0 snap-start overflow-hidden rounded-[2rem] border border-[#173f30]/10 bg-[#123c2d] shadow-[0_20px_55px_rgba(19,35,29,0.12)] transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(19,35,29,0.2)]"
                data-reveal
                key={prompt.sectionKey}
                style={{ "--reveal-delay": `${index * 90}ms` } as RevealStyle}
              >
                <Image
                  alt=""
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={prompt.imageUrl}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,32,24,0.08)_0%,rgba(8,32,24,0.48)_45%,rgba(8,32,24,0.88)_100%)]" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7">
                  <span className="w-fit rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C9A227] backdrop-blur-md">
                    {prompt.eyebrow}
                  </span>
                  <p className="max-w-[28rem] text-xl font-semibold leading-8 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                    {prompt.title}
                  </p>
                </div>
              </article>
            ))}
          </ManualCarousel>
        </div>
      </section>

      <section className="bg-[#e4eee6] px-5 py-24 sm:py-32" id="sessoes">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
                {servicesSection.eyebrow}
              </p>
              <h2 className="display mt-4 max-w-3xl text-4xl font-semibold text-[#123c2d] sm:text-6xl">
                {servicesSection.title}
              </h2>
              <p className="mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
                {servicesSection.body}
              </p>
            </div>
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={servicesSection.primaryCtaHref}
            >
              {servicesSection.primaryCtaLabel}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <ManualCarousel className="service-auto-carousel" nextLabel={carouselLabels.next} previousLabel={carouselLabels.previous}>
            {servicePreview.map((service, index) => (
              <div className="manual-carousel-item service-slide shrink-0 snap-start" key={service.productId}>
                <ServiceCard actionLabel={copy.services.action} detailsLabel={copy.services.detailsLabel} index={index} locale={locale} service={service} />
              </div>
            ))}
          </ManualCarousel>
        </div>
      </section>

      <section className="bg-[#0d3024] px-5 py-24 text-white sm:py-32" id="cursos">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">
              {courseSection.eyebrow}
            </p>
            <h2 className="display mt-4 max-w-xl text-5xl font-semibold leading-tight sm:text-6xl">
              {coursesPreviewTitle}
            </h2>
            <a
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#C9A227] px-6 font-bold text-[#10251d] transition hover:bg-[#C9A227]"
              href={`/${locale}/cursos`}
            >
              {copy.coursePreview.allLabel}
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          </div>

          <div
            className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] shadow-2xl shadow-black/10"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as RevealStyle}
          >
            <div className="relative h-72 bg-[#123c2d] sm:h-80">
              {featuredCourseImage ? <Image
                alt={courseSection.imageAlt || courses[0]?.title || ""}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={featuredCourseImage}
              /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d3024]/70 via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A227]">
                {featuredCourseLabel}
              </p>
              <h3 className="display mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {coursesPreviewTitle}
              </h3>
              <p className="mt-5 leading-8 text-white/68">
                {coursesPreviewBody}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5">
                  <CreditCard aria-hidden="true" className="text-[#C9A227]" size={24} />
                  <p className="mt-4 text-sm font-bold text-white/58">
                    {coursesPreviewCount}
                  </p>
                </div>
                <div className="flex items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5 text-center">
                  <p className="price-text text-2xl font-bold leading-tight text-[#C9A227] sm:text-3xl">
                    {copy.coursePreview.allLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-36" id="blog">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
              {blogSection.eyebrow}
            </p>
            <h2 className="display mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
              {blogSection.title}
            </h2>
            <blockquote className="mt-7 max-w-3xl text-xl font-medium leading-8 text-[#52675e] sm:text-2xl sm:leading-10">
              {blogSection.description}
            </blockquote>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {blogPreview.map((post, index) => (
              <Link
                className="group overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-white shadow-[0_18px_55px_rgba(19,35,29,0.08)] transition hover:-translate-y-1"
                data-reveal
                href={`/${locale}/blog/${post.slug}`}
                key={post.slug}
                style={{ "--reveal-delay": `${index * 90}ms` } as RevealStyle}
              >
                <div className="relative h-44">
                  <Image
                    alt=""
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={post.image}
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#799a81]">
                    {post.readingTime}
                  </p>
                  <h3 className="display mt-4 text-2xl font-semibold leading-tight text-[#123c2d]">
                    {post.title[locale]}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#52675e]">
                    {post.excerpt[locale]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            className="mt-10 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
            href={blogSection.primaryCtaHref}
          >
            {blogSection.primaryCtaLabel}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      {partnersSection ? (
        <section className="bg-[#f8f5ec] px-5 py-24 sm:py-32" id="parceiros">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
                {partnersSection.eyebrow}
              </p>
              <h2 className="display mt-4 text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
                {partnersSection.title}
              </h2>
              <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
                {partnersSection.body}
              </p>
            </div>

            {partnerCards.length ? <div className="mt-12 grid gap-5 md:grid-cols-3">
              {partnerCards.map((partner, index) => (
                <article
                  className="overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-white shadow-[0_18px_55px_rgba(19,35,29,0.08)]"
                  data-reveal
                  key={partner.sectionKey}
                  style={{ "--reveal-delay": `${index * 90}ms` } as RevealStyle}
                >
                  {partner.imageUrl ? (
                    <div className="relative h-56">
                      <Image
                        alt={partner.imageAlt || partner.title}
                        className="object-cover"
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        src={partner.imageUrl}
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    {partner.description ? (
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#799a81]">
                        {partner.description}
                      </p>
                    ) : null}
                    <h3 className="display mt-3 text-2xl font-semibold leading-tight text-[#123c2d]">
                      {partner.title}
                    </h3>
                    {partner.body ? (
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#52675e]">
                        {partner.body}
                      </p>
                    ) : null}
                    {partner.primaryCtaHref && partner.primaryCtaLabel ? (
                      <a
                        className="mt-5 inline-flex items-center gap-2 font-bold text-[#123c2d] transition hover:text-[#C9A227]"
                        href={partner.primaryCtaHref}
                        rel="noreferrer"
                        target={partner.primaryCtaHref.startsWith("http") ? "_blank" : undefined}
                      >
                        {partner.primaryCtaLabel}
                        <ArrowRight aria-hidden="true" size={16} />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div> : null}
          </div>
        </section>
      ) : null}

      <section className="px-5 pb-24 sm:pb-32" id="contato">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#123c2d] text-white lg:grid-cols-[0.8fr_1.2fr]" data-reveal>
          <div className="noise border-b border-white/15 p-8 sm:p-12 lg:border-b-0 lg:border-r">
            <MessageCircle className="text-[#C9A227]" size={36} strokeWidth={1.5} />
            <p className="mt-16 text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">
              {contactSection.eyebrow}
            </p>
            <h2 className="display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {contactSection.title}
            </h2>
            <p className="mt-6 leading-7 text-white/65">{contactSection.body}</p>
          </div>
          <div className="p-8 sm:p-12">
            <ContactForm labels={copy.contact} />
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
