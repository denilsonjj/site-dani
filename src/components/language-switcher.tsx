"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { localeOptions, locales, type Locale } from "@/lib/content";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/18 bg-white/[0.05] px-4 text-xs font-bold text-white shadow-inner shadow-white/5 transition hover:bg-white/10"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="rounded-[3px] object-cover"
          height={16}
          src={localeOptions[locale].flag}
          width={24}
        />
        <span>{localeOptions[locale].short}</span>
        <ArrowDown
          aria-hidden="true"
          className={`transition duration-300 ${isOpen ? "rotate-180" : ""}`}
          size={13}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-13 z-50 grid min-w-44 overflow-hidden rounded-2xl bg-[#f8f5ec] p-2 text-[#123c2d] shadow-xl ring-1 ring-[#123c2d]/10"
          role="menu"
        >
          {locales.map((item) => (
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-[#dcece2]"
              href={`/${item}`}
              key={item}
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="rounded-[3px] object-cover"
                height={16}
                src={localeOptions[item].flag}
                width={24}
              />
              <span>{localeOptions[item].label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
