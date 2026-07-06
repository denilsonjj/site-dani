"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";

type ManualCarouselProps = {
  children: ReactNode;
  className?: string;
  nextLabel: string;
  previousLabel: string;
};

export function ManualCarousel({ children, className = "", nextLabel, previousLabel }: ManualCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ left: 0, startX: 0, dragging: false, moved: false });

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".manual-carousel-item");
    if (!track || !card) return;
    const distance = card.offsetWidth + 20;
    const max = track.scrollWidth - track.clientWidth;
    const target = track.scrollLeft + direction * distance;
    track.scrollTo({ behavior: "smooth", left: target > max - 4 ? 0 : target < 4 ? max : target });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { dragging: true, left: track.scrollLeft, moved: false, startX: event.clientX };
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.dragging) return;
    event.preventDefault();
    if (Math.abs(event.clientX - dragRef.current.startX) > 6) dragRef.current.moved = true;
    track.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.startX);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current.dragging = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function preventAccidentalClick(event: MouseEvent<HTMLDivElement>) {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
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
      <div
        className="manual-carousel-track"
        onClickCapture={preventAccidentalClick}
        onPointerCancel={stopDrag}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        ref={trackRef}
      >
        {children}
      </div>
    </div>
  );
}
