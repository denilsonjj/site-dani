import { blogPosts as fallbackBlogPosts } from "./blog";
import { getProduct } from "./catalog";
import { getContent, type Locale } from "./content";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  hasSupabaseAdminConfig,
  hasSupabasePublicConfig,
} from "./supabase/server";

type LocalisedValue = Record<string, string> | null;

export type ServiceRow = {
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
  capacityLimit?: number | null;
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
  services: ServiceRow[];
};

function localise(value: LocalisedValue | undefined, locale: Locale, fallback = "") {
  if (!value) return fallback;
  return value[locale] || value.pt || value.en || value.es || value.nl || fallback;
}

function asLocaleRecord(value: LocalisedValue | undefined, fallback: Record<Locale, string>): Record<Locale, string> {
  return {
    pt: value?.pt || fallback.pt,
    en: value?.en || value?.pt || fallback.en,
    es: value?.es || value?.pt || fallback.es,
    nl: value?.nl || value?.pt || fallback.nl,
  };
}

function mapService(row: ServiceRow, locale: Locale): SiteService {
  return {
    amountCents: row.amount_cents ?? undefined,
    badge: localise(row.badge, locale),
    capacityLimit: row.capacity_limit ?? null,
    category: row.category,
    currency: row.currency,
    description: localise(row.description, locale),
    duration: localise(row.duration, locale),
    id: row.id,
    image: row.image_url || undefined,
    price: localise(row.price_label, locale),
    productId: row.product_id,
    requiresIntake: row.requires_intake,
    requiresPolicyAcceptance: row.requires_policy_acceptance,
    remainingSeats:
      row.capacity_limit === null || row.capacity_limit === undefined
        ? null
        : Math.max(row.capacity_limit - (row.seats_reserved || 0), 0),
    seatsPaid: row.seats_paid || 0,
    seatsReserved: row.seats_reserved || 0,
    slug: row.slug,
    stripePriceEnv: row.stripe_price_env || undefined,
    text: localise(row.summary, locale),
    title: localise(row.title, locale),
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
    duration: "15 dias",
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
    duration: "15 dias",
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

function fallbackCourse(locale: Locale): SiteService {
  const copy = getContent(locale).course;

  return {
    amountCents: 11499,
    badge: "Cura guiada",
    category: "course",
    currency: "EUR",
    description:
      "Movimento vibracional guiado pela Equipe Seriana para libertação de amarras emocionais e energéticas, fortalecimento pessoal e reconexão interior.",
    duration: "1 hora · online via Zoom",
    image: "/dani-profile-healing.webp",
    price: "114,99 €",
    productId: "guided-healing-movement",
    requiresIntake: true,
    requiresPolicyAcceptance: true,
    slug: "movimento-de-cura-guiada",
    stripePriceEnv: "STRIPE_PRICE_GUIDED_HEALING_MOVEMENT",
    text: copy.intro,
    title: "Movimento de Cura Guiada com Equipe Seriana",
  };
}

function fallbackIntakeFields(locale: Locale, productId?: string): IntakeField[] {
  const labels: Record<Locale, Record<string, string>> = {
    pt: {
      address: "Endereço",
      birth_date: "Data de nascimento",
      email: "E-mail",
      full_name: "Nome completo",
      headphones_confirmed: "Confirmo que usarei fones de ouvido.",
      private_room_confirmed: "Confirmo que estarei numa sala privada durante a sessão.",
      service_goal: "O que deseja trabalhar ou resolver?",
      service_specific_information: "Informações específicas necessárias para o serviço escolhido",
      water_confirmed: "Confirmo que terei água em copo de vidro por perto.",
      whatsapp: "WhatsApp",
    },
    en: {
      address: "Address",
      birth_date: "Date of birth",
      email: "Email",
      full_name: "Full name",
      headphones_confirmed: "I confirm I will use headphones.",
      private_room_confirmed: "I confirm I will be in a private room during the session.",
      service_goal: "What would you like to work on or resolve?",
      service_specific_information: "Specific information needed for the selected service",
      water_confirmed: "I confirm I will keep water in a glass nearby.",
      whatsapp: "WhatsApp",
    },
    es: {
      address: "Dirección",
      birth_date: "Fecha de nacimiento",
      email: "Correo electrónico",
      full_name: "Nombre completo",
      headphones_confirmed: "Confirmo que usaré auriculares.",
      private_room_confirmed: "Confirmo que estaré en una sala privada durante la sesión.",
      service_goal: "¿Qué desea trabajar o resolver?",
      service_specific_information: "Información específica necesaria para el servicio elegido",
      water_confirmed: "Confirmo que tendré agua en un vaso cerca.",
      whatsapp: "WhatsApp",
    },
    nl: {
      address: "Adres",
      birth_date: "Geboortedatum",
      email: "E-mail",
      full_name: "Volledige naam",
      headphones_confirmed: "Ik bevestig dat ik een koptelefoon zal gebruiken.",
      private_room_confirmed: "Ik bevestig dat ik tijdens de sessie in een privekamer zal zijn.",
      service_goal: "Waar wilt u aan werken of wat wilt u oplossen?",
      service_specific_information: "Specifieke informatie die nodig is voor de gekozen dienst",
      water_confirmed: "Ik bevestig dat ik water in een glas bij me zal hebben.",
      whatsapp: "WhatsApp",
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

  const fields =
    productId === "guided-healing-movement" ? [...commonFields, ...guidedHealingFields] : commonFields;

  return fields.map(([key, fieldType]) => ({
    fieldType: fieldType as IntakeField["fieldType"],
    helpText: "",
    key,
    label: source[key] || labels.pt[key] || key,
    options: [],
    required: true,
  }));
}

function mapBlogPost(row: BlogRow, locale: Locale): SiteBlogPost {
  const fallbackText = {
    pt: localise(row.excerpt, locale),
    en: localise(row.excerpt, locale),
    es: localise(row.excerpt, locale),
    nl: localise(row.excerpt, locale),
  };

  return {
    author: row.author,
    body: asLocaleRecord(row.body, fallbackText),
    date: row.published_at ? row.published_at.slice(0, 10) : "",
    excerpt: asLocaleRecord(row.excerpt, fallbackText),
    image: row.image_url || "/services/original-energy-cleansing.webp",
    readingTime: localise(row.reading_time, locale, "4 min"),
    slug: row.slug,
    title: asLocaleRecord(row.title, {
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
  if (!supabase) return [fallbackCourse(locale)];

  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "course")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return [fallbackCourse(locale)];
  }

  return (data as ServiceRow[]).map((row) => mapService(row, locale));
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
        "id, product_id, title, stripe_price_env, requires_intake, requires_policy_acceptance, capacity_limit, seats_reserved",
      )
      .eq("product_id", productId)
      .eq("is_published", true)
      .maybeSingle();

    if (data) {
      const service = data as Pick<
        ServiceRow,
        | "capacity_limit"
        | "id"
        | "product_id"
        | "requires_intake"
        | "requires_policy_acceptance"
        | "seats_reserved"
        | "stripe_price_env"
        | "title"
      >;
      const fields = await getIntakeFields(service.id, locale);

      return {
        capacityLimit: service.capacity_limit ?? null,
        intakeFields: fields,
        name: localise(service.title, locale, productId),
        productId: service.product_id,
        requiresIntake: service.requires_intake,
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
  const fallbackProduct = fallbackServices(locale).find((service) => service.productId === productId);
  if (!staticProduct && !fallbackProduct) return null;

  return {
    capacityLimit: fallbackProduct?.capacityLimit ?? null,
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

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !hasSupabaseAdminConfig()) {
    return {
      blogPosts: [],
      configured: false,
      courses: [],
      services: [],
    };
  }

  const [services, courses, blog] = await Promise.all([
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
  ]);

  return {
    blogPosts: ((blog.data || []) as BlogRow[]),
    configured: !(services.error || courses.error || blog.error),
    courses: ((courses.data || []) as ServiceRow[]),
    services: ((services.data || []) as ServiceRow[]),
  };
}

export function getLocalisedAdminValue(value: LocalisedValue, locale: Locale = "pt") {
  return localise(value, locale);
}

