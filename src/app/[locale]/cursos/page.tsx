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

const pageCopy = {
  pt: {
    back: "← Dani Therapies",
    beforeTitle: "Antes da inscrição",
    beforeText:
      "Veja o nome do curso, a proposta, a duração e o valor. Depois disso, a inscrição abre o formulário obrigatório antes do pagamento.",
    listTitle: "Cursos disponíveis",
    listIntro: "Escolha o curso que faz sentido para o seu momento e avance para a inscrição.",
    itemLabel: "Curso",
  },
  en: {
    back: "← Dani Therapies",
    beforeTitle: "Before Enrolment",
    beforeText:
      "Review the course name, purpose, duration and price. After that, enrolment opens the required form before payment.",
    listTitle: "Available Courses",
    listIntro: "Choose the course that fits your moment and continue to enrolment.",
    itemLabel: "Course",
  },
  es: {
    back: "← Dani Therapies",
    beforeTitle: "Antes de la inscripción",
    beforeText:
      "Consulta el nombre del curso, la propuesta, la duración y el valor. Después, la inscripción abre el formulario obligatorio antes del pago.",
    listTitle: "Cursos disponibles",
    listIntro: "Elige el curso que encaja con tu momento y continúa con la inscripción.",
    itemLabel: "Curso",
  },
  nl: {
    back: "← Dani Therapies",
    beforeTitle: "Voor inschrijving",
    beforeText:
      "Bekijk de naam, inhoud, duur en prijs van de cursus. Daarna opent de inschrijving het verplichte formulier vóór betaling.",
    listTitle: "Beschikbare cursussen",
    listIntro: "Kies de cursus die past bij jouw moment en ga verder met inschrijven.",
    itemLabel: "Cursus",
  },
} as const;

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
    description: "Cursos online da Dani Therapies com descrição, duração, valor e inscrição.",
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
  const labels = pageCopy[locale];
  const courses = await getPublishedCourses(locale);
  const primaryCourse = courses[0];
  const courseList = courses.length
    ? courses
    : [
        {
          description: copy.course.intro,
          duration: copy.course.duration,
          price: copy.course.price,
          productId: "online-course",
          text: copy.course.intro,
          title: copy.course.title,
        },
      ];

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="bg-[#0d3024] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-bold text-[#d8bd82]" href={`/${locale}`}>
            {labels.back}
          </Link>
          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">
                {copy.course.eyebrow}
              </p>
              <h1 className="display mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
                {copy.course.title}
              </h1>
              <p className="mt-7 max-w-xl leading-8 text-white/68">
                {primaryCourse?.description || primaryCourse?.text || copy.course.intro}
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 shadow-2xl shadow-black/10">
              <Sparkles className="text-[#d8bd82]" size={30} strokeWidth={1.5} />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-[#d8bd82]">
                {labels.beforeTitle}
              </p>
              <p className="mt-3 leading-7 text-white/68">
                {labels.beforeText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <h2 className="display text-4xl font-semibold text-[#123c2d] sm:text-5xl">
              {labels.listTitle}
            </h2>
            <p className="mt-5 leading-8 text-[#52675e]">
              {labels.listIntro}
            </p>
          </div>

          <div className="mt-12 grid gap-6">
            {courseList.map((course, index) => (
              <article
                className="grid overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-white shadow-[0_22px_70px_rgba(19,35,29,0.10)] lg:grid-cols-[1fr_0.38fr]"
                data-reveal
                key={course.productId}
              >
                <div className="p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#799a81]">
                    {labels.itemLabel} {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mt-4 text-4xl font-semibold leading-tight text-[#123c2d] sm:text-5xl">
                    {course.title}
                  </h3>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#52675e]">
                    {course.description || course.text}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-6 bg-[#123c2d] p-7 text-white sm:p-9">
                  <div>
                    <CreditCard aria-hidden="true" className="text-[#d8bd82]" size={28} />
                    <p className="mt-6 text-sm font-bold text-white/58">
                      {course.duration}
                    </p>
                    <p className="price-text mt-5 text-3xl font-bold leading-tight text-[#d8bd82]">
                      {course.price}
                    </p>
                  </div>
                  <CheckoutButton locale={locale} productId={course.productId}>
                    {copy.course.cta}
                  </CheckoutButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
