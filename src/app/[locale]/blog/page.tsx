import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getPublishedBlogPosts, getPublishedSiteSections } from "@/lib/cms";
import { locales, type Locale } from "@/lib/content";
import { getListingSectionFallbacks } from "@/lib/site-sections";

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
    title: "Blog | Dani Therapies",
    description:
      "Blog sobre cuidado energético, espiritualidade, primeiras consultas e harmonização de ambientes.",
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const [blogPosts, sections] = await Promise.all([
    getPublishedBlogPosts(locale),
    getPublishedSiteSections("blog", locale, getListingSectionFallbacks("blog", locale)),
  ]);
  const hero = sections.hero;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#547461]" href={`/${locale}`}>
            ← Dani Therapies
          </Link>
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#547461]">
                {hero.eyebrow}
              </p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
                {hero.title}
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#52675e]">
              {hero.body}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                className="overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-white shadow-[0_20px_60px_rgba(19,35,29,0.08)]"
                key={post.slug}
              >
                <div className="relative h-56">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    src={post.image}
                  />
                </div>
                <div className="p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#799a81]">
                    {post.readingTime}
                  </p>
                  <h2 className="display mt-4 text-3xl font-semibold leading-tight">
                    {post.title[locale]}
                  </h2>
                  <p className="mt-4 leading-7 text-[#52675e]">{post.excerpt[locale]}</p>
                  <Link
                    className="mt-7 inline-flex items-center gap-2 border-b border-[#123c2d] pb-1 text-sm font-bold"
                    href={`/${locale}/blog/${post.slug}`}
                  >
                    Ler artigo
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
