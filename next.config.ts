import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const legacyLocales = [
  { prefix: "", locale: "pt" },
  { prefix: "/pt", locale: "pt" },
  { prefix: "/en", locale: "en" },
  { prefix: "/es", locale: "es" },
  { prefix: "/nl", locale: "nl" },
] as const;

const legacySectionRedirects = [
  { source: "book-online", destination: "sessoes" },
  { source: "category/all-products", destination: "sessoes" },
  { source: "curso-online", destination: "cursos" },
  { source: "sobre-o-curso", destination: "cursos" },
  { source: "políticas", destination: "termos-e-condicoes" },
  { source: "politicas", destination: "termos-e-condicoes" },
  { source: "serviços", destination: "sessoes" },
  { source: "servicos", destination: "sessoes" },
  { source: "serviços-1", destination: "sessoes" },
  { source: "servicos-1", destination: "sessoes" },
  { source: "sobre-mim", destination: "quem-somos" },
] as const;

const legacyServiceRedirects = [
  ["3-sessões-intensivo-traumas-e-bloqueios", "tres-sessoes-intensivas-traumas-bloqueios"],
  ["6-sessões-intensivo-traumas-e-bloqueios", "seis-sessoes-intensivas-traumas-bloqueios"],
  ["alívio-mental-imediato-confusão-mental", "alivio-mental-imediato"],
  ["apoio-fase-terminal-e-transição-cons", "apoio-fase-terminal-transicao"],
  ["cons-tarot-leitura-de-campo-1h", "tarot-leitura-de-campo-1h"],
  ["cons-tarot-leitura-de-campo-2h", "tarot-leitura-de-campo-2h"],
  ["harmonização-de-ambiente", "harmonizacao-de-ambiente"],
  ["harmonização-de-ambientes-3-residencias", "harmonizacao-de-ambientes-3-residencias"],
  ["limpeza-de-ambientes", "harmonizacao-de-ambiente"],
  ["limpeza-energética-de-frequência-pessoal", "limpeza-energetica-espiritual"],
  ["limpeza-energética-espiritual", "limpeza-energetica-espiritual"],
  ["limpeza-energética-espiritual-1ª-cons-1", "limpeza-energetica-espiritual-consulta"],
  ["limpeza-energética-pessoal-1ª-cons", "limpeza-energetica-espiritual-consulta"],
  ["pacote-limpeza-ambientes-3-residencias", "harmonizacao-de-ambientes-3-residencias"],
  ["primeira-consulta-online", "primeira-consulta-online"],
  ["restauração-integral-dos-chakras", "desbloqueio-dos-7-chakras"],
  ["sessão-cons-para-traumas-bloqueios-1", "sessao-intensiva-traumas-bloqueios"],
  ["sessão-intensiva-traumas-e-bloqueios-1", "sessao-intensiva-traumas-bloqueios"],
  ["tratamento-enxaqueca-crônica-1ª-cons", "tratamento-enxaqueca-cronica-consulta"],
  ["tratamento-enxaqueca-crônica-3-meses", "tratamento-enxaqueca-cronica-3-meses"],
  ["tratamento-para-depressão-1ª-cons", "tratamento-para-depressao-consulta"],
  ["tratamento-para-depressão-3-meses", "tratamento-para-depressao-3-meses"],
] as const;

function buildLegacyRedirects() {
  const sectionRedirects = legacyLocales.flatMap(({ prefix, locale }) =>
    legacySectionRedirects.map(({ source, destination }) => ({
      source: encodeURI(`${prefix}/${source}`),
      destination: `/${locale}/${destination}`,
      permanent: true,
    })),
  );

  const serviceRedirects = legacyLocales.flatMap(({ prefix, locale }) => [
    ...legacyServiceRedirects.map(([sourceSlug, destinationSlug]) => ({
      source: encodeURI(`${prefix}/service-page/${sourceSlug}`),
      destination: `/${locale}/sessoes/${destinationSlug}`,
      permanent: true,
    })),
    {
      source: `${prefix}/service-page/:path+`,
      destination: `/${locale}/sessoes`,
      permanent: true,
    },
    {
      source: `${prefix}/product-page/:path+`,
      destination: `/${locale}/sessoes`,
      permanent: true,
    },
  ]);

  return [
    {
      source: "/blog",
      destination: "/pt/blog",
      permanent: true,
    },
    ...sectionRedirects,
    ...serviceRedirects,
  ];
}

const nextConfig: NextConfig = {
  output: "standalone",
  redirects: buildLegacyRedirects,
  images: {
    remotePatterns: [
      {
        hostname: "aquijofpgzzvniavvfmq.supabase.co",
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
      {
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
