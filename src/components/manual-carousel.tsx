"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";

type ManualCarouselProps = {
  children: ReactNode;
  className?: string;
  nextLabel: string;
  previousLabel: string;
};

export function ManualCarousel({ children, className = "", nextLabel, previousLabel }: ManualCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".manual-carousel-item");
    if (!track || !card) return;
    const distance = card.offsetWidth + 20;
    const max = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft >= max - 4;
    const target = direction === 1
      ? atEnd ? 0 : Math.min(track.scrollLeft + distance, max)
      : atStart ? max : Math.max(track.scrollLeft - distance, 0);
    track.scrollTo({ behavior: "smooth", left: target });
  }

  return (
    <div className={`mt-10 ${className}`}>
      <div className="mb-5 flex justify-end gap-3">
        <button aria-label={previousLabel} className="carousel-arrow" onClick={() => move(-1)} type="button">
          <ChevronLeft aria-hidden="true" size={22} />
        </button>
        <button aria-label={nextLabel} className="carousel-arrow" onClick={() => move(1)} type="button">
          <ChevronRight aria-hidden="true" size={22} />
        </button>
      </div>
      <div className="manual-carousel-track" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}
