import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "@/components/catalog-detail";
import { getPublishedCourses } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { detailPageCopy, getDetailParagraphs } from "@/lib/detail-content";

export async function generateStaticParams() {
  const items = await Promise.all(
    locales.map(async (locale) => {
      const courses = await getPublishedCourses(locale);
      return courses.map((course) => ({ locale, slug: course.slug || course.productId }));
    }),
  );
  return items.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const courses = await getPublishedCourses(locale);
  const course = courses.find((item) => (item.slug || item.productId) === slug);
  if (!course) return {};

  return {
    title: `${course.title} | Dani Therapies`,
    description: course.description || course.text || copy.course.intro,
    alternates: { canonical: `/${locale}/cursos/${slug}` },
    openGraph: {
      title: course.title,
      description: course.description || course.text || copy.course.intro,
      images: [course.image || "/services/original-course-sensory-activation.webp"],
      type: "website",
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const courses = await getPublishedCourses(locale);
  const course = courses.find((item) => (item.slug || item.productId) === slug);
  if (!course) notFound();

  const copy = getContent(locale);
  const labels = detailPageCopy[locale];

  return (
    <CatalogDetail
      aboutTitle={labels.aboutTitle}
      actionLabel={copy.course.cta}
      backHref={`/${locale}/cursos`}
      backLabel={labels.backCourse}
      durationLabel={labels.duration}
      eyebrow={labels.courseEyebrow}
      investmentLabel={labels.investment}
      locale={locale}
      paragraphs={getDetailParagraphs(course, locale)}
      practicalTitle={labels.practicalTitle}
      service={course}
    />
  );
}
