"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

export function AutoCarousel({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ left: 0, startX: 0, dragging: false });

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root) return;
    dragRef.current = { dragging: true, left: root.scrollLeft, startX: event.clientX };
    root.classList.add("is-dragging");
    root.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root || !dragRef.current.dragging) return;
    event.preventDefault();
    root.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.startX);
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current.dragging = false;
    rootRef.current?.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      className="prompt-carousel"
      onPointerCancel={stopDrag}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={stopDrag}
      ref={rootRef}
    >
      <div className="prompt-carousel-track">
        <div className="prompt-carousel-group">{children}</div>
        <div aria-hidden="true" className="prompt-carousel-group">{children}</div>
      </div>
    </div>
  );
}
