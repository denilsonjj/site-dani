import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/cms";
import { locales, type Locale } from "@/lib/content";

export async function generateStaticParams() {
  const items = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getPublishedBlogPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
    }),
  );
  return items.flat();
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};

  const locale = rawLocale as Locale;
  const post = await getPublishedBlogPost(slug, locale);
  if (!post) return {};

  return {
    description: post.excerpt[locale],
    openGraph: {
      description: post.excerpt[locale],
      images: post.image ? [post.image] : undefined,
      title: post.title[locale],
      type: "article",
    },
    title: post.title[locale],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const post = await getPublishedBlogPost(slug, locale);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <article className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
        <Link className="text-sm font-bold text-[#547461]" href={`/${locale}/blog`}>
          ← Blog
        </Link>
        <p className="mt-12 text-xs font-bold uppercase tracking-[0.18em] text-[#799a81]">
          {post.author} · {post.readingTime}
        </p>
        <h1 className="display mt-5 text-5xl font-semibold leading-tight sm:text-7xl">
          {post.title[locale]}
        </h1>
        <p className="mt-7 text-xl leading-9 text-[#52675e]">{post.excerpt[locale]}</p>
        {post.image ? <div className="relative mt-12 h-[28rem] overflow-hidden rounded-[2rem]">
          <Image
            alt=""
            className="object-cover"
            fill
            priority
            sizes="(min-width: 768px) 896px, 100vw"
            src={post.image}
          />
        </div> : null}
        <div className="mt-12 rounded-[2rem] bg-white p-8 leading-8 text-[#40564d] shadow-[0_20px_60px_rgba(19,35,29,0.08)] sm:p-10">
          {post.body[locale].split("\n\n").map((paragraph) => (
            <p className="mt-6 first:mt-0" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
