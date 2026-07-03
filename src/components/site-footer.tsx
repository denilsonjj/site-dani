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
const socialLinks = [
  ["Instagram", siteConfig.social.instagram, "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"],
  ["YouTube", siteConfig.social.youtube, "M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"],
  ["Facebook", siteConfig.social.facebook, "M14 22v-8h3l.5-4H14V8c0-1.2.4-2 2-2h2V2h-3c-3.4 0-5 2-5 5.5V10H7v4h3v8h4Z"],
] as const;

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
            <nav aria-label="Redes sociais" className="mt-6 flex gap-3">
              {socialLinks.map(([label, href, path]) => (
                <a
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#c6a15b]/35 text-[#9b6d1f] transition hover:bg-[#c6a15b] hover:text-white"
                  href={href}
                  key={label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
          <div className="text-sm text-[#52675e] md:text-right">
            <nav className="mb-6 grid gap-2 font-semibold text-[#9b6d1f] md:justify-items-end">
              {legalLinks.map(([label, href]) => (
                <Link className="hover:text-[#123c2d]" href={href} key={href}>
                  {label}
                </Link>
              ))}
              <span className="mt-3 text-[#9b6d1f]">{copy.legal.kvk}</span>
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
