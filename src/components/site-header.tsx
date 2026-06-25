import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileMenu } from "@/components/mobile-menu";
import type { Locale } from "@/lib/content";

type HeaderCopy = {
  about: string;
  blog: string;
  book: string;
  contact: string;
  courses: string;
  services: string;
};

type SiteHeaderProps = {
  copy: HeaderCopy;
  locale: Locale;
};

export function SiteHeader({ copy, locale }: SiteHeaderProps) {
  const items = [
    [copy.about, `/${locale}#sobre`],
    [copy.services, `/${locale}/sessoes`],
    [copy.courses, `/${locale}/cursos`],
    [copy.blog, `/${locale}/blog`],
    [copy.contact, `/${locale}#contato`],
  ] as const;

  return (
    <header className="site-header">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link
          aria-label="Dani Therapies"
          className="relative -ml-2 block h-20 w-40 shrink-0 sm:h-24 sm:w-48"
          href={`/${locale}`}
        >
          <Image
            alt="Dani Therapies"
            className="object-contain"
            fill
            priority
            sizes="176px"
            src="/dani-therapies-logo-cropped.webp"
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm font-semibold text-white/88 lg:flex"
        >
          {items.map(([label, href]) => (
            <Link
              className="rounded-full px-4 py-3 transition hover:bg-white/10 hover:text-[#e5cc96]"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            className="hidden min-h-11 items-center justify-center rounded-full bg-[#e3c77f] px-5 text-sm font-bold text-[#10251d] shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition hover:bg-[#eed9a4] md:inline-flex"
            href={`/${locale}/sessoes#primeira-consulta-online`}
          >
            {copy.book}
          </Link>
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}
