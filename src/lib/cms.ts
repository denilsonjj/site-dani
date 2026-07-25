import { locales, type Locale } from "./content";
import { formatPrice } from "./currency";
import {
  bookingScheduleSettingKey,
  createDefaultBookingSchedule,
  getAppointmentSlots,
  getServiceDuration,
  parseBookingSchedule,
  type AppointmentSlot,
  type BookingSchedule,
} from "./scheduling";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  hasSupabaseAdminConfig,
  hasSupabasePublicConfig,
} from "./supabase/server";

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
  updated_at?: string;
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
  detail_intro?: LocalisedValue;
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
  subtitle?: LocalisedValue;
  summary: LocalisedValue;
  title: LocalisedValue;
  updated_at?: string;
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
  updated_at?: string;
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
  detailHeading?: string;
  detailIntro?: string;
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
  appointmentSlots: AppointmentSlot[];
  availableDates: string[];
  amountCents?: number | null;
  capacityLimit?: number | null;
  currency?: string;
  intakeFields: IntakeField[];
  name: string;
  productId: string;
  requiresIntake: boolean;
  requiresPolicyAcceptance: boolean;
  scheduleEnabled: boolean;
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
  bookingSchedule: BookingSchedule;
  configured: boolean;
  courses: ServiceRow[];
  sections: SiteSectionRow[];
  services: ServiceRow[];
};

function localiseStored(value: LocalisedValue | undefined, locale: Locale) {
  return value?.[locale] ?? "";
}

function asStoredLocaleRecord(value: LocalisedValue | undefined): Record<Locale, string> {
  return {
    pt: value?.pt ?? "",
    en: value?.en ?? "",
    es: value?.es ?? "",
    nl: value?.nl ?? "",
  };
}

function mapService(row: ServiceRow, locale: Locale): SiteService {
  return {
    amountCents: row.amount_cents ?? undefined,
    badge: localiseStored(row.badge, locale),
    capacityLimit: row.capacity_limit ?? null,
    category: row.category,
    currency: row.currency,
    description: localiseStored(row.description, locale),
    detailHeading: localiseStored(row.subtitle, locale),
    detailIntro: localiseStored(row.detail_intro, locale),
    duration: localiseStored(row.duration, locale),
    id: row.id,
    image: row.image_url || undefined,
    price: formatPrice(
      row.amount_cents,
      row.currency,
      locale,
      localiseStored(row.price_label, locale),
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
    slug: row.slug,
    stripePriceEnv: row.stripe_price_env || undefined,
    text: localiseStored(row.summary, locale),
    title: localiseStored(row.title, locale),
  };
}

function mapSiteSection(row: SiteSectionRow, locale: Locale): SiteSection {
  return {
    body: localiseStored(row.body, locale),
    description: localiseStored(row.description, locale),
    eyebrow: localiseStored(row.eyebrow, locale),
    imageAlt: localiseStored(row.image_alt, locale),
    imageUrl: row.image_url || "",
    pageKey: row.page_key,
    primaryCtaHref: row.primary_cta_href || "",
    primaryCtaLabel: localiseStored(row.primary_cta_label, locale),
    sectionKey: row.section_key,
    secondaryCtaHref: row.secondary_cta_href || "",
    secondaryCtaLabel: localiseStored(row.secondary_cta_label, locale),
    title: localiseStored(row.title, locale),
  };
}

export async function getPublishedSiteSections(
  pageKey: string,
  locale: Locale,
): Promise<Record<string, SiteSection>> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .eq("page_key", pageKey)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return {};
  return Object.fromEntries(
    (data as SiteSectionRow[]).map((row) => [row.section_key, mapSiteSection(row, locale)]),
  );
}

function mapBlogPost(row: BlogRow, locale: Locale): SiteBlogPost {
  return {
    author: row.author,
    body: asStoredLocaleRecord(row.body),
    date: row.published_at ? row.published_at.slice(0, 10) : "",
    excerpt: asStoredLocaleRecord(row.excerpt),
    image: row.image_url || "",
    readingTime: localiseStored(row.reading_time, locale),
    slug: row.slug,
    title: asStoredLocaleRecord(row.title),
  };
}

export function isSupabaseConfigured() {
  return hasSupabasePublicConfig();
}

export async function getPublishedServices(locale: Locale): Promise<SiteService[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "session")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as ServiceRow[]).map((row) => mapService(row, locale));
}

export async function getPublishedCourses(locale: Locale): Promise<SiteService[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("content_services")
    .select("*")
    .eq("category", "course")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as ServiceRow[]).map((row) => mapService(row, locale));
}

export async function getPublishedBlogPosts(locale: Locale): Promise<SiteBlogPost[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as BlogRow[]).map((row) => mapBlogPost(row, locale));
}

export async function getPublishedBlogPost(slug: string, locale: Locale): Promise<SiteBlogPost | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapBlogPost(data as BlogRow, locale);
}

export async function getCheckoutProduct(productId: string, locale: Locale, clientTimeZone?: string): Promise<CheckoutProduct | null> {
  const supabase = getSupabaseAdminClient() || getSupabasePublicClient();
  if (!supabase) return null;

  {
    const { data } = await supabase
      .from("content_services")
      .select(
        "id, product_id, title, stripe_price_env, requires_intake, requires_policy_acceptance, capacity_limit, seats_reserved, amount_cents, currency, is_published",
      )
      .eq("product_id", productId)
      .maybeSingle();

    if (data && !data.is_published) return null;
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
      const fields = await getIntakeFields(service.id, locale);
      const isCourse = service.product_id.startsWith("online-course");
      const availableDates = isCourse ? [] : await getAvailableDates(service.product_id);
      const schedule = isCourse ? createDefaultBookingSchedule() : await getBookingSchedule();
      const requiresAppointment = schedule.enabled && getServiceDuration(schedule, service.product_id) > 0;
      const appointmentSlots = requiresAppointment
        ? getAppointmentSlots({
            booked: await getBookedAppointments(),
            clientTimeZone,
            locale,
            productId: service.product_id,
            schedule,
          })
        : [];
      const dateField = requiresAppointment
        ? appointmentSlotField(appointmentSlots, locale, clientTimeZone)
        : appointmentDateField(availableDates, locale);

      return {
        appointmentSlots,
        availableDates,
        capacityLimit: service.capacity_limit ?? null,
        amountCents: service.amount_cents ?? null,
        currency: service.currency || "EUR",
        intakeFields: [...fields, ...(dateField ? [dateField] : [])],
        name: localiseStored(service.title, locale),
        productId: service.product_id,
        requiresIntake: service.requires_intake || availableDates.length > 0 || requiresAppointment,
        requiresPolicyAcceptance: service.requires_policy_acceptance,
        scheduleEnabled: requiresAppointment,
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

  return null;
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
    helpText: localiseStored(field.help_text, locale),
    key: field.key,
    label: localiseStored(field.label, locale),
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
    body: localiseStored(row.body, locale),
    key: row.key,
    title: localiseStored(row.title, locale),
    version: row.version,
  };
}

export async function saveCheckoutSubmission(input: {
  appointmentEnd?: string;
  appointmentStart?: string;
  customerTimeZone?: string;
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
  if (!supabase) return { appointmentConflict: false, error: "Supabase não configurado.", id: null };

  const submissionRow = {
    appointment_end: input.appointmentEnd || null,
    appointment_start: input.appointmentStart || null,
    cancellation_policy_accepted_at: input.policyAccepted ? new Date().toISOString() : null,
    customer_email: input.customerEmail || null,
    customer_name: input.customerName || null,
    customer_time_zone: input.customerTimeZone || null,
    locale: input.locale,
    payload: input.payload,
    product_id: input.productId,
    service_id: input.serviceId || null,
    status: input.status,
    stripe_checkout_session_id: input.stripeCheckoutSessionId || null,
  };
  let { data, error } = await supabase
    .from("checkout_intake_submissions")
    .insert(submissionRow)
    .select("id")
    .single();

  if (error?.code === "PGRST204" && !input.appointmentStart) {
    const legacyRow: Record<string, unknown> = { ...submissionRow };
    delete legacyRow.appointment_end;
    delete legacyRow.appointment_start;
    delete legacyRow.customer_time_zone;
    const legacyResult = await supabase
      .from("checkout_intake_submissions")
      .insert(legacyRow)
      .select("id")
      .single();
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error || !data) {
    return {
      appointmentConflict: error?.code === "23P01" || error?.code === "23505",
      error: error?.message || "A submissão não foi guardada.",
      id: null,
    };
  }
  return { appointmentConflict: false, error: null, id: String(data.id) };
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

  await supabase
    .from("checkout_intake_submissions")
    .update({ status: "cancelled" })
    .eq("id", submissionId)
    .neq("status", "paid");
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

export async function getBookingSchedule() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return createDefaultBookingSchedule();

  const { data } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", bookingScheduleSettingKey)
    .maybeSingle();

  return parseBookingSchedule(data?.value);
}

async function getBookedAppointments() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("checkout_intake_submissions")
    .select("appointment_start, appointment_end")
    .in("status", ["created", "checkout_started", "paid"])
    .not("appointment_start", "is", null)
    .not("appointment_end", "is", null);

  if (error || !data) return [];
  return data.flatMap((row) => row.appointment_start && row.appointment_end
    ? [{ end: String(row.appointment_end), start: String(row.appointment_start) }]
    : []);
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

const appointmentSlotCopy: Record<Locale, { helpText: (timeZone: string) => string; label: string }> = {
  pt: {
    helpText: (timeZone) => `Os horários são apresentados automaticamente no seu fuso: ${timeZone}.`,
    label: "Data e horário do atendimento",
  },
  en: {
    helpText: (timeZone) => `Times are automatically shown in your time zone: ${timeZone}.`,
    label: "Session date and time",
  },
  es: {
    helpText: (timeZone) => `Los horarios se muestran automáticamente en tu zona horaria: ${timeZone}.`,
    label: "Fecha y hora de la sesión",
  },
  nl: {
    helpText: (timeZone) => `De tijden worden automatisch weergegeven in jouw tijdzone: ${timeZone}.`,
    label: "Datum en tijd van de sessie",
  },
};

function appointmentSlotField(slots: AppointmentSlot[], locale: Locale, clientTimeZone?: string): IntakeField | null {
  if (!slots.length) return null;
  const timeZone = clientTimeZone || "Europe/Amsterdam";
  return {
    fieldType: "select",
    helpText: appointmentSlotCopy[locale].helpText(timeZone),
    key: "appointment_start",
    label: appointmentSlotCopy[locale].label,
    options: slots.map((slot) => ({ label: slot.label, value: slot.start })),
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
  if (!service) return null;
  const duration = localiseStored(service.duration, locale);
  const priceLabel = localiseStored(service.price_label, locale);
  const productName = localiseStored(service.title, locale);

  return {
    customerEmail: submission.customer_email || "",
    customerName: submission.customer_name || "",
    duration,
    locale,
    payload: (submission.payload || {}) as Record<string, unknown>,
    price: formatPrice(
      service?.amount_cents,
      service?.currency,
      locale,
      priceLabel,
    ),
    productId: submission.product_id,
    productName,
    submissionId: submission.id,
    stripeCheckoutSessionId: submission.stripe_checkout_session_id || stripeCheckoutSessionId,
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = getSupabaseAdminClient();
  if (!supabase || !hasSupabaseAdminConfig()) {
    return {
      blogPosts: [],
      bookingSchedule: createDefaultBookingSchedule(),
      configured: false,
      courses: [],
      sections: [],
      services: [],
    };
  }

  const [services, courses, blog, sections, availability, bookingSchedule] = await Promise.all([
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
    supabase
      .from("admin_settings")
      .select("value, updated_at")
      .eq("key", bookingScheduleSettingKey)
      .maybeSingle(),
  ]);

  const availabilityByProduct = new Map(
    (availability.data || []).map((row) => [
      String(row.key).replace(/^availability:/, ""),
      parseAvailableDates(row.value),
    ]),
  );

  const courseRows = (courses.data || []) as ServiceRow[];

  const sectionAllowsMedia = (section: SiteSectionRow) =>
    (section.page_key === "home" && section.section_key === "hero")
    || (section.page_key === "home" && section.section_key === "course")
    || (section.page_key === "home" && /^prompt-\d+$/.test(section.section_key))
    || (section.page_key === "home" && /^partner-\d+$/.test(section.section_key))
    || (section.page_key === "about" && section.section_key === "introduction");
  const sectionRows = (sections.data || []) as SiteSectionRow[];

  return {
    blogPosts: ((blog.data || []) as BlogRow[]),
    bookingSchedule: { ...parseBookingSchedule(bookingSchedule.data?.value), updatedAt: bookingSchedule.data?.updated_at },
    configured: !(services.error || courses.error || blog.error || availability.error),
    courses: courseRows,
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
  return localiseStored(value, locale);
}

