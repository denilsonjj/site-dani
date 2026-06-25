"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

type MobileMenuProps = {
  items: ReadonlyArray<readonly [string, string]>;
};

export function MobileMenu({ items }: MobileMenuProps) {
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
    <div className="relative lg:hidden" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Abrir menu"
        className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-white/[0.05] text-white transition hover:bg-white/10"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <Menu aria-hidden="true" size={20} />
      </button>

      {isOpen ? (
        <nav className="absolute right-0 top-13 z-50 grid min-w-56 gap-1 rounded-2xl bg-[#f8f5ec] p-3 text-[#123c2d] shadow-xl ring-1 ring-[#123c2d]/10">
          {items.map(([label, href]) => {
            const className = "rounded-xl px-4 py-3 font-bold transition hover:bg-[#dcece2]";

            if (href.startsWith("/")) {
              return (
                <Link className={className} href={href} key={href} onClick={() => setIsOpen(false)}>
                  {label}
                </Link>
              );
            }

            return (
              <a className={className} href={href} key={href} onClick={() => setIsOpen(false)}>
                {label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
