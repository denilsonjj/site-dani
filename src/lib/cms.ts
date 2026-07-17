import { blogPosts as fallbackBlogPosts } from "./blog";
import { getProduct } from "./catalog";
import { getContent, getServiceTranslation, locales, type Locale } from "./content";
import { formatPrice } from "./currency";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  hasSupabaseAdminConfig,
  hasSupabasePublicConfig,
} from "./supabase/server";
import { mergeAdminSectionRows } from "./site-sections";

type LocalisedValue = Record<string, string> | null;

export type SiteSectionRow = {
  body: LocalisedValue;
  description: LocalisedValue;
  eyebrow: LocalisedValue;
  id: string;
  image_alt: LocalisedValue;
  image_url: string | null;
  is_published: boolean;
  page_key: string;
  primary_cta_href: string | null;
  primary_cta_label: LocalisedValue;
  section_key: string;
  secondary_cta_href: string | null;
  secondary_cta_label: LocalisedValue;
  sort_order: number;
  title: LocalisedValue;
};

export type SiteSection = {
  body: string;
  description: string;
  eyebrow: string;
  imageAlt: string;
  imageUrl: string;
  pageKey: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  sectionKey: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
  title: string;
};

export type ServiceRow = {
  available_dates?: string[];
  amount_cents: number | null;
  badge: LocalisedValue;
  capacity_limit?: number | null;
  category: "session" | "course";
  currency: string;
  description: LocalisedValue;
  duration: LocalisedValue;
  id: string;
  image_url: string | null;
  is_published: boolean;
  price_label: LocalisedValue;
  product_id: string;
  requires_intake: boolean;
  requires_policy_acceptance: boolean;
  seats_paid?: number;
  seats_reserved?: number;
  slug: string;
  sort_order: number;
  stripe_price_env: string | null;
  summary: LocalisedValue;
  title: LocalisedValue;
};

export type BlogRow = {
  author: string;
  body: LocalisedValue;
  excerpt: LocalisedValue;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  reading_time: LocalisedValue;
  slug: string;
  sort_order: number;
  title: LocalisedValue;
};

type IntakeFieldRow = {
  field_type: "text" | "email" | "number" | "date" | "textarea" | "checkbox" | "select";
  help_text: LocalisedValue;
  key: string;
  label: LocalisedValue;
  options: unknown[];
  required: boolean;
  sort_order: number;
};

type LegalRow = {
  body: LocalisedValue;
  key: string;
  title: LocalisedValue;
  version: number;
};

export type SiteService = {
  amountCents?: number;
  badge: string;
  capacityLimit?: number | null;
  category: "session" | "course";
  currency: string;
  description: string;
  duration: string;
  id?: string;
  image?: string;
  price: string;
  productId: string;
  requiresIntake: boolean;
  requiresPolicyAcceptance: boolean;
  remainingSeats?: number | null;
  seatsPaid?: number;
  seatsReserved?: number;
  slug?: string;
  stripePriceEnv?: string;
  text: string;
  title: string;
};

export type SiteBlogPost = {
  author: string;
  body: Record<Locale, string>;
  date: string;
  excerpt: Record<Locale, string>;
  image: string;
  readingTime: string;
  slug: string;
  title: Record<Locale, string>;
};

export type CheckoutProduct = {
  availableDates: string[];
  amountCents?: number | null;
  capacityLimit?: number | null;
  currency?: string;
  intakeFields: IntakeField[];
  name: string;
  productId: string;
  requiresIntake: boolean;
  requiresPolicyAcceptance: boolean;
  remainingSeats?: number | null;
  seatsReserved?: number;
  serviceId?: string;
  stripePriceEnv: string;
};

export type CheckoutReceipt = {
  customerEmail: string;
  customerName: string;
  duration: string;
  locale: Locale;
  payload: Record<string, unknown>;
  price: string;
  productName: string;
  productId: string;
  submissionId: string;
  stripeCheckoutSessionId: string;
};

export type IntakeField = {
  fieldType: IntakeFieldRow["field_type"];
  helpText: string;
  key: string;
  label: string;
  options: unknown[];
  required: boolean;
};

export type LegalDocument = {
  body: string;
  key: string;
  title: string;
  version: number;
};

export type AdminOverview = {
  blogPosts: BlogRow[];
  configured: boolean;
  courses: ServiceRow[];
  sections: SiteSectionRow[];
  services: ServiceRow[];
};

function localise(value: LocalisedValue | undefined, locale: Locale, fallback = "") {
  if (!value) return fallback;
  return value[locale] || fallback || value.pt || value.en || value.es || value.nl || "";
}

function asLocaleRecord(value: LocalisedValue | undefined, fallback: Record<Locale, string>): Record<Locale, string> {
  return {
    pt: value?.pt || fallback.pt,
    en: value?.en || value?.pt || fallback.en,
    es: value?.es || value?.pt || fallback.es,
    nl: value?.nl || value?.pt || fallback.nl,
  };
}

const legacyThirtyDayServices = new Set(["depression-support", "migraine-support"]);
const legacyFifteenDayLabels = new Set(["15 dias", "15 days", "15 días", "15 dagen"]);
const thirtyDayLabels: Record<Locale, string> = {
  pt: "30 dias",
  en: "30 days",
  es: "30 días",
  nl: "30 dagen",
};

const courseTitles: Record<Locale, string> = {
  pt: "Percepção Sensorial | Aulas em português",
  en: "Sensory Perception | Lessons in Portuguese",
  es: "Percepción Sensorial | Clases en portugués",
  nl: "Zintuiglijke Waarneming | Lessen in het Portugees",
};

const englishCourseTitles: Record<Locale, string> = {
  pt: "Sensory Perception | Lessons in English",
  en: "Sensory Perception | Lessons in English",
  es: "Sensory Perception | Lessons in English",
  nl: "Sensory Perception | Lessons in English",
};

const legacyCourseTitles = [
  "ativação sensorial",
  "ativacao sensorial",
  "perceção sensorial",
  "percepcao sensorial",
  "sensory activation",
  "sensory perception",
  "activación sensorial",
  "percepción sensorial",
  "sensorische activering",
];

function mapService(row: ServiceRow, locale: Locale): SiteService {
  const translated = getServiceTranslation(locale, row.product_id);
  const storedDuration = localise(row.duration, locale, translated?.duration);
  const storedTitle = localise(row.title, locale, translated?.title);
  const normalisedCourseDuration = row.product_id === "online-course" && !/21h30|21:30/.test(storedDuration)
    ? {
        pt: "6 semanas · início: 15/08/2026 · horário: 21h30 (horário de Amesterdão)",
        en: "6 weeks · starts: 15/08/2026 · time: 21:30 (Amsterdam time)",
        es: "6 semanas · inicio: 15/08/2026 · horario: 21:30 (hora de Ámsterdam)",
        nl: "6 weken · start: 15/08/2026 · tijd: 21:30 (Amsterdamse tijd)",
      }[locale]
    : row.product_id === "online-course-en" && !/21h30|21:30/.test(storedDuration)
      ? {
          pt: "6 semanas · início: 21/11/2026 · horário: 21h30 (horário de Amesterdão)",
          en: "6 weeks · starts: 21/11/2026 · time: 21:30 (Amsterdam time)",
          es: "6 semanas · inicio: 21/11/2026 · horario: 21:30 (hora de Ámsterdam)",
          nl: "6 weken · start: 21/11/2026 · tijd: 21:30 (Amsterdamse tijd)",
        }[locale]
      : storedDuration;
  const slug = row.product_id === "online-course" && row.slug.includes("ativacao-sensorial")
    ? "percepcao-sensorial-aulas-em-portugues"
    : row.product_id === "online-course-en" && !row.slug
      ? "sensory-perception-lessons-in-english"
      : row.slug;
  return {
    amountCents: row.amount_cents ?? undefined,
    badge: localise(row.badge, locale, translated?.badge),
    capacityLimit: row.capacity_limit ?? null,
    category: row.category,
    currency: row.currency,
    description: localise(row.description, locale, translated?.text),
    duration: legacyThirtyDayServices.has(row.product_id) && legacyFifteenDayLabels.has(storedDuration)
      ? thirtyDayLabels[locale]
      : normalisedCourseDuration,
    id: row.id,
    image: row.image_url || undefined,
    price: formatPrice(
      row.amount_cents,
      row.currency,
      locale,
      localise(row.price_label, locale, translated?.price),
    ),
    productId: row.product_id,
    requiresIntake: row.requires_intake,
    requiresPolicyAcceptance: row.requires_policy_acceptance,
    remainingSeats:
      row.capacity_limit === null || row.capacity_limit === undefined
        ? null
        : Math.max(row.capacity_limit - (row.seats_reserved || 0), 0),
    seatsPaid: row.seats_paid || 0,
    seatsReserved: row.seats_reserved || 0,
    slug,
    stripePriceEnv: row.stripe_price_env || undefined,
    text: localise(row.summary, locale, translated?.text),
    title: row.product_id === "online-course-en"
      ? (storedTitle || englishCourseTitles[locale])
      : row.product_id === "online-course" && legacyCourseTitles.some((title) => storedTitle.toLocaleLowerCase(locale).includes(title))
        ? courseTitles[locale]
        : storedTitle,
  };
}

const fallbackSessionSeed: Array<Omit<SiteService, "category" | "currency" | "requiresPolicyAcceptance">> = [
  {
    amountCents: 6900,
    badge: "Novos clientes",
    description: "Consulta online indispensável para novos clientes, com recolha de informações, dúvidas e plano personalizado.",
    duration: "1 hora · online via Zoom",
    image: "/services/original-first-consultation.webp",
    price: "69 €",
    productId: "first-consultation",
    requiresIntake: true,
    slug: "primeira-consulta-online",
    stripePriceEnv: "STRIPE_PRICE_FIRST_CONSULTATION",
    text: "Encontro inicial para compreender a sua situação e definir um plano personalizado.",
    title: "Primeira Consulta Online",
  },
  {
    amountCents: 15099,
    badge: "Pacote inicial",
    description: "Consulta inicial com restauração vibracional e limpeza energética completa.",
    duration: "Consulta + tratamento",
    image: "/services/original-energy-cleansing-initial.webp",
    price: "150,99 €",
    productId: "energy-cleansing-initial",
    requiresIntake: true,
    slug: "limpeza-energetica-espiritual-consulta",
    stripePriceEnv: "STRIPE_PRICE_ENERGY_CLEANSING_INITIAL",
    text: "Opção indicada para quem inicia o trabalho e precisa de avaliação antes da limpeza.",
    title: "Limpeza Energética Espiritual + Primeira Consulta",
  },
  {
    amountCents: 11499,
    badge: "Restauro",
    description: "Sessão à distância para limpeza de cargas, equilíbrio dos corpos sutis e restauração energética.",
    duration: "Sessão à distância",
    image: "/services/original-energy-cleansing.webp",
    price: "114,99 €",
    productId: "energy-cleansing",
    requiresIntake: true,
    slug: "limpeza-energetica-espiritual",
    stripePriceEnv: "STRIPE_PRICE_ENERGY_CLEANSING",
    text: "Restauração vibracional, limpeza de cargas e harmonização da aura.",
    title: "Limpeza Energética Espiritual",
  },
  {
    amountCents: 11499,
    badge: "Ambientes",
    description: "Atendimento à distância para harmonizar um ambiente e suavizar cargas densas.",
    duration: "1 ambiente",
    image: "/services/original-environment-harmonization.webp",
    price: "114,99 €",
    productId: "environment-harmonization",
    requiresIntake: true,
    slug: "harmonizacao-de-ambiente",
    stripePriceEnv: "STRIPE_PRICE_ENVIRONMENT_HARMONIZATION",
    text: "Limpeza e equilíbrio energético para residências ou espaços carregados.",
    title: "Harmonização de Ambiente",
  },
  {
    amountCents: 29400,
    badge: "Pacote",
    description: "Harmonização energética à distância para até três residências.",
    duration: "Até 3 residências",
    image: "/services/original-environment-harmonization.webp",
    price: "294 €",
    productId: "environment-harmonization-3-homes",
    requiresIntake: true,
    slug: "harmonizacao-de-ambientes-3-residencias",
    stripePriceEnv: "STRIPE_PRICE_ENVIRONMENT_HARMONIZATION_3_HOMES",
    text: "Pacote para até três residências ou espaços que precisam de equilíbrio.",
    title: "Harmonização de Ambientes · 3 Residências",
  },
  {
    amountCents: 10599,
    badge: "Orientação",
    description: "Sessão online para leitura de tarô e leitura de campo energético.",
    duration: "1 hora",
    image: "/services/original-tarot-field-reading.webp",
    price: "105,99 €",
    productId: "tarot-field-reading",
    requiresIntake: true,
    slug: "tarot-leitura-de-campo-1h",
    stripePriceEnv: "STRIPE_PRICE_TAROT_FIELD_READING",
    text: "Leitura para questões específicas com orientação espiritual online.",
    title: "Tarô e Leitura de Campo",
  },
  {
    amountCents: 19599,
    badge: "Estendida",
    description: "Formato ampliado para quem precisa de mais tempo de leitura e integração.",
    duration: "2 horas",
    image: "/services/original-tarot-field-reading.webp",
    price: "195,99 €",
    productId: "tarot-field-reading-2h",
    requiresIntake: true,
    slug: "tarot-leitura-de-campo-2h",
    stripePriceEnv: "STRIPE_PRICE_TAROT_FIELD_READING_2H",
    text: "Leitura estendida para perguntas mais profundas e campo energético.",
    title: "Tarô e Leitura de Campo · 2 horas",
  },
  {
    amountCents: 10590,
    badge: "Chakras",
    description: "Sessão à distância para harmonização, desbloqueio e restauração dos sete chakras principais.",
    duration: "À distância",
    image: "/services/original-chakra-restoration.webp",
    price: "105,90 €",
    productId: "chakra-unblocking",
    requiresIntake: true,
    slug: "desbloqueio-dos-7-chakras",
    stripePriceEnv: "STRIPE_PRICE_CHAKRA_UNBLOCKING",
    text: "Cuidado focado no equilíbrio dos centros energéticos.",
    title: "Desbloqueio dos 7 Chakras",
  },
  {
    amountCents: 26799,
    badge: "Apoio",
    description: "Tratamento à distância com primeira consulta, orientação e cuidado energético estruturado.",
    duration: "30 dias",
    image: "/services/original-depression-support.webp",
    price: "267,99 €",
    productId: "depression-support",
    requiresIntake: true,
    slug: "tratamento-para-depressao-consulta",
    stripePriceEnv: "STRIPE_PRICE_DEPRESSION_SUPPORT",
    text: "Apoio energético intensivo com consulta e acompanhamento inicial.",
    title: "Tratamento para Depressão + Consulta",
  },
  {
    amountCents: 69000,
    badge: "Contínuo",
    description: "Plano contínuo de três meses para suporte energético em processos emocionais prolongados.",
    duration: "3 meses contínuos",
    image: "/services/original-depression-support.webp",
    price: "690 €",
    productId: "depression-support-3-months",
    requiresIntake: true,
    slug: "tratamento-para-depressao-3-meses",
    stripePriceEnv: "STRIPE_PRICE_DEPRESSION_SUPPORT_3_MONTHS",
    text: "Acompanhamento energético contínuo durante três meses.",
    title: "Tratamento para Depressão · 3 meses",
  },
  {
    amountCents: 26799,
    badge: "Apoio",
    description: "Atendimento à distância com consulta inicial e plano de apoio energético para enxaqueca crônica.",
    duration: "30 dias",
    image: "/services/original-energy-cleansing.webp",
    price: "267,99 €",
    productId: "migraine-support",
    requiresIntake: true,
    slug: "tratamento-enxaqueca-cronica-consulta",
    stripePriceEnv: "STRIPE_PRICE_MIGRAINE_SUPPORT",
    text: "Apoio energético com consulta para casos de enxaqueca crônica.",
    title: "Tratamento Enxaqueca Crônica + Consulta",
  },
  {
    amountCents: 69000,
    badge: "Contínuo",
    description: "Plano de três meses para apoio energético contínuo em processos de enxaqueca crônica.",
    duration: "3 meses contínuos",
    image: "/services/original-energy-cleansing.webp",
    price: "690 €",
    productId: "migraine-support-3-months",
    requiresIntake: true,
    slug: "tratamento-enxaqueca-cronica-3-meses",
    stripePriceEnv: "STRIPE_PRICE_MIGRAINE_SUPPORT_3_MONTHS",
    text: "Acompanhamento energético contínuo para enxaqueca crônica.",
    title: "Tratamento Enxaqueca Crônica · 3 meses",
  },
  {
    amountCents: 15099,
    badge: "Transição",
    description: "Atendimento sensível para apoio espiritual e energético em momentos de fase terminal e transição.",
    duration: "Consulta + apoio",
    image: "/services/original-first-consultation.webp",
    price: "150,99 €",
    productId: "terminal-transition-support",
    requiresIntake: true,
    slug: "apoio-fase-terminal-transicao",
    stripePriceEnv: "STRIPE_PRICE_TERMINAL_TRANSITION_SUPPORT",
    text: "Acolhimento energético em processos delicados de transição.",
    title: "Apoio Fase Terminal e Transição + Consulta",
  },
  {
    amountCents: 11499,
    badge: "Cura guiada",
    description: "Sessão online de 1 hora. Recomenda-se sala privada, fones de ouvido, água em copo de vidro e, opcionalmente, Selenita branca e Turmalina negra.",
    duration: "1 hora",
    image: "/dani-profile-healing.webp",
    price: "114,99 €",
    productId: "guided-healing-movement",
    requiresIntake: true,
    slug: "movimento-de-cura-guiada",
    stripePriceEnv: "STRIPE_PRICE_GUIDED_HEALING_MOVEMENT",
    text: "Sessão guiada de cura energética com formulário obrigatório no checkout.",
    title: "Movimento de Cura Guiada com Equipe Seriana",
  },
  {
    amountCents: 10599,
    badge: "Clareza",
    description: "Atendimento à distância voltado para confusão mental, peso emocional e recentramento.",
    duration: "1 hora",
    image: "/services/original-tarot-field-reading.webp",
    price: "105,99 €",
    productId: "mental-relief",
    requiresIntake: true,
    slug: "alivio-mental-imediato",
    stripePriceEnv: "STRIPE_PRICE_MENTAL_RELIEF",
    text: "Sessão para clareza, leveza mental e organização energética.",
    title: "Alívio Mental Imediato e Confusão Mental",
  },
  {
    amountCents: 20499,
    badge: "Intensivo",
    description: "Atendimento intensivo de duas horas para processos densos, traumas, bloqueios e movimentos de libertação energética.",
    duration: "2 horas",
    image: "/services/original-trauma-intensive.webp",
    price: "204,99 €",
    productId: "trauma-intensive",
    requiresIntake: true,
    slug: "sessao-intensiva-traumas-bloqueios",
    stripePriceEnv: "STRIPE_PRICE_TRAUMA_INTENSIVE",
    text: "Sessão profunda para padrões, bloqueios emocionais e libertações.",
    title: "Sessão Intensiva: Traumas, Bloqueios, Banimentos e Libertações",
  },
  {
    amountCents: 55599,
    badge: "Pacote",
    description: "Pacote para acompanhamento mais profundo em três sessões intensivas de duas horas.",
    duration: "3 sessões · 2 horas cada",
    image: "/services/original-trauma-intensive.webp",
    price: "555,99 €",
    productId: "trauma-intensive-3",
    requiresIntake: true,
    slug: "tres-sessoes-intensivas-traumas-bloqueios",
    stripePriceEnv: "STRIPE_PRICE_TRAUMA_INTENSIVE_3",
    text: "Pacote de três sessões intensivas de duas horas.",
    title: "3 Sessões Intensivas: Traumas, Bloqueios e Libertações",
  },
  {
    amountCents: 99699,
    badge: "Acompanhamento",
    description: "Plano ampliado para processos extensos, com seis sessões intensivas de duas horas cada.",
    duration: "6 sessões · 2 horas cada",
    image: "/services/original-trauma-intensive.webp",
    price: "996,99 €",
    productId: "trauma-intensive-6",
    requiresIntake: true,
    slug: "seis-sessoes-intensivas-traumas-bloqueios",
    stripePriceEnv: "STRIPE_PRICE_TRAUMA_INTENSIVE_6",
    text: "Plano completo de seis sessões intensivas de duas horas.",
    title: "6 Sessões Intensivas: Traumas, Bloqueios e Libertações",
  },
];

function fallbackServices(locale: Locale): SiteService[] {
  if (locale === "pt") {
    return fallbackSessionSeed.map((service) => ({
      ...service,
      category: "session",
      currency: "EUR",
      requiresPolicyAcceptance: true,
    }));
  }

  return getContent(locale).services.items.map((service) => ({
    ...service,
    category: "session",
    currency: "EUR",
    description: service.text,
    requiresIntake: true,
    requiresPolicyAcceptance: true,
  }));
}

const courseIntros: Record<string, Record<Locale, string>> = {
  "online-course": {
    pt: "Curso de desenvolvimento da percepção sensorial por meio do Movimento Guiado de Energia, promovendo o despertar gradual da sensibilidade natural e da leitura sensorial de forma segura e consciente.",
    en: "A sensory perception development course through Guided Energetic Movement, gradually strengthening natural sensitivity and expanding the capacity for sensory reading.",
    es: "Curso de desarrollo de la percepción sensorial a través del Movimiento Guiado de Energía, fortaleciendo gradualmente la sensibilidad natural y ampliando la capacidad de lectura sensorial.",
    nl: "Cursus voor de ontwikkeling van zintuiglijke waarneming via Begeleide Energiebeweging, die de natuurlijke gevoeligheid geleidelijk versterkt en de capaciteit voor zintuiglijke waarneming uitbreidt.",
  },
  "online-course-en": {
    pt: "Curso de desenvolvimento da percepção sensorial através do Movimento Guiado de Energia, fortalecendo gradualmente a sensibilidade natural e ampliando a capacidade de leitura sensorial.",
    en: "A sensory perception development course through Guided Energetic Movement, gradually strengthening natural sensitivity and expanding the capacity for sensory reading.",
    es: "Curso en inglés para desarrollar la percepción sensorial, entrenar la lectura energética y practicar movimientos guiados de energía con seguridad y acompañamiento.",
    nl: "Engelstalige cursus om zintuiglijke waarneming te ontwikkelen, energetisch lezen te oefenen en begeleide energiebewegingen veilig te trainen.",
  },
};

const courseDurations: Record<string, Record<Locale, string>> = {
  "online-course": {
    pt: "6 semanas · início: 15/08/2026 · horário: 21h30 (horário de Amesterdão)",
    en: "6 weeks · starts: 15/08/2026 · time: 21:30 (Amsterdam time)",
    es: "6 semanas · inicio: 15/08/2026 · horario: 21:30 (hora de Ámsterdam)",
    nl: "6 weken · start: 15/08/2026 · tijd: 21:30 (Amsterdamse tijd)",
  },
  "online-course-en": {
    pt: "6 semanas · início: 21/11/2026 · horário: 21h30 (horário de Amesterdão)",
    en: "6 weeks · starts: 21/11/2026 · time: 21:30 (Amsterdam time)",
    es: "6 semanas · inicio: 21/11/2026 · horario: 21:30 (hora de Ámsterdam)",
    nl: "6 weken · start: 21/11/2026 · tijd: 21:30 (Amsterdamse tijd)",
  },
};

const fallbackCourseConfig = [
  {
    amountCents: 28500,
    badge: {
      pt: "Aulas em português",
      en: "Lessons in Portuguese",
      es: "Clases en portugués",
      nl: "Lessen in het Portugees",
    },
    image: "/services/original-course-sensory-activation.webp",
    price: "285 €",
    productId: "online-course",
    slug: "percepcao-sensorial-aulas-em-portugues",
    stripePriceEnv: "STRIPE_PRICE_ONLINE_COURSE",
    titles: courseTitles,
  },
  {
    amountCents: 38400,
    badge: {
      pt: "Aulas em inglês",
      en: "Lessons in English",
      es: "Clases en inglés",
      nl: "Lessen in het Engels",
    },
    image: "/services/course-sensory-perception-english.webp",
    price: "€384,00",
    productId: "online-course-en",
    slug: "sensory-perception-lessons-in-english",
    stripePriceEnv: "STRIPE_PRICE_ONLINE_COURSE_EN",
    titles: englishCourseTitles,
  },
] as const;

function fallbackCourses(locale: Locale): SiteService[] {
  return fallbackCourseConfig.map((course) => ({
    amountCents: course.amountCents,
    badge: course.badge[locale],
    category: "course",
    currency: "EUR",
    description: courseIntros[course.productId][locale],
    duration: courseDurations[course.productId][locale],
    image: course.image,
    price: course.price,
    productId: course.productId,
    requiresIntake: true,
    requiresPolicyAcceptance: true,
    slug: course.slug,
    stripePriceEnv: course.stripePriceEnv,
    text: courseIntros[course.productId][locale],
    title: course.titles[locale],
  }));
}

function fallbackCourseRows(): ServiceRow[] {
  return fallbackCourseConfig.map((course, index) => {
    const localised = (values: Record<Locale, string>) => ({
      en: values.en,
      es: values.es,
      nl: values.nl,
      pt: values.pt,
    });

    return {
      amount_cents: course.amountCents,
      badge: localised(course.badge),
      capacity_limit: null,
      category: "course",
      currency: "EUR",
      description: localised(courseIntros[course.productId]),
      duration: localised(courseDurations[course.productId]),
      id: `fallback-${course.productId}`,
      image_url: course.image,
      is_published: true,
      price_label: { en: course.price, es: course.price, nl: course.price, pt: course.price },
      product_id: course.productId,
      requires_intake: true,
      requires_policy_acceptance: true,
      seats_paid: 0,
      seats_reserved: 0,
      slug: course.slug,
      sort_order: index + 1,
      stripe_price_env: course.stripePriceEnv,
      summary: localised(courseIntros[course.productId]),
      title: localised(course.titles),
    };
  });
}

function mapSiteSection(row: SiteSectionRow, locale: Locale): SiteSection {
  return {
    body: localise(row.body, locale),
    description: localise(row.description, locale),
    eyebrow: localise(row.eyebrow, locale),
    imageAlt: localise(row.image_alt, locale),
    imageUrl: row.image_url || "",
    pageKey: row.page_key,
    primaryCtaHref: row.primary_cta_href || "",
    primaryCtaLabel: localise(row.primary_cta_label, locale),
    sectionKey: row.section_key,
    secondaryCtaHref: row.secondary_cta_href || "",
    secondaryCtaLabel: localise(row.secondary_cta_label, locale),
    title: localise(row.title, locale),
  };
}

export async function getPublishedSiteSections(
  pageKey: string,
  locale: Locale,
  fallbacks: SiteSection[],
): Promise<Record<string, SiteSection>> {
  const fallbackMap = Object.fromEntries(fallbacks.map((section) => [section.sectionKey, section]));
  const supabase = getSupabasePublicClient();
  if (!supabase) return fallbackMap;

  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .eq("page_key", pageKey)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackMap;

  for (const row of data as SiteSectionRow[]) {
    const mapped = mapSiteSection(row, locale);
    const fallback = fallbackMap[row.section_key];
    fallbackMap[row.section_key] = fallback
      ? {
          ...fallback,
          ...Object.fromEntries(
            Object.entries(mapped).filter(([, value]) => typeof value !== "string" || value.trim() !== ""),
          ),
        } as SiteSection
      : mapped;
  }

  return fallbackMap;
}

function fallbackIntakeFields(locale: Locale, productId?: string): IntakeField[] {
  const labels: Record<Locale, Record<string, string>> = {
    pt: {
      address: "Endereço",
      birth_date: "Data de nascimento",
      email: "E-mail",
      field_reading_preview: "Faça uma breve prévia da questão para a leitura de campo",
      full_name: "Nome completo",
      headphones_confirmed: "Confirmo que usarei fones de ouvido.",
      private_room_confirmed: "Confirmo que estarei numa sala privada durante a sessão.",
      service_goal: "O que deseja trabalhar ou resolver?",
      service_specific_information: "Informações específicas necessárias para o serviço escolhido",
      water_confirmed: "Confirmo que terei água em copo de vidro por perto.",
      whatsapp: "WhatsApp com código do país e DDD",
    },
    en: {
      address: "Address",
      birth_date: "Date of birth",
      email: "Email",
      field_reading_preview: "Briefly describe the question for the field reading",
      full_name: "Full name",
      headphones_confirmed: "I confirm I will use headphones.",
      private_room_confirmed: "I confirm I will be in a private room during the session.",
      service_goal: "What would you like to work on or resolve?",
      service_specific_information: "Specific information needed for the selected service",
      water_confirmed: "I confirm I will keep water in a glass nearby.",
      whatsapp: "WhatsApp with country code and area code",
    },
    es: {
      address: "Dirección",
      birth_date: "Fecha de nacimiento",
      email: "Correo electrónico",
      field_reading_preview: "Describa brevemente la cuestión para la lectura de campo",
      full_name: "Nombre completo",
      headphones_confirmed: "Confirmo que usaré auriculares.",
      private_room_confirmed: "Confirmo que estaré en una sala privada durante la sesión.",
      service_goal: "¿Qué desea trabajar o resolver?",
      service_specific_information: "Información específica necesaria para el servicio elegido",
      water_confirmed: "Confirmo que tendré agua en un vaso cerca.",
      whatsapp: "WhatsApp con código de país y prefijo regional",
    },
    nl: {
      address: "Adres",
      birth_date: "Geboortedatum",
      email: "E-mail",
      field_reading_preview: "Beschrijf kort de vraag voor de veldlezing",
      full_name: "Volledige naam",
      headphones_confirmed: "Ik bevestig dat ik een koptelefoon zal gebruiken.",
      private_room_confirmed: "Ik bevestig dat ik tijdens de sessie in een privekamer zal zijn.",
      service_goal: "Waar wilt u aan werken of wat wilt u oplossen?",
      service_specific_information: "Specifieke informatie die nodig is voor de gekozen dienst",
      water_confirmed: "Ik bevestig dat ik water in een glas bij me zal hebben.",
      whatsapp: "WhatsApp met landcode en netnummer",
    },
  };
  const source = labels[locale] || labels.pt;
  const commonFields: Array<[string, IntakeField["fieldType"]]> = [
    ["full_name", "text"],
    ["birth_date", "date"],
    ["whatsapp", "text"],
    ["address", "textarea"],
    ["email", "email"],
    ["service_goal", "textarea"],
    ["service_specific_information", "textarea"],
  ];
  const guidedHealingFields: Array<[string, IntakeField["fieldType"]]> = [
    ["private_room_confirmed", "checkbox"],
    ["headphones_confirmed", "checkbox"],
    ["water_confirmed", "checkbox"],
  ];
  const fieldReadingFields: Array<[string, IntakeField["fieldType"]]> = [
    ["field_reading_preview", "textarea"],
  ];

  const fields = productId === "guided-healing-movement"
    ? [...commonFields, ...guidedHealingFields]
    : productId?.startsWith("tarot-field-reading")
      ? [...commonFields, ...fieldReadingFields]
      : commonFields;

  const helpTexts: Record<Locale, Record<string, string>> = {
    pt: {
      whatsapp: "Informe o número completo. Exemplo: +31 6 16 01 84 67.",
    },
    en: {
      whatsapp: "Enter the full number. Example: +31 6 16 01 84 67.",
    },
    es: {
      whatsapp: "Indique el número completo. Ejemplo: +31 6 16 01 84 67.",
    },
    nl: {
      whatsapp: "Vul het volledige nummer in. Voorbeeld: +31 6 16 01 84 67.",
    },
  };
  const helpSource = helpTexts[locale] || helpTexts.pt;

  return adaptCourseIntakeFields(fields.map(([key, fieldType]) => ({
    fieldType: fieldType as IntakeField["fieldType"],
    helpText: helpSource[key] || "",
    key,
    label: source[key] || labels.pt[key] || key,
    options: [],
    required: true,
  })), locale, productId);
}

const courseIntakeLabels: Record<Locale, Record<string, string>> = {
  pt: {
    service_goal: "O que espera desenvolver ou aprender com este curso?",
    service_specific_information: "Existe alguma informação que considere importante partilhar antes de iniciar o curso?",
  },
  en: {
    service_goal: "What do you hope to develop or learn from this course?",
    service_specific_information: "Is there anything you consider important to share before starting the course?",
  },
  es: {
    service_goal: "¿Qué espera desarrollar o aprender con este curso?",
    service_specific_information: "¿Hay alguna información que considere importante compartir antes de comenzar el curso?",
  },
  nl: {
    service_goal: "Wat hoopt u met deze cursus te ontwikkelen of te leren?",
    service_specific_information: "Is er informatie die u belangrijk vindt om te delen voordat de cursus begint?",
  },
};

function adaptCourseIntakeFields(fields: IntakeField[], locale: Locale, productId?: string) {
  if (!productId?.startsWith("online-course")) return fields;

  const labels = courseIntakeLabels[locale] || courseIntakeLabels.pt;
  return fields.map((field) => labels[field.key] ? { ...field, label: labels[field.key] } : field);
}

function mapBlogPost(row: BlogRow, locale: Locale): SiteBlogPost {
  const fallbackPost = fallbackBlogPosts.find((post) => post.slug === row.slug);
  const fallbackText = fallbackPost?.excerpt || {
    pt: localise(row.excerpt, "pt"),
    en: localise(row.excerpt, "en"),
    es: localise(row.excerpt, "es"),
    nl: localise(row.excerpt, "nl"),
  };

  return {
    author: row.author,
    body: asLocaleRecord(row.body, fallbackText),
    date: row.published_at ? row.published_at.slice(0, 10) : "",
    excerpt: asLocaleRecord(row.excerpt, fallbackText),
    image: row.image_url || "/services/original-energy-cleansing.webp",
    readingTime: localise(row.reading_time, locale, "4 min"),
    slug: row.slug,
    title: asLocaleRecord(row.title, fallbackPost?.title || {
      pt: row.slug,
      en: row.slug,
      es: row.slug,
      nl: row.slug,
    }),
  };
}

export function isSupabaseConfigured() {
  return hasSupabasePublicConfig();
}

export async function getPublishedServices(locale: Locale): Promise<SiteService[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return fallbackServices(locale);

  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "session")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackServices(locale);
  }

  return (data as ServiceRow[]).map((row) => mapService(row, locale));
}

export async function getPublishedCourses(locale: Locale): Promise<SiteService[]> {
  const supabase = getSupabasePublicClient();
  const fallbackItems = fallbackCourses(locale);
  if (!supabase) return fallbackItems;

  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "course")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackItems;
  }

  const mapped = (data as ServiceRow[]).map((row) => {
    const course = mapService(row, locale);
    const fallback = fallbackItems.find((item) => item.productId === course.productId);
    const isLegacyCourse =
      course.productId === "online-course"
      && legacyCourseTitles.some((title) => course.title.toLocaleLowerCase(locale).includes(title));

    return isLegacyCourse && fallback
      ? {
          ...course,
          description: fallback.description,
          duration: fallback.duration,
          image: course.image || fallback.image,
          slug: fallback.slug,
          text: fallback.text,
          title: fallback.title,
        }
      : course;
  });
  const existingProductIds = new Set(mapped.map((course) => course.productId));
  return [
    ...mapped,
    ...fallbackItems.filter((course) => !existingProductIds.has(course.productId)),
  ].sort((left, right) => {
    const leftOrder = left.productId === "online-course" ? 1 : left.productId === "online-course-en" ? 2 : 99;
    const rightOrder = right.productId === "online-course" ? 1 : right.productId === "online-course-en" ? 2 : 99;
    return leftOrder - rightOrder;
  });
}

export async function getPublishedBlogPosts(locale: Locale): Promise<SiteBlogPost[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return fallbackBlogPosts.map((post) => ({
      ...post,
      body: post.excerpt,
    }));
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return fallbackBlogPosts.map((post) => ({
      ...post,
      body: post.excerpt,
    }));
  }

  return (data as BlogRow[]).map((row) => mapBlogPost(row, locale));
}

export async function getPublishedBlogPost(slug: string, locale: Locale): Promise<SiteBlogPost | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) {
    const post = fallbackBlogPosts.find((item) => item.slug === slug);
    return post ? { ...post, body: post.excerpt } : null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    const post = fallbackBlogPosts.find((item) => item.slug === slug);
    return post ? { ...post, body: post.excerpt } : null;
  }

  return mapBlogPost(data as BlogRow, locale);
}

export async function getCheckoutProduct(productId: string, locale: Locale): Promise<CheckoutProduct | null> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();

  if (supabase) {
    const { data } = await supabase
      .from("content_services")
      .select(
        "id, product_id, title, stripe_price_env, requires_intake, requires_policy_acceptance, capacity_limit, seats_reserved, amount_cents, currency",
      )
      .eq("product_id", productId)
      .eq("is_published", true)
      .maybeSingle();

    if (data) {
      const service = data as Pick<
        ServiceRow,
        | "capacity_limit"
        | "amount_cents"
        | "currency"
        | "id"
        | "product_id"
        | "requires_intake"
        | "requires_policy_acceptance"
        | "seats_reserved"
        | "stripe_price_env"
        | "title"
      >;
      const fields = adaptCourseIntakeFields(await getIntakeFields(service.id, locale), locale, service.product_id);
      const availableDates = service.product_id.startsWith("online-course") ? [] : await getAvailableDates(service.product_id);
      const dateField = appointmentDateField(availableDates, locale);
      const supplements = fallbackIntakeFields(locale, service.product_id).filter(
        (field) => field.key === "field_reading_preview" && !fields.some((current) => current.key === field.key),
      );

      return {
        availableDates,
        capacityLimit: service.capacity_limit ?? null,
        amountCents: service.amount_cents ?? null,
        currency: service.currency || "EUR",
        intakeFields: [...fields, ...supplements, ...(dateField ? [dateField] : [])],
        name: localise(service.title, locale, productId),
        productId: service.product_id,
        requiresIntake: service.requires_intake || availableDates.length > 0,
        requiresPolicyAcceptance: service.requires_policy_acceptance,
        remainingSeats:
          service.capacity_limit === null || service.capacity_limit === undefined
            ? null
            : Math.max(service.capacity_limit - (service.seats_reserved || 0), 0),
        seatsReserved: service.seats_reserved || 0,
        serviceId: service.id,
        stripePriceEnv: service.stripe_price_env || "",
      };
    }
  }

  const staticProduct = getProduct(productId);
  const fallbackProduct = [...fallbackServices(locale), ...fallbackCourses(locale)].find((service) => service.productId === productId);
  if (!staticProduct && !fallbackProduct) return null;

  return {
    availableDates: [],
    capacityLimit: fallbackProduct?.capacityLimit ?? null,
    amountCents: fallbackProduct?.amountCents ?? null,
    currency: fallbackProduct?.currency || "EUR",
    intakeFields: fallbackProduct?.requiresIntake ? fallbackIntakeFields(locale, productId) : [],
    name: fallbackProduct?.title || staticProduct?.name || productId,
    productId,
    requiresIntake: Boolean(fallbackProduct?.requiresIntake),
    requiresPolicyAcceptance: fallbackProduct?.requiresPolicyAcceptance ?? true,
    remainingSeats: fallbackProduct?.remainingSeats ?? null,
    seatsReserved: fallbackProduct?.seatsReserved || 0,
    stripePriceEnv: fallbackProduct?.stripePriceEnv || staticProduct?.stripePriceEnv || "",
  };
}

export async function getIntakeFields(serviceId: string, locale: Locale): Promise<IntakeField[]> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("service_intake_fields")
    .select("key, label, help_text, field_type, required, options, sort_order")
    .eq("service_id", serviceId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return (data as IntakeFieldRow[]).map((field) => ({
    fieldType: field.field_type,
    helpText: localise(field.help_text, locale),
    key: field.key,
    label: localise(field.label, locale, field.key),
    options: Array.isArray(field.options) ? field.options : [],
    required: field.required,
  }));
}

export async function getLegalDocument(key: string, locale: Locale): Promise<LegalDocument | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("legal_documents")
    .select("key, title, body, version")
    .eq("key", key)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as LegalRow;

  return {
    body: localise(row.body, locale),
    key: row.key,
    title: localise(row.title, locale),
    version: row.version,
  };
}

export async function saveCheckoutSubmission(input: {
  customerEmail?: string;
  customerName?: string;
  locale: Locale;
  payload: Record<string, unknown>;
  policyAccepted: boolean;
  productId: string;
  serviceId?: string;
  status: "created" | "checkout_started" | "manual_whatsapp";
  stripeCheckoutSessionId?: string;
}) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("checkout_intake_submissions")
    .insert({
      cancellation_policy_accepted_at: input.policyAccepted ? new Date().toISOString() : null,
      customer_email: input.customerEmail || null,
      customer_name: input.customerName || null,
      locale: input.locale,
      payload: input.payload,
      product_id: input.productId,
      service_id: input.serviceId || null,
      status: input.status,
      stripe_checkout_session_id: input.stripeCheckoutSessionId || null,
    })
    .select("id")
    .single();

  if (error) return null;
  return data as { id: string };
}

export async function markCheckoutSubmissionStarted(id: string, stripeCheckoutSessionId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase
    .from("checkout_intake_submissions")
    .update({
      status: "checkout_started",
      stripe_checkout_session_id: stripeCheckoutSessionId,
    })
    .eq("id", id);
}

export async function reserveCheckoutSeat(submissionId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { configured: false, ok: true };
  }

  const { data, error } = await supabase.rpc("reserve_checkout_seat", {
    target_submission_id: submissionId,
  });

  if (error) {
    const isMissingFunction = error.message?.includes("reserve_checkout_seat");
    return { configured: !isMissingFunction, error: error.message, ok: isMissingFunction };
  }

  const result = Array.isArray(data) ? data[0] : data;
  return {
    configured: true,
    ok: Boolean(result?.ok),
    remainingSeats: typeof result?.remaining === "number" ? result.remaining : null,
  };
}

export async function releaseCheckoutSeat(submissionId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase.rpc("release_checkout_seat", {
    target_submission_id: submissionId,
  });
}

export async function markCheckoutSubmissionPaid(id: string, stripeCheckoutSessionId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const { error } = await supabase.rpc("mark_checkout_submission_paid", {
    target_stripe_checkout_session_id: stripeCheckoutSessionId,
    target_submission_id: id,
  });

  if (error) {
    await supabase
      .from("checkout_intake_submissions")
      .update({
        status: "paid",
        stripe_checkout_session_id: stripeCheckoutSessionId,
      })
      .eq("id", id);
  }
}

const availabilityKey = (productId: string) => `availability:${productId}`;

function parseAvailableDates(value: unknown) {
  if (typeof value !== "string") return [];

  try {
    const dates = JSON.parse(value);
    if (!Array.isArray(dates)) return [];
    return dates
      .filter((date): date is string => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort();
  } catch {
    return [];
  }
}

async function getAvailableDates(productId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", availabilityKey(productId))
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  return parseAvailableDates(data?.value).filter((date) => date >= today);
}

const appointmentDateCopy: Record<Locale, { helpText: string; label: string }> = {
  pt: {
    helpText: "Escolha uma das datas disponibilizadas pela Dani para este atendimento.",
    label: "Data pretendida para o atendimento",
  },
  en: {
    helpText: "Choose one of the dates Dani has made available for this session.",
    label: "Preferred session date",
  },
  es: {
    helpText: "Elige una de las fechas que Dani ha habilitado para esta sesión.",
    label: "Fecha preferida para la sesión",
  },
  nl: {
    helpText: "Kies een van de data waarop Dani beschikbaar is voor deze sessie.",
    label: "Gewenste datum voor de sessie",
  },
};

const dateLocales: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-GB",
  es: "es-ES",
  nl: "nl-NL",
};

function appointmentDateField(dates: string[], locale: Locale): IntakeField | null {
  if (!dates.length) return null;

  return {
    fieldType: "select",
    helpText: appointmentDateCopy[locale].helpText,
    key: "appointment_date",
    label: appointmentDateCopy[locale].label,
    options: dates.map((date) => ({
      label: new Intl.DateTimeFormat(dateLocales[locale], { dateStyle: "long" }).format(new Date(`${date}T12:00:00Z`)),
      value: date,
    })),
    required: true,
  };
}

export async function getCheckoutReceipt(submissionId: string, stripeCheckoutSessionId: string): Promise<CheckoutReceipt | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data: submission, error } = await supabase
    .from("checkout_intake_submissions")
    .select("id, service_id, product_id, locale, customer_name, customer_email, payload, stripe_checkout_session_id")
    .eq("id", submissionId)
    .maybeSingle();

  if (error || !submission) return null;

  const locale = locales.includes(submission.locale as Locale) ? submission.locale as Locale : "pt";
  const { data: service } = await supabase
    .from("content_services")
    .select("product_id, title, duration, price_label, amount_cents, currency")
    .eq(submission.service_id ? "id" : "product_id", submission.service_id || submission.product_id)
    .maybeSingle();
  const translation = getServiceTranslation(submission.product_id, locale);

  return {
    customerEmail: submission.customer_email || "",
    customerName: submission.customer_name || "",
    duration: localise(service?.duration, locale, translation?.duration || ""),
    locale,
    payload: (submission.payload || {}) as Record<string, unknown>,
    price: formatPrice(
      service?.amount_cents,
      service?.currency,
      locale,
      localise(service?.price_label, locale, translation?.price || ""),
    ),
    productId: submission.product_id,
    productName: localise(service?.title, locale, translation?.title || submission.product_id),
    submissionId: submission.id,
    stripeCheckoutSessionId: submission.stripe_checkout_session_id || stripeCheckoutSessionId,
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !hasSupabaseAdminConfig()) {
    return {
      blogPosts: [],
      configured: false,
      courses: [],
      sections: [],
      services: [],
    };
  }

  const [services, courses, blog, sections, availability] = await Promise.all([
    supabase
      .from("content_services")
      .select("*")
      .eq("category", "session")
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_services")
      .select("*")
      .eq("category", "course")
      .order("sort_order", { ascending: true }),
    supabase
      .from("blog_posts")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_sections")
      .select("*")
      .order("page_key", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("admin_settings")
      .select("key, value")
      .like("key", "availability:%"),
  ]);

  const availabilityByProduct = new Map(
    (availability.data || []).map((row) => [
      String(row.key).replace(/^availability:/, ""),
      parseAvailableDates(row.value),
    ]),
  );

  const fallbackRows = fallbackCourseRows();
  const courseRows = ((courses.data || []) as ServiceRow[]).map((course) => {
    const fallback = fallbackRows.find((item) => item.product_id === course.product_id);
    if (!fallback) return course;

    const hasLegacyTitle = Object.values(course.title || {}).some((title) =>
      legacyCourseTitles.some((legacyTitle) => title.toLocaleLowerCase().includes(legacyTitle)),
    );
    const hasMissingTime = Object.values(course.duration || {}).some((duration) => !/21h30|21:30/.test(duration));

    return {
      ...course,
      duration: hasMissingTime ? fallback.duration : course.duration,
      image_url: course.product_id === "online-course-en" && !course.image_url ? fallback.image_url : course.image_url,
      slug: course.product_id === "online-course" && course.slug.includes("ativacao-sensorial") ? fallback.slug : course.slug,
      title: hasLegacyTitle ? fallback.title : course.title,
    };
  });
  const existingCourseIds = new Set(courseRows.map((course) => course.product_id));
  const mergedCourses = [
    ...courseRows,
    ...fallbackRows.filter((course) => !existingCourseIds.has(course.product_id)),
  ].sort((left, right) => left.sort_order - right.sort_order);

  const sectionAllowsMedia = (section: SiteSectionRow) =>
    (section.page_key === "home" && section.section_key === "hero")
    || (section.page_key === "home" && /^prompt-\d+$/.test(section.section_key))
    || (section.page_key === "home" && /^partner-\d+$/.test(section.section_key))
    || (section.page_key === "about" && section.section_key === "introduction");
  const sectionRows = mergeAdminSectionRows((sections.data || []) as SiteSectionRow[]);

  return {
    blogPosts: ((blog.data || []) as BlogRow[]),
    configured: !(services.error || courses.error || blog.error || availability.error),
    courses: mergedCourses,
    sections: sectionRows.map((section) => sectionAllowsMedia(section)
      ? section
      : { ...section, image_alt: null, image_url: null }),
    services: ((services.data || []) as ServiceRow[]).map((service) => ({
      ...service,
      available_dates: availabilityByProduct.get(service.product_id) || [],
    })),
  };
}

export function getLocalisedAdminValue(value: LocalisedValue, locale: Locale = "pt") {
  return localise(value, locale);
}

