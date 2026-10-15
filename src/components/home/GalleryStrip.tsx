"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import { galleryItems } from "@/data/gallery";
import { cn } from "@/lib/utils";

// Warm fallbacks matching brand design tokens
const warmGradients = [
  "linear-gradient(160deg, hsl(8 44% 90%), hsl(21 31% 86%))",
  "linear-gradient(160deg, hsl(21 31% 90%), hsl(22 41% 95%))",
  "linear-gradient(160deg, hsl(86 12% 80%), hsl(21 31% 88%))",
  "linear-gradient(160deg, hsl(6 34% 80%), hsl(8 44% 90%))",
];

// Deliberate 12-column grid positioning for 9 tiles (Zero empty cells):
// Row 1 & 2:
// - Tile 0: Large Arch Left (4 cols x 2 rows)
// - Tile 1: Small Arch Mid-Left Top (2 cols x 1 row)
// - Tile 2: Small Arch Mid-Right Top (2 cols x 1 row)
// - Tile 3: Small Arch Mid-Left Bottom (2 cols x 1 row)
// - Tile 4: Small Arch Mid-Right Bottom (2 cols x 1 row)
// - Tile 5: Large Arch Right (4 cols x 2 rows)
// Row 3:
// - Tile 6: Col 1–4, Row 3 (4 cols)
// - Tile 7: Col 5–8, Row 3 (4 cols)
// - Tile 8: Col 9–12, Row 3 (4 cols)
// Mobile: 2-column balanced collapse with no gaps (2 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2 = 12 columns total = 6 full rows)
const tileGridClasses = [
  "col-span-2 sm:col-span-2 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2 aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[460px]",
  "col-span-1 sm:col-span-1 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-1 aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[220px]",
  "col-span-1 sm:col-span-1 lg:col-start-7 lg:col-span-2 lg:row-start-1 lg:row-span-1 aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[220px]",
  "col-span-1 sm:col-span-1 lg:col-start-5 lg:col-span-2 lg:row-start-2 lg:row-span-1 aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[220px]",
  "col-span-1 sm:col-span-1 lg:col-start-7 lg:col-span-2 lg:row-start-2 lg:row-span-1 aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[220px]",
  "col-span-2 sm:col-span-2 lg:col-start-9 lg:col-span-4 lg:row-start-1 lg:row-span-2 aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[460px]",
  "col-span-1 sm:col-span-1 lg:col-start-1 lg:col-span-4 lg:row-start-3 lg:row-span-1 aspect-[4/5] sm:aspect-auto lg:h-[240px]",
  "col-span-1 sm:col-span-1 lg:col-start-5 lg:col-span-4 lg:row-start-3 lg:row-span-1 aspect-[4/5] sm:aspect-auto lg:h-[240px]",
  "col-span-2 sm:col-span-2 lg:col-start-9 lg:col-span-4 lg:row-start-3 lg:row-span-1 aspect-[16/10] sm:aspect-auto lg:h-[240px]",
];

export default function GalleryStrip() {
  const reduce = useReducedMotion();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="bg-oatlinen/30 py-24 sm:py-32 border-t border-brass/10">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeader
          eyebrow="The Gallery"
          title="Moments of stillness"
          description="A deliberate mosaic of textures, light, and architectural restraint — the serenity surrounding every Aurelle ritual."
        />

        {/* 12-column Deliberate Arch Grid with ZERO Empty Voids */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-5 items-stretch">
          {galleryItems.slice(0, 9).map((item, index) => {
            const gridClass = tileGridClasses[index] || "col-span-1 lg:col-span-4 aspect-[4/3]";
            const gradientBg = warmGradients[index % warmGradients.length];
            const isFailed = failedImages[item.id];

            return (
              <motion.div
                key={item.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "group relative overflow-hidden arch-mask shadow-soft border border-brass/15 transition-all duration-500",
                  gridClass
                )}
                style={{ background: gradientBg }}
              >
                {/* Photo Layer with Slow Hover Zoom & Fallback */}
                {item.image && !isFailed ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={() => handleImageError(item.id)}
                    className="h-full w-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                    <span className="eyebrow text-mocha/50 mb-1">{item.category}</span>
                    <span className="font-display text-lg text-mocha/80">{item.title}</span>
                  </div>
                )}

                {/* Subtle Hover Gradient & Information Pill */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-end p-5">
                  <div className="transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <p className="eyebrow text-ricepaper/75 text-[9px] mb-1">
                      {item.category}
                    </p>
                    <p className="font-display text-base sm:text-lg text-ricepaper leading-snug">
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}