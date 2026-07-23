export const locales = ["pt", "en", "es", "nl"] as const;
export type Locale = (typeof locales)[number];

export const localeOptions: Record<Locale, { flag: string; short: string; label: string }> = {
  pt: { flag: "/flag-pt.svg", short: "PT", label: "Português" },
  en: { flag: "/flag-en.svg", short: "EN", label: "English" },
  es: { flag: "/flag-es.svg", short: "ES", label: "Español" },
  nl: { flag: "/flag-nl.svg", short: "NL", label: "Nederlands" },
};

const content = {
  pt: {
    nav: { about: "Quem Somos", services: "Sessões", courses: "Cursos", partners: "Parceiros", blog: "Blog", contact: "Contato", book: "Agendar consulta" },
    services: { action: "Reservar / pagar", detailsLabel: "Ver detalhes" },
    course: { cta: "Quero inscrever-me" },
    coursePreview: { allLabel: "Ver cursos", detailsLabel: "Conhecer o curso" },
    contact: {
      name: "Seu nome",
      email: "Seu e-mail",
      message: "Como podemos ajudar?",
      submit: "Enviar pelo WhatsApp",
      privacy: "Os seus dados não serão armazenados neste primeiro contacto.",
    },
    footer: {
      text: "Cuidado energético e espiritual com presença, respeito e acolhimento.",
      rights: "Todos os direitos reservados.",
      disclaimer: "As sessões oferecidas não substituem acompanhamento médico, psicológico ou emergencial.",
      legal: { cookies: "Política de Cookies", terms: "Termos e Condições", privacy: "Política de Privacidade", kvk: "KVK- 94756279" },
    },
    whatsapp: "Falar pelo WhatsApp",
  },
  en: {
    nav: { about: "About Us", services: "Sessions", courses: "Courses", partners: "Partners", blog: "Blog", contact: "Contact", book: "Book a consultation" },
    services: { action: "Book / pay", detailsLabel: "View details" },
    course: { cta: "I want to enrol" },
    coursePreview: { allLabel: "View courses", detailsLabel: "Explore the course" },
    contact: {
      name: "Your name",
      email: "Your email",
      message: "How can we help?",
      submit: "Send via WhatsApp",
      privacy: "Your details will not be stored during this initial contact.",
    },
    footer: {
      text: "Energetic and spiritual care with presence, respect and a welcoming approach.",
      rights: "All rights reserved.",
      disclaimer: "The sessions offered do not replace medical, psychological or emergency care.",
      legal: { cookies: "Cookie Policy", terms: "Terms and Conditions", privacy: "Privacy Policy", kvk: "KVK- 94756279" },
    },
    whatsapp: "Chat on WhatsApp",
  },
  es: {
    nav: { about: "Quiénes somos", services: "Sesiones", courses: "Cursos", partners: "Socios", blog: "Blog", contact: "Contacto", book: "Reservar consulta" },
    services: { action: "Reservar / pagar", detailsLabel: "Ver detalles" },
    course: { cta: "Quiero inscribirme" },
    coursePreview: { allLabel: "Ver cursos", detailsLabel: "Conocer el curso" },
    contact: {
      name: "Tu nombre",
      email: "Tu email",
      message: "¿Cómo podemos ayudarte?",
      submit: "Enviar por WhatsApp",
      privacy: "Tus datos no serán almacenados en este primer contacto.",
    },
    footer: {
      text: "Cuidado energético y espiritual con presencia, respeto y acogida.",
      rights: "Todos los derechos reservados.",
      disclaimer: "Las sesiones ofrecidas no sustituyen la atención médica, psicológica o de emergencia.",
      legal: { cookies: "Política de Cookies", terms: "Términos y Condiciones", privacy: "Política de Privacidad", kvk: "KVK- 94756279" },
    },
    whatsapp: "Hablar por WhatsApp",
  },
  nl: {
    nav: { about: "Over ons", services: "Sessies", courses: "Cursussen", partners: "Partners", blog: "Blog", contact: "Contact", book: "Consult boeken" },
    services: { action: "Boeken / betalen", detailsLabel: "Bekijk details" },
    course: { cta: "Ik wil me inschrijven" },
    coursePreview: { allLabel: "Bekijk cursussen", detailsLabel: "Ontdek de cursus" },
    contact: {
      name: "Je naam",
      email: "Je e-mail",
      message: "Hoe kunnen we helpen?",
      submit: "Verstuur via WhatsApp",
      privacy: "Je gegevens worden tijdens dit eerste contact niet opgeslagen.",
    },
    footer: {
      text: "Energetische en spirituele begeleiding met aandacht, respect en warmte.",
      rights: "Alle rechten voorbehouden.",
      disclaimer: "De aangeboden sessies vervangen geen medische, psychologische of spoedeisende zorg.",
      legal: { cookies: "Cookiebeleid", terms: "Algemene voorwaarden", privacy: "Privacybeleid", kvk: "KVK- 94756279" },
    },
    whatsapp: "Praat via WhatsApp",
  },
} as const;

export function getContent(locale: Locale) {
  return content[locale];
}
