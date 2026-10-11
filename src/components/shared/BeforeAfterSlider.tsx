"use client";

import React, { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BeforeAfterSliderProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * BeforeAfterSlider — draggable comparison slider.
 * Uses a single source image; "before" is a desaturated, softened version,
 * "after" is the original — a clean demo of the interaction.
 */
export default function BeforeAfterSlider({
  src,
  alt = "Before and after comparison",
  className,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const reduce = useReducedMotion();

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={cn(
        "relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-arch bg-oatlinen select-none",
        className
      )}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
    >
      {/* After (full) */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ filter: "grayscale(0.65) brightness(0.96) contrast(0.95)" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* labels */}
      <span className="pointer-events-none absolute left-4 top-4 eyebrow rounded-pill bg-ricepaper/80 px-3 py-1 text-mocha/70">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 eyebrow rounded-pill bg-ricepaper/80 px-3 py-1 text-mocha/70">
        After
      </span>

      {/* handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-px bg-brass" />
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-brass text-ricepaper shadow-soft">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}