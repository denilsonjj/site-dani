import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "@/components/catalog-detail";
import { getPublishedServices } from "@/lib/cms";
import { getContent, locales, type Locale } from "@/lib/content";
import { detailPageCopy, getDetailParagraphs } from "@/lib/detail-content";

export async function generateStaticParams() {
  const items = await Promise.all(
    locales.map(async (locale) => {
      const services = await getPublishedServices(locale);
      return services.map((service) => ({ locale, slug: service.slug || service.productId }));
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
  const services = await getPublishedServices(locale);
  const service = services.find((item) => (item.slug || item.productId) === slug);
  if (!service) return {};

  return {
    title: `${service.title} | Dani Therapies`,
    description: service.text,
    alternates: { canonical: `/${locale}/sessoes/${slug}` },
    openGraph: {
      title: service.title,
      description: service.text,
      images: service.image ? [service.image] : undefined,
      type: "website",
    },
  };
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();

  const locale = rawLocale as Locale;
  const services = await getPublishedServices(locale);
  const service = services.find((item) => (item.slug || item.productId) === slug);
  if (!service) notFound();

  const copy = getContent(locale);
  const labels = detailPageCopy[locale];

  return (
    <CatalogDetail
      aboutTitle={labels.aboutTitle}
      actionLabel={copy.services.action}
      backHref={`/${locale}/sessoes`}
      backLabel={labels.backSession}
      durationLabel={labels.duration}
      eyebrow={labels.sessionEyebrow}
      investmentLabel={labels.serviceInvestment}
      locale={locale}
      paragraphs={getDetailParagraphs(service, locale)}
      practicalTitle={labels.practicalTitle}
      service={service}
    />
  );
}
