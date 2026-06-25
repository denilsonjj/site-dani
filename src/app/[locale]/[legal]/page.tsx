import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, locales, type Locale } from "@/lib/content";

const legalPages = {
  "politica-de-cookies": "cookies",
  "termos-e-condicoes": "terms",
  "politica-de-privacidade": "privacy",
} as const;

const legalSections = {
  cookies: [
    "Uso de cookies essenciais para funcionamento e segurança do site.",
    "Cookies de análise poderão ser ativados apenas quando a ferramenta oficial for definida.",
    "O visitante poderá rever preferências quando o banner de consentimento for ligado.",
  ],
  privacy: [
    "Dados de contacto serão usados apenas para responder pedidos, inscrições e marcações.",
    "Dados de pagamento serão processados pelo Stripe quando a integração oficial estiver ativa.",
    "Pedidos de acesso, correção ou remoção poderão ser enviados diretamente à Dani Therapies.",
  ],
  terms: [
    "Sessões e cursos online dependem de confirmação de disponibilidade e pagamento.",
    "Cancelamentos, remarcações e transferências serão descritos na versão jurídica final.",
    "As sessões não substituem acompanhamento médico, psicológico ou emergência.",
  ],
} as const;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.keys(legalPages).map((legal) => ({ legal, locale })),
  );
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ legal: string; locale: string }>;
}) {
  const { legal, locale: rawLocale } = await params;

  if (!locales.includes(rawLocale as Locale) || !(legal in legalPages)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const copy = getContent(locale);
  const key = legalPages[legal as keyof typeof legalPages];
  const title = copy.footer.legal[key];

  return (
    <main className="min-h-screen bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <article className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-12">
        <Link className="text-sm font-bold text-[#547461]" href={`/${locale}`}>
          ← Dani Therapies
        </Link>
        <h1 className="display mt-10 text-4xl font-semibold sm:text-6xl">{title}</h1>
        <p className="mt-6 leading-8 text-[#52675e]">
          Este documento está em validação para a nova versão do site. Até à
          publicação final, as condições oficiais devem ser confirmadas
          diretamente com Dani Therapies.
        </p>
        <div className="mt-8 grid gap-4">
          {legalSections[key].map((section) => (
            <div className="rounded-2xl bg-[#f8f5ec] p-5 leading-7 text-[#40564d]" key={section}>
              {section}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm font-bold text-[#547461]">{copy.footer.legal.kvk}</p>
      </article>
    </main>
  );
}
