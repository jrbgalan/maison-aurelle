"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FooterCranesProps {
  className?: string;
}

/**
 * FooterCranes — artisanal Japanese textile print layer for Maison Aurelle's footer.
 * Visual Direction:
 * - Deep espresso fabric background with subtle woven linen micro-texture
 * - Two red-crowned cranes (Tsuru) in graceful soaring flight (cream #F3E9DA, brass #B39B78, dusty blue-gray #8FA3A8, terracotta #A65A44)
 * - Defined once via SVG <symbol id="japanese-crane"> and reused cleanly via <use>
 * - Stylized Japanese dotted cloud forms (kumo) in warm stone #5B534D and bamboo #B89A74
 * - Scattered cream speckles and dual CSS mask edge dissolve
 * - Subtle floating drift and scroll-tied horizontal parallax
 */
export default function FooterCranes({ className }: FooterCranesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll-tied horizontal parallax (a few dozen pixels)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const crane1X = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -22]);
  const crane2X = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -28]);
  const cloudsX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-16, 16]);

  return (
    <motion.div
      ref={containerRef}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden select-none bg-[#2B211C]",
        className
      )}
      aria-hidden="true"
      style={{
        // Smooth blend: fade top edge into section above + left fade behind text columns
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 28%, black 100%), linear-gradient(to left, black 0%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 28%, black 100%), linear-gradient(to left, black 0%, black 55%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {/* 1. SUBTLE LINEN WOVEN TEXTURE (3-5% opacity fabric grain) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="linen-weave-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75 0.9"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#linen-weave-noise)" />
        </svg>
      </div>

      {/* SVG SHARED DEFINITIONS (<symbol>, cloud dot pattern, gradients) */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          {/* Stippled dot pattern for Japanese cloud scrolls (Kumo) */}
          <pattern
            id="kumo-dots-pattern"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.1" fill="#B89A74" opacity="0.32" />
            <circle cx="6.5" cy="6.5" r="1.0" fill="#5B534D" opacity="0.28" />
          </pattern>

          <pattern
            id="kumo-dots-fine"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.9" fill="#B39B78" opacity="0.25" />
            <circle cx="5.5" cy="5.5" r="0.8" fill="#8FA3A8" opacity="0.22" />
          </pattern>

          {/* Master Crane Symbol (Tsuru in flight) */}
          <symbol id="japanese-crane" viewBox="0 0 320 220">
            {/* Trailing Legs */}
            <g stroke="#5B534D" strokeWidth="2.2" strokeLinecap="round" opacity="0.75">
              <path d="M 160 122 L 275 142 M 275 142 L 285 144" />
              <path d="M 165 125 L 290 152 M 290 152 L 300 155" />
            </g>

            {/* Tail Feathers in soft dusty blue-gray & charcoal accents */}
            <g opacity="0.85">
              <path
                d="M 155 110 Q 185 114 208 125 Q 178 128 150 124 Z"
                fill="#8FA3A8"
              />
              <path
                d="M 150 115 Q 180 124 198 136 Q 168 134 145 125 Z"
                fill="#758B90"
              />
              <path
                d="M 148 118 Q 172 130 188 145 Q 160 138 142 125 Z"
                fill="#5B534D"
              />
            </g>

            {/* Far (Lower) Wing */}
            <g>
              <path
                d="M 115 112 Q 130 148 165 178 Q 185 165 180 142 Q 155 126 130 116 Z"
                fill="#E8DEC9"
              />
              {/* Fine brass feather line accents */}
              <g
                stroke="#B39B78"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              >
                <path d="M 132 120 L 165 174" />
                <path d="M 142 122 L 175 160" />
                <path d="M 152 124 L 178 144" />
              </g>
              {/* Blue-gray lower wing tip accents */}
              <path
                d="M 165 178 Q 175 172 182 165 Q 172 160 162 170 Z"
                fill="#8FA3A8"
                opacity="0.85"
              />
            </g>

            {/* Main Streamlined Torso & Breast */}
            <path
              d="M 85 92 Q 110 85 140 92 Q 165 102 160 122 Q 135 128 105 118 Q 85 108 85 92 Z"
              fill="#F3E9DA"
            />

            {/* Outstretched Neck, Slender Head, Beak */}
            <g>
              {/* S-curved graceful neck */}
              <path
                d="M 88 95 C 72 82 52 68 38 60 C 32 56 28 58 24 62 L 8 65 Q 24 68 28 72 C 34 78 50 88 64 98 C 74 105 82 108 92 106 Z"
                fill="#F3E9DA"
              />
              {/* Terracotta crown patch on the head */}
              <ellipse
                cx="28"
                cy="61.5"
                rx="4.5"
                ry="2.4"
                transform="rotate(-15 28 61.5)"
                fill="#A65A44"
              />
              {/* Slender eye */}
              <circle cx="23" cy="64.5" r="1.1" fill="#2B211C" />
              {/* Fine pointed beak in brass */}
              <path d="M 24 63.5 L 6 65 L 24 66.5 Z" fill="#B39B78" />
            </g>

            {/* Near (Upper) Grand Wing */}
            <g>
              <path
                d="M 98 88 C 115 55 145 22 178 8 C 182 14 185 24 184 32 C 196 24 205 28 206 38 C 218 32 228 38 226 48 C 238 42 248 50 244 62 C 232 78 205 92 155 98 C 130 100 110 96 98 88 Z"
                fill="#F3E9DA"
              />
              {/* Covert layer highlight */}
              <path
                d="M 102 88 C 118 62 142 36 168 24 C 182 42 186 64 165 84 C 145 92 120 92 102 88 Z"
                fill="#FAF5ED"
                opacity="0.95"
              />
              {/* Fine brass feather quills */}
              <g
                stroke="#B39B78"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.85"
              >
                <path d="M 120 78 L 175 14" />
                <path d="M 130 80 L 198 32" />
                <path d="M 140 84 L 218 42" />
                <path d="M 150 88 L 236 56" />
                <path d="M 158 92 L 225 72" />
              </g>
              {/* Soft dusty blue-gray accents along the wing feather edges */}
              <g fill="#8FA3A8" opacity="0.9">
                <path d="M 175 10 Q 182 22 184 30 Q 178 22 172 14 Z" />
                <path d="M 198 28 Q 204 36 205 44 Q 198 36 192 30 Z" />
                <path d="M 218 36 Q 224 46 223 54 Q 216 46 210 38 Z" />
                <path d="M 235 48 Q 242 58 238 68 Q 232 58 226 50 Z" />
              </g>
            </g>
          </symbol>
        </defs>
      </svg>

      {/* 2. STYLIZED JAPANESE CLOUD FORMS (Kumo scrolls with dotted texture) */}
      <motion.div
        style={{ x: cloudsX }}
        className="absolute bottom-0 right-0 w-[550px] sm:w-[750px] md:w-[980px] h-[340px] pointer-events-none"
      >
        <svg
          viewBox="0 0 980 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Cloud Layer 1: Warm Stone Back Scroll */}
          <path
            d="M 180 280 C 230 230 300 230 350 260 C 410 210 500 210 560 250 C 620 220 700 220 760 260 C 820 230 900 240 980 280 L 980 340 L 180 340 Z"
            fill="url(#kumo-dots-pattern)"
            stroke="#5B534D"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.32"
          />

          {/* Cloud Layer 2: Bamboo Mid Scroll (hidden on mobile for performance) */}
          <path
            d="M 280 240 C 330 190 410 190 460 220 C 520 180 610 180 670 215 C 730 185 810 185 870 225 C 920 205 960 210 980 230 L 980 340 L 280 340 Z"
            fill="url(#kumo-dots-fine)"
            stroke="#B89A74"
            strokeWidth="1.1"
            className="hidden sm:block"
            opacity="0.26"
          />

          {/* Cloud Layer 3: High Wisps */}
          <path
            d="M 440 160 C 480 130 540 130 580 155 C 630 125 700 125 750 150 C 800 130 860 135 910 165 C 950 150 970 155 980 170"
            stroke="#B39B78"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
            opacity="0.28"
          />

          {/* Cloud Layer 4: Distant Low Horizon Scroll */}
          <path
            d="M 380 310 C 440 285 510 285 570 305 C 640 280 720 280 790 305 C 860 285 930 290 980 315"
            stroke="#5B534D"
            strokeWidth="1.3"
            strokeDasharray="2 3"
            fill="none"
            opacity="0.30"
          />
        </svg>
      </motion.div>

      {/* 3. SCATTERED CREAM SPECKLES (Snow / Blossom dots 2-4px) */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: "18%", right: "38%", size: 3.2, opacity: 0.55 },
          { top: "26%", right: "24%", size: 2.4, opacity: 0.45 },
          { top: "34%", right: "44%", size: 3.5, opacity: 0.60 },
          { top: "42%", right: "16%", size: 2.2, opacity: 0.40 },
          { top: "15%", right: "12%", size: 3.0, opacity: 0.50 },
          { top: "54%", right: "32%", size: 2.8, opacity: 0.52 },
          { top: "62%", right: "22%", size: 3.6, opacity: 0.65 },
          { top: "22%", right: "52%", size: 2.4, opacity: 0.42 },
          { top: "48%", right: "58%", size: 3.0, opacity: 0.48 },
          { top: "70%", right: "40%", size: 2.5, opacity: 0.45 },
        ].map((s, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-[#F3E9DA] shadow-[0_0_4px_rgba(243,233,218,0.4)]"
            style={{
              top: s.top,
              right: s.right,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* 4. CRANE 1 (LARGER, LEADING) — ~240-290px wide on desktop */}
      <motion.div
        style={{ x: crane1X }}
        animate={
          reduce
            ? undefined
            : {
                y: [-6, 6, -6],
                rotate: [-1.4, 1.4, -1.4],
              }
        }
        transition={{
          duration: 9.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-8 sm:top-12 md:top-14 right-[-15px] sm:right-6 md:right-16 lg:right-28 w-[190px] sm:w-[230px] md:w-[260px] lg:w-[290px] h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      >
        <svg viewBox="0 0 320 220" className="w-full h-auto overflow-visible">
          <use href="#japanese-crane" />
        </svg>
      </motion.div>

      {/* 5. CRANE 2 (SMALLER, FOLLOWING) — ~160-205px wide, hidden on narrow mobile */}
      <motion.div
        style={{ x: crane2X }}
        animate={
          reduce
            ? undefined
            : {
                y: [5, -6, 5],
                rotate: [1.3, -1.5, 1.3],
              }
        }
        transition={{
          duration: 11.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.6,
        }}
        className="hidden sm:block absolute top-28 sm:top-36 md:top-44 right-4 sm:right-14 md:right-36 lg:right-56 w-[135px] sm:w-[165px] md:w-[185px] lg:w-[205px] h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.3)] opacity-95"
      >
        <svg
          viewBox="0 0 320 220"
          className="w-full h-auto overflow-visible transform rotate-[-4deg]"
        >
          <use href="#japanese-crane" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

