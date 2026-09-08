import { locales, type Locale } from "./content";

export function getLocalizedAlternates(locale: Locale, path = "") {
  const suffix = path && !path.startsWith("/") ? `/${path}` : path;

  return {
    canonical: `/${locale}${suffix}`,
    languages: Object.fromEntries([
      ...locales.map((language) => [language, `/${language}${suffix}`]),
      ["x-default", `/pt${suffix}`],
    ]),
  };
}

export function getSeoTitle(title: string) {
  return title.toLowerCase().includes("dani therapies") ? { absolute: title } : title;
}
