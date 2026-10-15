"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SakuraPetalConfig {
  id: number;
  xStart: string;
  drift: string;
  duration: string;
  delay: string;
  size: number;
  color: string;
  opacity: number;
  rotateStart: string;
}

export interface SakuraPetalsProps {
  /** Petal count on desktop (>=768px). Default: 8. Never exceeds limit. */
  countDesktop?: number;
  /** Petal count on mobile (<768px). Default: 5. Never exceeds limit. */
  countMobile?: number;
  /** Palette colors. Weighted towards deeper blush and dusty rose clay for visibility on ivory. */
  colors?: string[];
  /** Minimum fall duration in seconds. Default: 16. */
  minDuration?: number;
  /** Maximum fall duration in seconds. Default: 26. */
  maxDuration?: number;
  /** Minimum petal size in px. Default: 8. */
  minSize?: number;
  /** Maximum petal size in px. Default: 14. */
  maxSize?: number;
  /** Optional additional container class. */
  className?: string;
  /** Routes on which petals should be completely disabled. Default: ['/booking']. */
  disabledRoutes?: string[];
}

/**
 * Weighted palette favoring deeper blush and dusty rose clay
 * so petals remain clearly and delicately visible on light ivory/rice-paper backgrounds.
 */
const DEFAULT_COLORS = [
  "#C8A29A", // dusty rose clay (primary)
  "#E6C3C3", // deeper blush (secondary)
  "#C8A29A", // dusty rose clay
  "#E6C3C3", // deeper blush
  "#C8A29A", // dusty rose clay
  "#EED9D3", // pale sakura blush (rare accent)
];

const DEFAULT_DISABLED_ROUTES = ["/booking"];

/**
 * Soft notched sakura petal drawn as a pure vector path.
 * Heart-like indentation at the apex with gentle tapering towards the base.
 */
function PetalSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 12 26 C 6.5 23.5 2 17 2 9 C 2 3.8 6.5 1.5 9.5 2.5 C 10.8 3 11.4 4.5 12 5.5 C 12.6 4.5 13.2 3 14.5 2.5 C 17.5 1.5 22 3.8 22 9 C 22 17 17.5 23.5 12 26 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * SakuraPetals — subtle, quiet falling petals effect for Maison Aurelle.
 * GPU-accelerated via CSS variables and transform/opacity keyframes.
 * Zero layout shifts, zero heavy libraries.
 */
export default function SakuraPetals({
  countDesktop = 8,
  countMobile = 5,
  colors = DEFAULT_COLORS,
  minDuration = 16,
  maxDuration = 26,
  minSize = 8,
  maxSize = 14,
  className,
  disabledRoutes = DEFAULT_DISABLED_ROUTES,
}: SakuraPetalsProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Disable completely on booking or configured routes
  const isDisabledRoute = useMemo(() => {
    if (!pathname) return false;
    return disabledRoutes.some((route) => pathname.startsWith(route));
  }, [pathname, disabledRoutes]);

  // Check prefers-reduced-motion and tab visibility
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", onMotionChange);

    const onVisibilityChange = () => {
      setIsPaused(document.visibilityState === "hidden");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    onResize();
    window.addEventListener("resize", onResize);

    // Fade in gracefully on initial mount
    const timer = setTimeout(() => setMounted(true), 100);

    return () => {
      mediaQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  // Generate petals client-side only to prevent Next.js SSR hydration mismatches
  const petals = useMemo<SakuraPetalConfig[]>(() => {
    if (!mounted || prefersReduced || isDisabledRoute) return [];

    const count = isMobile ? Math.min(countMobile, 5) : Math.min(countDesktop, 8);
    const list: SakuraPetalConfig[] = [];

    for (let i = 0; i < count; i++) {
      // Distribute evenly across horizontal viewport with natural variance
      const segment = 100 / count;
      const xStartNum = Math.floor(i * segment + Math.random() * (segment * 0.7));
      const driftNum = (Math.random() > 0.5 ? 1 : -1) * Math.floor(30 + Math.random() * 45);
      const durationNum = minDuration + Math.random() * (maxDuration - minDuration);
      // Pre-stagger delays so petals are already mid-flight on first load
      const delayNum = -(Math.random() * durationNum * 0.95);
      const sizeNum = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Opacity between 0.58 and 0.78 for gentle, readable contrast on ivory
      const opacity = Number((0.58 + Math.random() * 0.18).toFixed(2));
      const rotateNum = Math.floor(Math.random() * 360);

      list.push({
        id: i,
        xStart: `${xStartNum}vw`,
        drift: `${driftNum}px`,
        duration: `${durationNum.toFixed(1)}s`,
        delay: `${delayNum.toFixed(1)}s`,
        size: sizeNum,
        color,
        opacity,
        rotateStart: `${rotateNum}deg`,
      });
    }

    return list;
  }, [
    mounted,
    isMobile,
    prefersReduced,
    isDisabledRoute,
    countDesktop,
    countMobile,
    colors,
    minDuration,
    maxDuration,
    minSize,
    maxSize,
  ]);

  // If reduced motion is requested or user is on the booking page, render nothing
  if (prefersReduced || isDisabledRoute) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-20 overflow-hidden select-none transition-opacity ease-out",
        mounted ? "opacity-100" : "opacity-0",
        className
      )}
      aria-hidden="true"
      style={{
        perspective: "600px",
        transitionDuration: "2000ms",
      }}
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={
            {
              "--x-start": petal.xStart,
              "--drift": petal.drift,
              "--duration": petal.duration,
              "--delay": petal.delay,
              "--petal-opacity": petal.opacity,
              "--rot-start": petal.rotateStart,
              width: `${petal.size}px`,
              height: `${Math.round(petal.size * 1.16)}px`,
              color: petal.color,
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties
          }
        >
          <PetalSvg className="h-full w-full drop-shadow-[0_1px_1px_rgba(180,120,110,0.12)]" />
        </div>
      ))}
    </div>
  );
}

