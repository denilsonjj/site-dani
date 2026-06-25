import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { locales, type Locale } from "@/lib/content";

export default async function PaymentSuccessPage({
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
        <CheckCircle2 className="mx-auto text-[#1c8f5a]" size={48} strokeWidth={1.5} />
        <h1 className="display mt-8 text-4xl font-semibold">Pagamento recebido</h1>
        <p className="mt-5 leading-7 text-[#52675e]">
          Obrigado. A confirmação e os próximos passos serão enviados para o
          e-mail utilizado no checkout.
        </p>
        <Link
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#123c2d] px-6 font-bold text-white"
          href={`/${locale}`}
        >
          Voltar ao site
        </Link>
      </section>
    </main>
  );
}
