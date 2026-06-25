import type { Locale } from "./content";

export const siteConfig = {
  domain: "https://www.danitherapies.com",
  name: "Dani Therapies",
  whatsapp: "31616018467",
  email: "hello@danitherapies.com",
  kvk: "94756279",
  defaultLocale: "pt" satisfies Locale,
};

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    siteConfig.domain;

  if (raw.startsWith("http")) return raw.replace(/\/$/, "");

  return `https://${raw}`.replace(/\/$/, "");
}
