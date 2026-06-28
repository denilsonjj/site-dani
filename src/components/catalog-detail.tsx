import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, CreditCard, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { SiteService } from "@/lib/cms";
import { getContent, type Locale } from "@/lib/content";
import { getServiceImage } from "@/lib/service-visuals";

type CatalogDetailProps = {
  aboutTitle: string;
  actionLabel: string;
  backHref: string;
  backLabel: string;
  durationLabel: string;
  eyebrow: string;
  investmentLabel: string;
  locale: Locale;
  paragraphs: string[];
  practicalTitle: string;
  service: SiteService;
};

export function CatalogDetail({
  aboutTitle,
  actionLabel,
  backHref,
  backLabel,
  durationLabel,
  eyebrow,
  investmentLabel,
  locale,
  paragraphs,
  practicalTitle,
  service,
}: CatalogDetailProps) {
  const copy = getContent(locale);
  const isSoldOut = service.remainingSeats !== null
    && service.remainingSeats !== undefined
    && service.remainingSeats <= 0;

  return (
    <main className="min-h-screen bg-[#f8f5ec] text-[#123c2d]">
      <ScrollReveal />
      <SiteHeader copy={copy.nav} locale={locale} />

      <section className="overflow-hidden bg-[#0d3024] px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#d8bd82] transition hover:text-[#ead7aa]" href={backHref}>
            <ArrowLeft aria-hidden="true" size={17} />
            {backLabel}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd82]">{eyebrow}</p>
              <h1 className="display mt-4 max-w-4xl text-5xl font-semibold leading-[1.04] sm:text-7xl">
                {service.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">{service.text}</p>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.06] shadow-2xl shadow-black/20 sm:min-h-[30rem]">
              <Image
                alt={service.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                src={getServiceImage(service.productId, service.image)}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,28,21,0.72)_100%)]" />
              <span className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-[#0b2a20]/68 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {service.badge}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <article className="rounded-[2rem] border border-[#123c2d]/10 bg-white p-7 shadow-[0_22px_70px_rgba(19,35,29,0.08)] sm:p-10" data-reveal>
            <Sparkles aria-hidden="true" className="text-[#b38f4f]" size={30} strokeWidth={1.5} />
            <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">{aboutTitle}</h2>
            <div className="mt-7 grid gap-6 text-base leading-8 text-[#52675e] sm:text-lg">
              {paragraphs.map((paragraph, index) => <p key={`${service.productId}-${index}`}>{paragraph}</p>)}
            </div>
          </article>

          <aside className="rounded-[2rem] bg-[#123c2d] p-7 text-white shadow-[0_22px_70px_rgba(19,35,29,0.16)] lg:sticky lg:top-28" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8bd82]">{practicalTitle}</p>
            <div className="mt-7 grid gap-5">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5">
                <Clock3 aria-hidden="true" className="text-[#d8bd82]" size={24} />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">{durationLabel}</p>
                <p className="mt-2 font-bold">{service.duration}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-5">
                <CreditCard aria-hidden="true" className="text-[#d8bd82]" size={24} />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50">{investmentLabel}</p>
                <p className="price-text mt-2 text-3xl font-bold text-[#d8bd82]">{service.price}</p>
              </div>
            </div>
            <div className="mt-6">
              <CheckoutButton disabled={isSoldOut} locale={locale} productId={service.productId}>
                {actionLabel}
              </CheckoutButton>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter copy={copy.footer} locale={locale} whatsappLabel={copy.whatsapp} />
    </main>
  );
}
