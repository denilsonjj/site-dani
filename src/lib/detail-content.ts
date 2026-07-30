import type { SiteService } from "./cms";
import type { Locale } from "./content";

export const detailPageCopy = {
  pt: {
    backCourse: "Voltar aos cursos",
    backSession: "Voltar às sessões",
    courseEyebrow: "Curso online",
    sessionEyebrow: "Sessão terapêutica",
    practicalTitle: "Informações práticas",
    duration: "Duração",
    serviceInvestment: "Valor",
    courseInvestment: "Investimento",
    detailsAction: "Ver detalhes",
  },
  en: {
    backCourse: "Back to courses",
    backSession: "Back to sessions",
    courseEyebrow: "Online course",
    sessionEyebrow: "Therapeutic session",
    practicalTitle: "Practical information",
    duration: "Duration",
    serviceInvestment: "Value",
    courseInvestment: "Investment",
    detailsAction: "View details",
  },
  es: {
    backCourse: "Volver a los cursos",
    backSession: "Volver a las sesiones",
    courseEyebrow: "Curso online",
    sessionEyebrow: "Sesión terapéutica",
    practicalTitle: "Información práctica",
    duration: "Duración",
    serviceInvestment: "Valor",
    courseInvestment: "Inversión",
    detailsAction: "Ver detalles",
  },
  nl: {
    backCourse: "Terug naar cursussen",
    backSession: "Terug naar sessies",
    courseEyebrow: "Online cursus",
    sessionEyebrow: "Therapeutische sessie",
    practicalTitle: "Praktische informatie",
    duration: "Duur",
    serviceInvestment: "Prijs",
    courseInvestment: "Investering",
    detailsAction: "Bekijk details",
  },
} satisfies Record<Locale, Record<string, string>>;

function splitDescription(value: string) {
  return value
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function getDetailParagraphs(service: SiteService) {
  const paragraphs = splitDescription(service.description || service.text);
  const intro = service.detailIntro?.trim();
  if (!intro) return paragraphs;

  const normalise = (value: string) => value.replace(/\s+/g, " ").trim();
  return normalise(paragraphs[0] || "") === normalise(intro) ? paragraphs : [intro, ...paragraphs];
}
