import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/content";
import { getLegalDocument, type LegalDocumentKey } from "@/lib/legal-content";

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
  const document = getLegalDocument(key, locale);
  return { title: document.title, description: document.introduction[0] };
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
  const document = getLegalDocument(key, locale);

  return (
    <main className="min-h-screen bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-12">
        <Link className="text-sm font-bold text-[#547461]" href={`/${locale}`}>
          ← Dani Therapies
        </Link>
        <h1 className="display mt-10 text-4xl font-semibold sm:text-6xl">{document.title}</h1>
        <div className="mt-7 grid gap-4 text-base leading-8 text-[#40564d]">
          {document.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="mt-10 grid gap-8">
          {document.sections.map((section, index) => (
            <section className="rounded-2xl bg-[#f8f5ec] p-6 text-[#40564d] sm:p-8" key={`${section.heading || "section"}-${index}`}>
              {section.heading ? <h2 className="display text-2xl font-bold text-[#123c2d] sm:text-3xl">{section.heading}</h2> : null}
              <div className={`${section.heading ? "mt-4" : ""} grid gap-4 leading-8`}>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items ? (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
