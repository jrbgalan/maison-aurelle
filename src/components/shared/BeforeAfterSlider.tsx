"use client";

import React, { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BeforeAfterSliderProps {
  src?: string;
  afterSrc?: string;
  beforeSrc?: string;
  alt?: string;
  className?: string;
}

/**
 * BeforeAfterSlider — accessible, draggable comparison slider with arch mask.
 * Uses exact identical framing:
 * - "before" layer: subtle natural tone (brightness 0.94, saturate 0.85, contrast 0.95 with faint oat warm overlay, never grayscale)
 * - "after" layer: radiant, dewy skin with warm light, revealed via clip-path: inset(0 0 0 ${pos}%)
 * Divider at pos% with thin brass line and circular '<>' handle.
 */
export default function BeforeAfterSlider({
  src,
  afterSrc,
  beforeSrc,
  alt = "Before and after treatment comparison",
  className,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const finalAfterSrc = afterSrc || src || "https://images.unsplash.com/photo-1616750819456-5cdee9b85d22?auto=format&fit=crop&q=80&w=1200";
  const finalBeforeSrc = beforeSrc || finalAfterSrc;

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setPos((prev) => Math.max(0, prev - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setPos((prev) => Math.min(100, prev + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  // Label opacities based on slider position to prevent overlap with handle
  const beforeLabelOpacity = Math.max(0, Math.min(1, (pos - 12) / 18));
  const afterLabelOpacity = Math.max(0, Math.min(1, (88 - pos) / 18));

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label={alt}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={onKeyDown}
      className={cn(
        "group relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden arch-mask bg-oatlinen focus-ring border border-brass/20 shadow-soft",
        className
      )}
    >
      {/* LAYER 1 (BASE): "BEFORE" — subtle unretouched skin tone (never grayscale) */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={finalBeforeSrc}
          alt="Before treatment"
          draggable={false}
          style={
            !beforeSrc
              ? {
                  filter: "brightness(0.94) saturate(0.85) contrast(0.95)",
                }
              : undefined
          }
          className="h-full w-full object-cover select-none"
          loading="lazy"
        />
        {/* Faint warm-oat overlay for gentle natural contrast difference */}
        {!beforeSrc && (
          <div className="pointer-events-none absolute inset-0 bg-oatlinen/15 mix-blend-multiply" />
        )}
      </div>

      {/* LAYER 2 (TOP): "AFTER" — dewy, luminous skin, revealed via clip-path */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{
          clipPath: `inset(0 0 0 ${pos}%)`,
          WebkitClipPath: `inset(0 0 0 ${pos}%)`,
        }}
      >
        <img
          src={finalAfterSrc}
          alt="After treatment — luminous, rested result"
          draggable={false}
          className="h-full w-full object-cover select-none"
          loading="lazy"
        />
      </div>

      {/* BEFORE LABEL (frosted uppercase pill, top left) */}
      <span
        style={{ opacity: beforeLabelOpacity }}
        className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-brass/25 bg-ricepaper/90 px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-mocha/80 shadow-sm backdrop-blur-md transition-opacity duration-150"
      >
        BEFORE
      </span>

      {/* AFTER LABEL (frosted uppercase pill, top right) */}
      <span
        style={{ opacity: afterLabelOpacity }}
        className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-brass/25 bg-ricepaper/90 px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-brass shadow-sm backdrop-blur-md transition-opacity duration-150"
      >
        AFTER
      </span>

      {/* DIVIDER: Hairline brass line with '<>' circular handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 z-20"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        {/* Vertical thin brass line */}
        <div className="h-full w-[1.5px] bg-brass shadow-[0_0_10px_rgba(164,138,102,0.6)]" />

        {/* Circular handle with '<>' */}
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass/40 bg-ricepaper/95 text-brass shadow-lg backdrop-blur-md transition-transform duration-150 group-hover:scale-105">
          <div className="flex items-center -space-x-1">
            <ChevronLeft className="h-3.5 w-3.5 text-brass" />
            <ChevronRight className="h-3.5 w-3.5 text-brass" />
          </div>
        </div>
      </div>
    </div>
  );
}