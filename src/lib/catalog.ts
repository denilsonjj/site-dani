export const productCatalog = {
  "first-consultation": {
    name: "Primeira Consulta Online",
    stripePriceEnv: "STRIPE_PRICE_FIRST_CONSULTATION",
  },
  "energy-cleansing": {
    name: "Limpeza Energética & Espiritual",
    stripePriceEnv: "STRIPE_PRICE_ENERGY_CLEANSING",
  },
  "energy-cleansing-initial": {
    name: "Limpeza Energética & Espiritual + 1ª Consulta",
    stripePriceEnv: "STRIPE_PRICE_ENERGY_CLEANSING_INITIAL",
  },
  "tarot-field-reading": {
    name: "Tarô & Leitura de Campo 1h",
    stripePriceEnv: "STRIPE_PRICE_TAROT_FIELD_READING",
  },
  "chakra-restoration": {
    name: "Restauração Integral dos Chakras",
    stripePriceEnv: "STRIPE_PRICE_CHAKRA_RESTORATION",
  },
  "trauma-intensive": {
    name: "Sessão Intensiva: Traumas e Bloqueios",
    stripePriceEnv: "STRIPE_PRICE_TRAUMA_INTENSIVE",
  },
  "depression-support": {
    name: "Tratamento para Depressão",
    stripePriceEnv: "STRIPE_PRICE_DEPRESSION_SUPPORT",
  },
  "environment-harmonization": {
    name: "Harmonização de Ambientes",
    stripePriceEnv: "STRIPE_PRICE_ENVIRONMENT_HARMONIZATION",
  },
  "guided-healing-movement": {
    name: "Movimento de Cura Guiada com Equipe Seriana",
    stripePriceEnv: "STRIPE_PRICE_GUIDED_HEALING_MOVEMENT",
  },
  "online-course": {
    name: "Movimento de Cura Guiada com Equipe Seriana",
    stripePriceEnv: "STRIPE_PRICE_ONLINE_COURSE",
  },
} as const;

export type ProductId = keyof typeof productCatalog;

export function getProduct(productId: string) {
  if (productId in productCatalog) {
    return productCatalog[productId as ProductId];
  }

  return null;
}
