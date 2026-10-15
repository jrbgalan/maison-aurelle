"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SakuraBranchBackgroundProps {
  className?: string;
  /** Whether to enable falling ambient petals in this section. Default: true. */
  showPetals?: boolean;
}

// 5 extra local drifting petals for this section (6-10px, slow)
const localPetals = [
  { id: 1, x: "72%", drift: "-40px", duration: "21s", delay: "-3s", size: 8, color: "#C8A29A", opacity: 0.65 },
  { id: 2, x: "82%", drift: "-55px", duration: "25s", delay: "-11s", size: 9, color: "#E6C3C3", opacity: 0.60 },
  { id: 3, x: "64%", drift: "-30px", duration: "19s", delay: "-7s", size: 7, color: "#C8A29A", opacity: 0.70 },
  { id: 4, x: "88%", drift: "-45px", duration: "23s", delay: "-16s", size: 10, color: "#EED9D3", opacity: 0.55 },
  { id: 5, x: "78%", drift: "-35px", duration: "26s", delay: "-1s", size: 8, color: "#E6C3C3", opacity: 0.62 },
];

/**
 * SakuraBranchBackground — an artisanal watercolor background layer for Maison Aurelle.
 * Composed purely of:
 * 1. Soft blurred watercolor wash clouds (sakura blush, deep blush, dusty rose clay)
 * 2. An inline SVG with feTurbulence + feDisplacementMap watercolor edges
 * 3. A delicate, hand-painted silhouette branch entering from the top-right
 * 4. Micro-clusters of sakura blossoms and petals
 * 5. Subtle scroll-driven parallax and smooth vertical/horizontal CSS mask dissolve
 */
export default function SakuraBranchBackground({
  className,
  showPetals = true,
}: SakuraBranchBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Subtle parallax drift while scrolling past this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const branchY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 14]);
  const branchX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [6, -6]);

  return (
    <motion.div
      ref={containerRef}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
      style={{
        // Dual CSS mask gradient: smooth vertical dissolve into surrounding sections + horizontal left fade
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to left, black 0%, black 65%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to left, black 0%, black 65%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {/* 1. WATERCOLOR WASH CLOUDS (concentrated at top-right, fading toward center/bottom) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90 dark:opacity-20 transition-opacity duration-700">
        {/* Wash Blob 1 (Sakura Blush - large back wash) */}
        <div
          className="absolute -top-16 -right-16 h-72 w-72 sm:h-96 sm:w-96 md:h-[460px] md:w-[460px] rounded-full blur-[45px] sm:blur-[70px] md:blur-[95px]"
          style={{ background: "#EED9D3", opacity: 0.42 }}
        />

        {/* Wash Blob 2 (Deeper Blush - mid body) */}
        <div
          className="absolute top-12 right-24 h-64 w-64 sm:h-80 sm:w-80 md:h-[380px] md:w-[380px] rounded-full blur-[40px] sm:blur-[60px] md:blur-[85px]"
          style={{ background: "#E6C3C3", opacity: 0.46 }}
        />

        {/* Wash Blob 3 (Dusty Rose Clay - branch base accent) */}
        <div
          className="absolute top-28 right-56 h-48 w-48 sm:h-64 sm:w-64 md:h-[300px] md:w-[300px] rounded-full blur-[40px] sm:blur-[65px] md:blur-[80px]"
          style={{ background: "#C8A29A", opacity: 0.36 }}
        />

        {/* Wash Blob 4 (Deep Blush - lower drift) */}
        <div
          className="absolute top-52 right-36 h-44 w-44 sm:h-56 sm:w-56 md:h-[260px] md:w-[260px] rounded-full blur-[35px] sm:blur-[55px] md:blur-[75px]"
          style={{ background: "#E6C3C3", opacity: 0.32 }}
        />

        {/* Wash Blob 5 (Sakura Blush - top-most edge blend) */}
        <div
          className="absolute -top-24 right-48 h-56 w-56 sm:h-72 sm:w-72 md:h-[340px] md:w-[340px] rounded-full blur-[40px] sm:blur-[60px] md:blur-[90px]"
          style={{ background: "#EED9D3", opacity: 0.38 }}
        />

        {/* Wash Blob 6 (Dusty Rose Clay - subtle leftward whisper) */}
        <div
          className="absolute top-64 right-80 h-36 w-36 sm:h-48 sm:w-48 md:h-[220px] md:w-[220px] rounded-full blur-[40px] sm:blur-[60px] md:blur-[80px]"
          style={{ background: "#C8A29A", opacity: 0.24 }}
        />
      </div>

      {/* 2 & 3. ARTISANAL SAKURA BRANCH & BLOSSOM CLUSTERS (SVG with watercolor filter) */}
      <motion.div
        style={{ y: branchY, x: branchX }}
        className="absolute top-0 right-0 w-[340px] sm:w-[480px] md:w-[680px] lg:w-[820px] max-w-full pointer-events-none"
      >
        <svg
          viewBox="0 0 800 580"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible drop-shadow-[0_4px_16px_rgba(200,162,154,0.18)]"
          aria-hidden="true"
        >
          <defs>
            {/* SVG watercolor paper displacement filter for soft painted edges */}
            <filter
              id="watercolor-roughness"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.045"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="7"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feGaussianBlur in="displaced" stdDeviation="0.8" />
            </filter>

            {/* Subtle radial gradients for blossoms */}
            <radialGradient id="floretGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E6C3C3" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#EED9D3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C8A29A" stopOpacity="0.65" />
            </radialGradient>

            <radialGradient id="floretGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C8A29A" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#E6C3C3" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#EED9D3" stopOpacity="0.5" />
            </radialGradient>
          </defs>

          {/* ELEGANT BRANCH SILHOUETTE (Warm Muted Brown #6B5249 at ~60% opacity) */}
          <g
            filter="url(#watercolor-roughness)"
            stroke="#6B5249"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          >
            {/* Main Bough — sweeping from top-right down & leftward */}
            <path
              d="M 820 -15 Q 730 35 630 65 Q 530 95 440 170 Q 360 235 270 270"
              strokeWidth="5"
              fill="none"
            />
            {/* Main continuation tapering out */}
            <path
              d="M 270 270 Q 210 295 140 310"
              strokeWidth="2.8"
              fill="none"
            />
            <path
              d="M 140 310 Q 90 320 50 325"
              strokeWidth="1.6"
              fill="none"
            />

            {/* Upper secondary branch */}
            <path
              d="M 640 62 Q 570 30 490 22 Q 440 18 390 30"
              strokeWidth="3.2"
              fill="none"
            />
            <path
              d="M 490 22 Q 450 -5 410 -15"
              strokeWidth="1.8"
              fill="none"
            />
            <path
              d="M 440 18 Q 410 40 370 52"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Mid branching sub-twigs */}
            <path
              d="M 510 115 Q 470 175 425 210 Q 380 245 330 260"
              strokeWidth="2.6"
              fill="none"
            />
            <path
              d="M 425 210 Q 420 270 395 315"
              strokeWidth="1.8"
              fill="none"
            />
            <path
              d="M 395 315 Q 370 350 335 375"
              strokeWidth="1.3"
              fill="none"
            />

            {/* Lower delicate twigs */}
            <path
              d="M 370 230 Q 315 205 260 215"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 260 215 Q 210 225 170 250"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M 270 270 Q 255 330 220 365"
              strokeWidth="1.8"
              fill="none"
            />
            <path
              d="M 220 365 Q 190 395 150 410"
              strokeWidth="1.2"
              fill="none"
            />
          </g>

          {/* SAKURA FLORETS & CLUSTERS (dense near branch, sparser outward) */}
          <g filter="url(#watercolor-roughness)">
            {/* Cluster 1: Near Upper Right Junction */}
            <Floret x={630} y={65} scale={1.25} rot={12} grad="url(#floretGrad1)" />
            <Floret x={605} y={45} scale={0.9} rot={-25} grad="url(#floretGrad2)" />
            <Floret x={660} y={80} scale={1.05} rot={45} grad="url(#floretGrad1)" />
            <Bud x={590} y={32} rot={-30} />
            <Bud x={675} y={95} rot={55} />

            {/* Cluster 2: Mid-Bough Center */}
            <Floret x={440} y={170} scale={1.35} rot={-15} grad="url(#floretGrad1)" />
            <Floret x={415} y={145} scale={1.0} rot={30} grad="url(#floretGrad2)" />
            <Floret x={470} y={195} scale={1.1} rot={-40} grad="url(#floretGrad1)" />
            <Floret x={425} y={210} scale={0.95} rot={75} grad="url(#floretGrad2)" />
            <Bud x={395} y={130} rot={-10} />

            {/* Cluster 3: Upper Twig Canopy */}
            <Floret x={490} y={22} scale={1.15} rot={60} grad="url(#floretGrad2)" />
            <Floret x={440} y={18} scale={0.85} rot={-35} grad="url(#floretGrad1)" />
            <Floret x={390} y={30} scale={1.0} rot={15} grad="url(#floretGrad2)" />
            <Bud x={370} y={52} rot={80} />
            <Bud x={410} y={-15} rot={-50} />

            {/* Cluster 4: Mid-Lower Drooping Twig */}
            <Floret x={395} y={315} scale={1.1} rot={-20} grad="url(#floretGrad1)" />
            <Floret x={360} y={340} scale={0.9} rot={40} grad="url(#floretGrad2)" />
            <Floret x={335} y={375} scale={0.8} rot={-65} grad="url(#floretGrad1)" />
            <Bud x={315} y={395} rot={-45} />

            {/* Cluster 5: Tapered Outer Branch */}
            <Floret x={270} y={270} scale={1.2} rot={18} grad="url(#floretGrad1)" />
            <Floret x={235} y={250} scale={0.95} rot={-50} grad="url(#floretGrad2)" />
            <Floret x={220} y={365} scale={1.0} rot={35} grad="url(#floretGrad1)" />
            <Floret x={170} y={250} scale={0.85} rot={-15} grad="url(#floretGrad2)" />
            <Floret x={140} y={310} scale={0.9} rot={85} grad="url(#floretGrad1)" />
            <Bud x={115} y={318} rot={15} />
            <Bud x={50} y={325} rot={-10} />
            <Bud x={150} y={410} rot={45} />

            {/* Scattered Loose Petals (drifting gently away from branch) */}
            <SinglePetal x={320} y={150} rot={42} scale={1.1} color="#C8A29A" opacity={0.7} />
            <SinglePetal x={260} y={180} rot={-25} scale={0.9} color="#E6C3C3" opacity={0.65} />
            <SinglePetal x={350} y={280} rot={75} scale={1.0} color="#EED9D3" opacity={0.75} />
            <SinglePetal x={200} y={310} rot={-60} scale={0.85} color="#C8A29A" opacity={0.6} />
            <SinglePetal x={290} y={350} rot={110} scale={0.95} color="#E6C3C3" opacity={0.7} />
            <SinglePetal x={180} y={380} rot={15} scale={0.8} color="#C8A29A" opacity={0.65} />
            <SinglePetal x={480} y={260} rot={-35} scale={1.05} color="#E6C3C3" opacity={0.6} />
            <SinglePetal x={550} y={180} rot={80} scale={0.9} color="#EED9D3" opacity={0.7} />
          </g>
        </svg>
      </motion.div>

      {/* 4. SECTION-SPECIFIC AMBIENT FALLING PETALS (4-6 extra petals, 6-10px, slow) */}
      {showPetals && !reduce && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {localPetals.map((p) => (
            <div
              key={p.id}
              className="sakura-petal"
              style={
                {
                  "--x-start": p.x,
                  "--drift": p.drift,
                  "--duration": p.duration,
                  "--delay": p.delay,
                  "--petal-opacity": p.opacity,
                  "--rot-start": "25deg",
                  width: `${p.size}px`,
                  height: `${Math.round(p.size * 1.16)}px`,
                  color: p.color,
                } as React.CSSProperties
              }
            >
              <svg
                viewBox="0 0 24 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M 12 26 C 6.5 23.5 2 17 2 9 C 2 3.8 6.5 1.5 9.5 2.5 C 10.8 3 11.4 4.5 12 5.5 C 12.6 4.5 13.2 3 14.5 2.5 C 17.5 1.5 22 3.8 22 9 C 22 17 17.5 23.5 12 26 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/** 5-lobed delicate sakura floret */
function Floret({
  x,
  y,
  scale = 1,
  rot = 0,
  grad = "url(#floretGrad1)",
}: {
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  grad?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
      {/* 5 petals radiating at 72 degree intervals */}
      {[0, 72, 144, 216, 288].map((angle, idx) => (
        <path
          key={idx}
          d="M 0 0 C -4 -7, -7 -12, -4 -16 C -2 -19, 0 -17.5, 0 -16 C 0 -17.5, 2 -19, 4 -16 C 7 -12, 4 -7, 0 0 Z"
          fill={grad}
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Delicate floral pistil / center bud in warm clay */}
      <circle cx="0" cy="0" r="2.2" fill="#C8A29A" opacity="0.9" />
      <circle cx="0" cy="0" r="1.1" fill="#8F6B58" opacity="0.95" />
    </g>
  );
}

/** Small closed blossom bud on a twig */
function Bud({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <path
        d="M 0 0 C -2 -3, -3 -6, 0 -9 C 3 -6, 2 -3, 0 0 Z"
        fill="#C8A29A"
        opacity="0.85"
      />
      <path
        d="M -1 0 C -2 -2, -1 -4, 0 -6 C 1 -4, 0 -2, -1 0 Z"
        fill="#E6C3C3"
        opacity="0.9"
      />
      <circle cx="0" cy="1" r="1.2" fill="#6B5249" opacity="0.75" />
    </g>
  );
}

/** Individual single notched petal drifting in space */
function SinglePetal({
  x,
  y,
  rot = 0,
  scale = 1,
  color = "#C8A29A",
  opacity = 0.7,
}: {
  x: number;
  y: number;
  rot?: number;
  scale?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M 0 10 C -4 9, -7 6, -7 2 C -7 -1, -4 -2.5, -2 -2 C -1 -1.8, -0.5 -0.8, 0 0 C 0.5 -0.8, 1 -1.8, 2 -2 C 4 -2.5, 7 -1, 7 2 C 7 6, 4 9, 0 10 Z"
        fill={color}
        opacity={opacity}
      />
    </g>
  );
}

