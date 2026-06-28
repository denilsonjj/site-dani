import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, MoonStar, ShieldCheck, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import type { SiteService } from "@/lib/cms";
import type { Locale } from "@/lib/content";
import { getServiceImage } from "@/lib/service-visuals";

type ServiceCardProps = {
  actionLabel: string;
  detailsLabel: string;
  index: number;
  locale: Locale;
  service: SiteService;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay"?: string;
};

const availabilityCopy = {
  pt: {
    remaining: (count: number) => `${count} vagas restantes`,
    soldOut: "Esgotado",
  },
  en: {
    remaining: (count: number) => `${count} spots left`,
    soldOut: "Sold out",
  },
  es: {
    remaining: (count: number) => `${count} plazas restantes`,
    soldOut: "Agotado",
  },
  nl: {
    remaining: (count: number) => `${count} plaatsen beschikbaar`,
    soldOut: "Uitverkocht",
  },
};

export function ServiceCard({ actionLabel, detailsLabel, index, locale, service }: ServiceCardProps) {
  const icons = [Sparkles, HeartHandshake, MoonStar, ShieldCheck];
  const Icon = icons[index % icons.length];
  const remainingSeats = service.remainingSeats;
  const isSoldOut = remainingSeats !== null && remainingSeats !== undefined && remainingSeats <= 0;
  const availability = availabilityCopy[locale] || availabilityCopy.pt;

  return (
    <article
      className="flex min-h-[31rem] flex-col overflow-hidden rounded-[2rem] border border-[#123c2d]/10 bg-[#f8f5ec] shadow-[0_18px_55px_rgba(19,35,29,0.08)]"
      data-reveal
      id={service.slug}
      style={{ "--reveal-delay": `${index * 70}ms` } as RevealStyle}
    >
      <div className="relative h-44 overflow-hidden bg-[#123c2d]">
        <Image
          alt=""
          className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.04]"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          src={getServiceImage(service.productId, service.image)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,39,29,0.08)_0%,rgba(9,39,29,0.52)_100%)]" />
        <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
          {service.badge}
        </span>
        {remainingSeats !== null && remainingSeats !== undefined ? (
          <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#0b2a20]/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {isSoldOut ? availability.soldOut : availability.remaining(remainingSeats)}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="text-[#547461]">
          <Icon aria-hidden="true" size={30} strokeWidth={1.5} />
        </div>
        <h3 className="display mt-7 text-3xl font-semibold leading-tight text-[#123c2d]">
          {service.title}
        </h3>
        <p className="mt-4 leading-7 text-[#52675e]">{service.text}</p>
        <div className="mt-auto pt-7">
          <div className="mb-5 flex items-center justify-between gap-4 border-t border-[#123c2d]/10 pt-5">
            <p className="min-w-0 flex-1 text-sm font-bold leading-5 text-[#547461]">
              {service.duration}
            </p>
            <p className="price-text shrink-0 whitespace-nowrap text-3xl font-bold text-[#123c2d]">
              {service.price}
            </p>
          </div>
          <div className="grid gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#123c2d]/18 px-5 text-center font-bold text-[#123c2d] transition hover:border-[#123c2d]/35 hover:bg-[#e4eee6]"
              href={`/${locale}/sessoes/${service.slug || service.productId}`}
            >
              {detailsLabel}
            </Link>
            <CheckoutButton disabled={isSoldOut} locale={locale} productId={service.productId}>
              {actionLabel}
            </CheckoutButton>
          </div>
        </div>
      </div>
    </article>
  );
}
