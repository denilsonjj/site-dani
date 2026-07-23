import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalDocument } from "@/lib/cms";
import { locales, type Locale } from "@/lib/content";
import { splitParagraphs } from "@/lib/site-sections";

export const dynamic = "force-dynamic";

type LegalDocumentKey = "cookies" | "privacy" | "terms";

const legalPages = {
  "politica-de-cookies": "cookies",
  "termos-e-condicoes": "terms",
  "politica-de-privacidade": "privacy",
} as const;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.keys(legalPages).map((legal) => ({ legal, locale })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legal: string; locale: string }>;
}): Promise<Metadata> {
  const { legal, locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale) || !(legal in legalPages)) return {};

  const locale = rawLocale as Locale;
  const key = legalPages[legal as keyof typeof legalPages] as LegalDocumentKey;
  const document = await getLegalDocument(key, locale);
  if (!document) return {};
  return { title: document.title, description: splitParagraphs(document.body)[0] || "" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ legal: string; locale: string }>;
}) {
  const { legal, locale: rawLocale } = await params;

  if (!locales.includes(rawLocale as Locale) || !(legal in legalPages)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const key = legalPages[legal as keyof typeof legalPages] as LegalDocumentKey;
  const document = await getLegalDocument(key, locale);
  if (!document) notFound();
  const paragraphs = splitParagraphs(document.body);

  return (
    <main className="min-h-screen bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-12">
        <Link className="text-sm font-bold text-[#547461]" href={`/${locale}`}>
          ← Dani Therapies
        </Link>
        <h1 className="display mt-10 text-4xl font-semibold sm:text-6xl">{document.title}</h1>
        <div className="mt-10 grid gap-6 rounded-2xl bg-[#f8f5ec] p-6 text-base leading-8 text-[#40564d] sm:p-8">
          {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 32)}`}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}
