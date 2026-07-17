import type { Locale } from "./content";

const currencyLocales: Record<Locale, string> = {
  pt: "pt-PT",
  en: "en-IE",
  es: "es-ES",
  nl: "nl-NL",
};

export function formatPrice(
  amountCents: number | null | undefined,
  currency: string | null | undefined,
  locale: Locale,
  fallback = "",
) {
  if (typeof amountCents !== "number" || !Number.isFinite(amountCents)) return fallback;

  return new Intl.NumberFormat(currencyLocales[locale], {
    currency: currency || "EUR",
    currencyDisplay: "symbol",
    style: "currency",
  }).format(amountCents / 100);
}

export function moneyInputValue(amountCents: number | null | undefined) {
  if (typeof amountCents !== "number" || !Number.isFinite(amountCents)) return "";
  return (amountCents / 100).toFixed(2).replace(/\.00$/, "");
}

export function parseMoneyInput(value: string) {
  const compact = value.trim().replace(/\s/g, "");
  const normalised = compact.includes(",")
    ? compact.replace(/\./g, "").replace(",", ".")
    : compact;
  const amount = Number(normalised);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : null;
}
