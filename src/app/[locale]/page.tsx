import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  CreditCard,
  MessageCircle,
  MoonStar,
  Video,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedBlogPosts, getPublishedCourses, getPublishedServices } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";

const whatsappUrl = "https://wa.me/31616018467";

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

const promptVisuals = [
  { image: "/gallery/prompt-crystal.webp" },
  { image: "/gallery/prompt-waterfall.webp" },
  { image: "/gallery/prompt-pet.avif" },
];

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
  const copy = getContent(locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
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
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: ["/aurora-hero.webp"],
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
  const [services, blogPosts, courses] = await Promise.all([
    getPublishedServices(locale),
    getPublishedBlogPosts(locale),
    getPublishedCourses(locale),
  ]);
  const servicePreview = services.slice(0, 4);
  const blogPreview = blogPosts.slice(0, 3);
  const primaryCourse = courses[0];

  return (
    <main>
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="hero relative min-h-[720px] overflow-hidden text-white">
        <video
          aria-hidden="true"
          autoPlay
          className="hero-video absolute inset-0 h-full w-full"
          loop
          muted
          playsInline
          poster="/aurora-hero.webp"
          preload="auto"
        >
          <source src="/aurora-real.webm" type="video/webm" />
        </video>
        <div aria-hidden="true" className="hero-video-scrim absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 py-20 lg:px-8">
          <div className="hero-copy min-w-0 w-full max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#e5cc96]">
              <span className="h-px w-10 bg-[#e5cc96]" />
              {copy.hero.eyebrow}
            </p>
            <h1 className="display max-w-3xl text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5.3rem] lg:leading-[0.98]">
              {copy.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/78 sm:text-lg">
              {copy.hero.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#d8bd82] px-5 text-center font-bold text-[#10251d] transition hover:bg-[#ead7aa] sm:w-auto sm:px-7"
                href={`/${locale}/sessoes#primeira-consulta-online`}
              >
                {copy.hero.primary}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/35 px-5 text-center font-bold transition hover:bg-white/10 sm:w-auto sm:px-7"
                href={`/${locale}/sessoes`}
              >
                {copy.hero.secondary}
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <Video aria-hidden="true" size={16} />
              {copy.hero.note}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5" id="consulta">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#f8f5ec] shadow-[0_25px_80px_rgba(10,43,31,0.16)] lg:grid-cols-[0.82fr_1.18fr]" data-reveal>
          <div className="noise flex min-h-80 flex-col justify-between bg-[#123c2d] p-8 text-white sm:p-12">
            <div>
              <MoonStar className="text-[#d8bd82]" size={34} strokeWidth={1.5} />
              <p className="mt-14 text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
                {copy.firstVisit.eyebrow}
              </p>
            </div>
            <div className="mt-12 grid gap-4 text-sm">
              <p className="flex items-center gap-3">
                <Clock3 aria-hidden="true" className="text-[#d8bd82]" size={18} />
                {copy.firstVisit.duration}
              </p>
              <p className="flex items-center gap-3">
                <Video aria-hidden="true" className="text-[#d8bd82]" size={18} />
                {copy.firstVisit.format}
              </p>
            </div>
          </div>
          <div className="p-8 sm:p-12 lg:p-16">
            <h2 className="display max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-5xl">
              {copy.firstVisit.title}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#40564d]">
              {copy.firstVisit.body}
            </p>
            <a
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              <CalendarDays aria-hidden="true" size={18} />
              {copy.firstVisit.action}
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-32" id="sobre">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[32rem] overflow-hidden rounded-[2.5rem] bg-[#123c2d] shadow-[0_24px_70px_rgba(19,35,29,0.16)]" data-reveal>
            <Image
              alt={copy.about.imageAlt}
              className="object-cover object-[52%_42%]"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              src="/dani-profile-healing.webp"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(9,39,29,0.74)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e5cc96]">
                Dani Therapies
              </p>
              <p className="mt-3 max-w-md text-xl font-semibold leading-8">
                {copy.about.imageCaption}
              </p>
            </div>
          </div>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as RevealStyle}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
              {copy.nav.about}
            </p>
            <h2 className="display mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
              {copy.about.title}
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
              {copy.about.body}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {copy.about.stats.map(({ title, text }) => (
                <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_50px_rgba(19,35,29,0.08)]" key={title}>
                  <p className="text-lg font-bold text-[#123c2d]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#52675e]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center" data-reveal>
            <h2 className="display mx-auto max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
              {copy.promptsTitle}
            </h2>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
              {copy.promptsIntro}
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {copy.prompts.slice(0, 3).map((prompt, index) => (
              <article
                className="prompt-card group relative min-h-72 overflow-hidden rounded-[2rem] border border-[#173f30]/10 bg-[#123c2d] shadow-[0_20px_55px_rgba(19,35,29,0.12)] transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(19,35,29,0.2)]"
                data-reveal
                key={prompt}
                style={{ "--reveal-delay": `${index * 90}ms` } as RevealStyle}
              >
                <Image
                  alt=""
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={promptVisuals[index].image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,32,24,0.08)_0%,rgba(8,32,24,0.48)_45%,rgba(8,32,24,0.88)_100%)]" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7">
                  <span className="w-fit rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ead7aa] backdrop-blur-md">
                    {copy.promptTones[index]}
                  </span>
                  <p className="max-w-[28rem] text-xl font-semibold leading-8 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
                    {prompt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e4eee6] px-5 py-24 sm:py-32" id="sessoes">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
                {copy.services.eyebrow}
              </p>
              <h2 className="display mt-4 max-w-3xl text-4xl font-semibold text-[#123c2d] sm:text-6xl">
                {copy.servicesPreview.title}
              </h2>
              <p className="mt-7 max-w-3xl text-base leading-8 text-[#52675e] sm:text-lg">
                {copy.servicesPreview.intro}
              </p>
            </div>
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#123c2d] px-6 font-bold text-white transition hover:bg-[#1f5742]"
              href={`/${locale}/sessoes`}
            >
              {copy.servicesPreview.allLabel}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {servicePreview.map((service, index) => (
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

      <section className="bg-[#0d3024] px-5 py-24 text-white sm:py-32" id="cursos">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
              {copy.course.eyebrow}
            </p>
            <h2 className="display mt-4 max-w-xl text-5xl font-semibold leading-tight sm:text-6xl">
              {primaryCourse?.title || copy.course.title}
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/65">
              {primaryCourse?.text || copy.course.intro}
            </p>
            <Link
              className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#d8bd82] px-6 font-bold text-[#10251d] transition hover:bg-[#ead7aa]"
              href={`/${locale}/cursos`}
            >
              {copy.coursePreview.allLabel}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>

          <div
            className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 shadow-2xl shadow-black/10 sm:p-8"
            data-reveal
            style={{ "--reveal-delay": "120ms" } as RevealStyle}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8bd82]">
              Curso em destaque
            </p>
            <h3 className="display mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {primaryCourse?.title || copy.course.title}
            </h3>
            <p className="mt-5 leading-8 text-white/68">
              {primaryCourse?.description || primaryCourse?.text || copy.course.intro}
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5">
                <CreditCard aria-hidden="true" className="text-[#d8bd82]" size={24} />
                <p className="mt-4 text-sm font-bold text-white/58">
                  {primaryCourse?.duration || copy.course.duration}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="price-text text-2xl font-bold leading-tight text-[#d8bd82] sm:text-3xl">
                  {primaryCourse?.price || copy.course.price}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/55">
                  {copy.coursePreview.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:py-36" id="blog">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
              {copy.nav.blog}
            </p>
            <h2 className="display mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#123c2d] sm:text-6xl">
              {copy.blogPreview.title}
            </h2>
            <blockquote className="mt-7 max-w-3xl text-xl font-medium leading-8 text-[#52675e] sm:text-2xl sm:leading-10">
              {copy.blogPreview.quotePrefix}{copy.quote}{copy.blogPreview.quoteSuffix}
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
            href={`/${locale}/blog`}
          >
            {copy.blogPreview.allLabel}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <section className="px-5 pb-24 sm:pb-32" id="contato">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#123c2d] text-white lg:grid-cols-[0.8fr_1.2fr]" data-reveal>
          <div className="noise border-b border-white/15 p-8 sm:p-12 lg:border-b-0 lg:border-r">
            <MessageCircle className="text-[#d8bd82]" size={36} strokeWidth={1.5} />
            <p className="mt-16 text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
              {copy.contact.eyebrow}
            </p>
            <h2 className="display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {copy.contact.title}
            </h2>
            <p className="mt-6 leading-7 text-white/65">{copy.contact.body}</p>
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
