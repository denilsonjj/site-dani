const locales = ["pt", "en", "es", "nl"] as const;

export function findMissingTranslations(
  values: Record<string, Partial<Record<(typeof locales)[number], string>> | undefined>,
) {
  const missing: string[] = [];

  for (const [field, value] of Object.entries(values)) {
    const isUsed = locales.some((locale) => value?.[locale]?.trim());
    if (!isUsed) continue;

    for (const locale of locales) {
      if (!value?.[locale]?.trim()) missing.push(`${field}.${locale}`);
    }
  }

  return missing;
}
