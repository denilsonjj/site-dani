import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedCourses } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";

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
    title: "Cursos | Dani Therapies",
    description: "Cursos online da Dani Therapies com inscrição simples e pagamento preparado.",
  };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const courses = await getPublishedCourses(locale);
  const primaryCourse = courses[0];

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#d8bd82]" href={`/${locale}`}>
            ← Dani Therapies
          </Link>
          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
                {copy.course.eyebrow}
              </p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
                {primaryCourse?.title || copy.course.title}
              </h1>
              <p className="mt-7 max-w-xl leading-8 text-white/68">
                {primaryCourse?.description || copy.course.intro}
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 shadow-2xl shadow-black/10">
              <Sparkles className="text-[#d8bd82]" size={30} strokeWidth={1.5} />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#d8bd82]">
                Inscrição
              </p>
              <p className="mt-3 leading-7 text-white/68">
                A inscrição fica separada da página principal para manter o site mais leve.
                Nesta fase, o formulário pede apenas nome, idade e e-mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="rounded-[2rem] bg-[#123c2d] p-7 text-white shadow-[0_22px_70px_rgba(19,35,29,0.16)]" data-reveal>
            <CreditCard aria-hidden="true" className="text-[#d8bd82]" size={28} />
            <p className="mt-6 text-sm font-bold text-white/55">
              {primaryCourse?.duration || copy.course.duration}
            </p>
            <p className="price-text mt-5 text-4xl font-bold leading-tight text-[#d8bd82]">
              {primaryCourse?.price || copy.course.price}
            </p>
            <p className="mt-5 leading-7 text-white/62">
              A base de pagamento continua preparada para Stripe; enquanto as chaves não chegam,
              o fluxo segue por WhatsApp.
            </p>
          </div>

          <div
            className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_22px_70px_rgba(19,35,29,0.10)]"
            data-reveal
          >
            <h2 className="display text-4xl font-semibold text-[#123c2d]">{copy.course.formTitle}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#52675e]">{copy.course.paymentNote}</p>
            <div className="mt-7">
              <CheckoutButton locale={locale} productId={primaryCourse?.productId || "online-course"}>
                {copy.course.cta}
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
