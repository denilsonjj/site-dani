import type { Locale } from "./content";

export type BlogPost = {
  author: string;
  date: string;
  excerpt: Record<Locale, string>;
  image: string;
  readingTime: string;
  slug: string;
  title: Record<Locale, string>;
};

export const blogPosts: BlogPost[] = [
  {
    author: "Dani Therapies",
    date: "2026-06-16",
    excerpt: {
      pt: "Um guia breve para perceber quando o corpo, a casa ou a mente pedem uma pausa energética.",
      en: "A short guide to notice when your body, home or mind is asking for energetic pause.",
      es: "Una guía breve para notar cuándo el cuerpo, la casa o la mente piden una pausa energética.",
      nl: "Een korte gids om te merken wanneer lichaam, huis of geest om energetische rust vragen.",
    },
    image: "/services/original-energy-cleansing.webp",
    readingTime: "4 min",
    slug: "sinais-de-restauracao-energetica",
    title: {
      pt: "Sinais de que pode precisar de restauração energética",
      en: "Signs you may need energetic restoration",
      es: "Señales de que puedes necesitar restauración energética",
      nl: "Signalen dat je energetisch herstel nodig hebt",
    },
  },
  {
    author: "Dani Therapies",
    date: "2026-06-16",
    excerpt: {
      pt: "Como preparar o espaço, a intenção e o ritmo antes de uma consulta online.",
      en: "How to prepare your space, intention and rhythm before an online session.",
      es: "Cómo preparar el espacio, la intención y el ritmo antes de una sesión online.",
      nl: "Hoe je ruimte, intentie en ritme voorbereidt voor een online sessie.",
    },
    image: "/services/original-first-consultation.webp",
    readingTime: "3 min",
    slug: "como-preparar-primeira-consulta",
    title: {
      pt: "Como preparar a primeira consulta",
      en: "How to prepare for the first consultation",
      es: "Cómo preparar la primera consulta",
      nl: "Hoe je het eerste consult voorbereidt",
    },
  },
  {
    author: "Dani Therapies",
    date: "2026-06-16",
    excerpt: {
      pt: "Notas para compreender a harmonização de ambientes sem excesso de informação.",
      en: "Notes to understand environment harmonisation without overwhelm.",
      es: "Notas para comprender la armonización de ambientes sin exceso de información.",
      nl: "Notities om harmonisatie van ruimtes rustig te begrijpen.",
    },
    image: "/services/original-environment-harmonization.webp",
    readingTime: "5 min",
    slug: "harmonizacao-de-ambientes",
    title: {
      pt: "Harmonização de ambientes: por onde começar",
      en: "Environment harmonisation: where to begin",
      es: "Armonización de ambientes: por dónde empezar",
      nl: "Harmonisatie van ruimtes: waar begin je",
    },
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) || null;
}
