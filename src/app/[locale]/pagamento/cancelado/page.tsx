import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { locales, type Locale } from "@/lib/content";

export default async function PaymentCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!locales.includes(rawLocale as Locale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f5ec] px-5 py-16 text-[#123c2d]">
      <section className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-[0_25px_80px_rgba(10,43,31,0.12)] sm:p-12">
        <ArrowLeft className="mx-auto text-[#d8bd82]" size={46} strokeWidth={1.5} />
        <h1 className="display mt-8 text-4xl font-semibold">Pagamento não concluído</h1>
        <p className="mt-5 leading-7 text-[#52675e]">
          A compra não foi finalizada. Pode voltar ao site e tentar novamente
          ou conversar com a Dani Therapies pelo WhatsApp.
        </p>
        <Link
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-6 font-bold text-white"
          href={`/${locale}#sessoes`}
        >
          Voltar às sessões
        </Link>
      </section>
    </main>
  );
}
