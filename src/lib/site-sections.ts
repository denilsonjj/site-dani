import { getContent, type Locale } from "./content";
import { aboutPageContent } from "./detail-content";
import type { SiteSection, SiteSectionRow } from "./cms";

function section(
  pageKey: string,
  sectionKey: string,
  values: Partial<Omit<SiteSection, "pageKey" | "sectionKey">>,
): SiteSection {
  return {
    body: "",
    description: "",
    eyebrow: "",
    imageAlt: "",
    imageUrl: "",
    pageKey,
    primaryCtaHref: "",
    primaryCtaLabel: "",
    secondaryCtaHref: "",
    secondaryCtaLabel: "",
    sectionKey,
    title: "",
    ...values,
  };
}

export function getHomeSectionFallbacks(locale: Locale): SiteSection[] {
  const copy = getContent(locale);

  return [
    section("home", "hero", {
      description: copy.hero.description,
      eyebrow: copy.hero.eyebrow,
      imageAlt: "Aurora boreal",
      imageUrl: "/aurora-real.webm",
      primaryCtaHref: `/${locale}/sessoes#primeira-consulta-online`,
      primaryCtaLabel: copy.hero.primary,
      secondaryCtaHref: `/${locale}/sessoes`,
      secondaryCtaLabel: copy.hero.secondary,
      title: copy.hero.title,
      body: copy.hero.note,
    }),
    section("home", "first-visit", {
      body: copy.firstVisit.body,
      description: `${copy.firstVisit.duration}\n${copy.firstVisit.format}`,
      eyebrow: copy.firstVisit.eyebrow,
      imageAlt: copy.firstVisit.imageAlt,
      imageUrl: "/first-visit-spiritual.webp",
      primaryCtaHref: "#contato",
      primaryCtaLabel: copy.firstVisit.action,
      title: copy.firstVisit.title,
    }),
    section("home", "about", {
      body: aboutPageContent[locale].intro.slice(0, 2).join("\n\n"),
      eyebrow: copy.nav.about,
      imageAlt: copy.about.imageAlt,
      imageUrl: "/dani-quem-somos.webp",
      primaryCtaHref: `/${locale}/quem-somos`,
      primaryCtaLabel: copy.about.detailsLabel,
      description: copy.about.imageCaption,
      title: copy.about.title,
    }),
    ...copy.about.stats.map((stat, index) =>
      section("home", `about-stat-${index + 1}`, {
        body: stat.text,
        title: stat.title,
      }),
    ),
    section("home", "prompts", {
      body: copy.promptsIntro,
      title: copy.promptsTitle,
    }),
    ...copy.prompts.slice(0, 3).map((prompt, index) =>
      section("home", `prompt-${index + 1}`, {
        eyebrow: copy.promptTones[index],
        imageAlt: prompt,
        imageUrl: [
          "/gallery/prompt-crystal.webp",
          "/gallery/prompt-waterfall.webp",
          "/gallery/prompt-pet.avif",
        ][index],
        title: prompt,
      }),
    ),
    section("home", "sessions", {
      body: copy.servicesPreview.intro,
      eyebrow: copy.services.eyebrow,
      primaryCtaHref: `/${locale}/sessoes`,
      primaryCtaLabel: copy.servicesPreview.allLabel,
      title: copy.servicesPreview.title,
    }),
    section("home", "course", {
      body: copy.course.intro,
      eyebrow: copy.course.eyebrow,
      imageAlt: copy.course.title,
      imageUrl: "/services/original-course-sensory-activation.webp",
      primaryCtaLabel: copy.coursePreview.detailsLabel,
      title: copy.course.title,
    }),
    section("home", "blog", {
      description: `${copy.blogPreview.quotePrefix}${copy.quote}${copy.blogPreview.quoteSuffix}`,
      eyebrow: copy.nav.blog,
      primaryCtaHref: `/${locale}/blog`,
      primaryCtaLabel: copy.blogPreview.allLabel,
      title: copy.blogPreview.title,
    }),
    section("home", "contact", {
      body: copy.contact.body,
      eyebrow: copy.contact.eyebrow,
      title: copy.contact.title,
    }),
  ];
}

export function getAboutSectionFallbacks(locale: Locale): SiteSection[] {
  const copy = getContent(locale);
  const page = aboutPageContent[locale];

  return [
    section("about", "introduction", {
      body: page.intro.join("\n\n"),
      description: page.quote,
      eyebrow: page.eyebrow,
      imageAlt: copy.about.imageAlt,
      imageUrl: "/dani-quem-somos.webp",
      title: page.title,
    }),
    section("about", "work", {
      body: page.servicesBody.join("\n\n"),
      eyebrow: page.servicesEyebrow,
      primaryCtaHref: `/${locale}/sessoes`,
      primaryCtaLabel: page.sessionsAction,
      title: page.servicesTitle,
    }),
  ];
}

const listingCopy: Record<Locale, {
  blogBody: string;
  blogTitle: string;
  coursesBody: string;
  coursesTitle: string;
  sessionsBody: string;
  sessionsTitle: string;
}> = {
  pt: {
    blogBody: "Conteúdos sobre cuidado energético, espiritualidade e preparação para as sessões.",
    blogTitle: "Blog da Dani Therapies",
    coursesBody: "Escolha a formação que faz sentido para o seu momento e consulte todos os detalhes antes da inscrição.",
    coursesTitle: "Cursos disponíveis",
    sessionsBody: "Conheça todos os atendimentos, durações e valores disponíveis.",
    sessionsTitle: "Sessões disponíveis",
  },
  en: {
    blogBody: "Content about energetic care, spirituality and preparation for sessions.",
    blogTitle: "Dani Therapies Blog",
    coursesBody: "Choose the training that suits your moment and review every detail before enrolling.",
    coursesTitle: "Available courses",
    sessionsBody: "Explore all available services, durations and prices.",
    sessionsTitle: "Available sessions",
  },
  es: {
    blogBody: "Contenidos sobre cuidado energético, espiritualidad y preparación para las sesiones.",
    blogTitle: "Blog de Dani Therapies",
    coursesBody: "Elige la formación que encaja con tu momento y consulta todos los detalles antes de inscribirte.",
    coursesTitle: "Cursos disponibles",
    sessionsBody: "Conoce todos los servicios, duraciones y precios disponibles.",
    sessionsTitle: "Sesiones disponibles",
  },
  nl: {
    blogBody: "Inhoud over energetische zorg, spiritualiteit en voorbereiding op sessies.",
    blogTitle: "Dani Therapies Blog",
    coursesBody: "Kies de opleiding die bij jouw moment past en bekijk alle details voordat je je inschrijft.",
    coursesTitle: "Beschikbare cursussen",
    sessionsBody: "Bekijk alle beschikbare behandelingen, duur en prijzen.",
    sessionsTitle: "Beschikbare sessies",
  },
};

export function getListingSectionFallbacks(pageKey: "blog" | "courses" | "sessions", locale: Locale) {
  const copy = getContent(locale);
  const labels = listingCopy[locale];
  const values = pageKey === "blog"
    ? { body: labels.blogBody, eyebrow: copy.nav.blog, title: labels.blogTitle }
    : pageKey === "courses"
      ? { body: labels.coursesBody, eyebrow: copy.course.eyebrow, title: labels.coursesTitle }
      : { body: labels.sessionsBody, eyebrow: copy.services.eyebrow, title: labels.sessionsTitle };

  return [section(pageKey, "hero", values)];
}

export function splitParagraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function getAdminSectionFallbackRows(): SiteSectionRow[] {
  const localeSections = Object.fromEntries(
    (["pt", "en", "es", "nl"] as Locale[]).map((locale) => [
      locale,
      [
        ...getHomeSectionFallbacks(locale),
        ...getAboutSectionFallbacks(locale),
        ...getListingSectionFallbacks("sessions", locale),
        ...getListingSectionFallbacks("courses", locale),
        ...getListingSectionFallbacks("blog", locale),
      ],
    ]),
  ) as Record<Locale, SiteSection[]>;

  return localeSections.pt.map((base, index) => {
    const translated = Object.fromEntries(
      (Object.keys(localeSections) as Locale[]).map((locale) => [
        locale,
        localeSections[locale].find(
          (item) => item.pageKey === base.pageKey && item.sectionKey === base.sectionKey,
        ) || base,
      ]),
    ) as Record<Locale, SiteSection>;

    const localised = (key: keyof SiteSection) => ({
      en: String(translated.en[key] || ""),
      es: String(translated.es[key] || ""),
      nl: String(translated.nl[key] || ""),
      pt: String(translated.pt[key] || ""),
    });

    return {
      body: localised("body"),
      description: localised("description"),
      eyebrow: localised("eyebrow"),
      id: `fallback-${base.pageKey}-${base.sectionKey}`,
      image_alt: localised("imageAlt"),
      image_url: base.imageUrl || null,
      is_published: true,
      page_key: base.pageKey,
      primary_cta_href: base.primaryCtaHref || null,
      primary_cta_label: localised("primaryCtaLabel"),
      section_key: base.sectionKey,
      secondary_cta_href: base.secondaryCtaHref || null,
      secondary_cta_label: localised("secondaryCtaLabel"),
      sort_order: index,
      title: localised("title"),
    };
  });
}
