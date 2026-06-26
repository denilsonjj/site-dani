import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/content";
import { siteConfig } from "@/lib/site";

type FooterCopy = {
  disclaimer: string;
  legal: {
    cookies: string;
    kvk: string;
    privacy: string;
    terms: string;
  };
  rights: string;
  text: string;
};

type SiteFooterProps = {
  copy: FooterCopy;
  locale: Locale;
  whatsappLabel: string;
};

const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}`;

export function SiteFooter({ copy, locale, whatsappLabel }: SiteFooterProps) {
  const legalLinks = [
    [copy.legal.cookies, `/${locale}/politica-de-cookies`],
    [copy.legal.terms, `/${locale}/termos-e-condicoes`],
    [copy.legal.privacy, `/${locale}/politica-de-privacidade`],
  ] as const;

  return (
    <>
      <footer className="border-t border-[#123c2d]/12 px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="relative h-20 w-32 rounded-2xl bg-[#123c2d]">
              <Image
                alt="Dani Therapies"
                className="object-contain"
                fill
                sizes="128px"
                src="/dani-therapies-logo-cropped.webp"
              />
            </div>
            <p className="mt-5 max-w-md leading-7 text-[#52675e]">{copy.text}</p>
          </div>
          <div className="text-sm text-[#52675e] md:text-right">
            <nav className="mb-6 grid gap-2 font-semibold text-[#00a57a] md:justify-items-end">
              {legalLinks.map(([label, href]) => (
                <Link className="hover:text-[#123c2d]" href={href} key={href}>
                  {label}
                </Link>
              ))}
              <span className="mt-3 text-[#00a57a]">{copy.legal.kvk}</span>
            </nav>
            <p>© {new Date().getFullYear()} Dani Therapies. {copy.rights}</p>
            <p className="mt-2 max-w-lg text-xs leading-5">{copy.disclaimer}</p>
          </div>
        </div>
      </footer>

      <a
        aria-label={whatsappLabel}
        className="whatsapp-pulse fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1c8f5a] text-white shadow-[0_10px_35px_rgba(9,39,29,0.35)] transition hover:scale-105"
        href={whatsappUrl}
        rel="noreferrer"
        target="_blank"
        title={whatsappLabel}
      >
        <MessageCircle aria-hidden="true" size={25} />
      </a>
    </>
  );
}
