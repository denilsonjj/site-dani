import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { locales } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const legalRoutes = [
  "politica-de-cookies",
  "termos-e-condicoes",
  "politica-de-privacidade",
];
const sectionRoutes = ["sessoes", "cursos", "blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

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
    ...locales.flatMap((locale) =>
      sectionRoutes.map((route) => ({
        changeFrequency: "weekly" as const,
        lastModified: now,
        priority: route === "blog" ? 0.7 : 0.8,
        url: `${siteUrl}/${locale}/${route}`,
      })),
    ),
    ...locales.flatMap((locale) =>
      blogPosts.map((post) => ({
        changeFrequency: "monthly" as const,
        lastModified: post.date,
        priority: 0.6,
        url: `${siteUrl}/${locale}/blog/${post.slug}`,
      })),
    ),
  ];
}
