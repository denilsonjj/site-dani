import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, getPublishedCourses, getPublishedServices } from "@/lib/cms";
import { locales } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const legalRoutes = [
  "politica-de-cookies",
  "termos-e-condicoes",
  "politica-de-privacidade",
];
const sectionRoutes = ["quem-somos", "sessoes", "cursos", "parceiros", "blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const catalogRoutes = await Promise.all(
    locales.map(async (locale) => {
      const [services, courses, posts] = await Promise.all([
        getPublishedServices(locale),
        getPublishedCourses(locale),
        getPublishedBlogPosts(locale),
      ]);

      return {
        blog: posts.map((post) => ({ date: post.date, url: `${siteUrl}/${locale}/blog/${post.slug}` })),
        catalog: [
          ...services.map((service) => `${siteUrl}/${locale}/sessoes/${service.slug || service.productId}`),
          ...courses.map((course) => `${siteUrl}/${locale}/cursos/${course.slug || course.productId}`),
        ],
      };
    }),
  );

  return [
    ...locales.map((locale) => ({
      changeFrequency: "weekly" as const,
      lastModified: now,
      priority: locale === "pt" ? 1 : 0.9,
      url: `${siteUrl}/${locale}`,
    })),
    ...locales.flatMap((locale) =>
      legalRoutes.map((route) => ({
        changeFrequency: "monthly" as const,
        lastModified: now,
        priority: 0.3,
        url: `${siteUrl}/${locale}/${route}`,
      })),
    ),
    ...catalogRoutes.flatMap((routes) => routes.catalog).map((url) => ({
      changeFrequency: "weekly" as const,
      lastModified: now,
      priority: 0.75,
      url,
    })),
    ...locales.flatMap((locale) =>
      sectionRoutes.map((route) => ({
        changeFrequency: "weekly" as const,
        lastModified: now,
        priority: route === "blog" ? 0.7 : 0.8,
        url: `${siteUrl}/${locale}/${route}`,
      })),
    ),
    ...catalogRoutes.flatMap((routes) =>
      routes.blog.map((post) => ({
        changeFrequency: "monthly" as const,
        lastModified: post.date,
        priority: 0.6,
        url: post.url,
      })),
    ),
  ];
}
