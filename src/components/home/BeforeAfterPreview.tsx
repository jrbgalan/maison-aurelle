"use client";

import React, { useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TreatmentTab {
  id: string;
  name: string;
  category: string;
  description: string;
  afterSrc: string;
}

const treatments: TreatmentTab[] = [
  {
    id: "facial",
    name: "Facial Rejuvenation",
    category: "Barrier & Radiance",
    description: "Enzymatic renewal and deep serum infusion reveal calm, dewy, lit-from-within skin.",
    afterSrc: "https://images.unsplash.com/photo-1616750819456-5cdee9b85d22?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "injectables",
    name: "Injectables",
    category: "Sculpted Volume",
    description: "Micro-droplet placement softens shadows and restores rested cheekbone architecture.",
    afterSrc: "https://images.unsplash.com/photo-1643684391140-c5056cfd3436?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "laser",
    name: "Laser Resurfacing",
    category: "Clarity & Tone",
    description: "Calibrated fractional passes refine texture and soothe redness while protecting the barrier.",
    afterSrc: "https://images.unsplash.com/photo-1700760934166-4c766d708139?auto=format&fit=crop&q=80&w=1200",
  },
];

export default function BeforeAfterPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeTreatment = treatments[selectedIdx];

  return (
    <section className="bg-ricepaper py-24 sm:py-32 border-t border-brass/10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-12">
          {/* Left Column: Context & Interactive Treatment Selector */}
          <div className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="The Quiet Reveal"
              title="See the difference, gently"
              description="Drag the brass filament to reveal the before and after of our signature treatments. Results that read as restorative rest — never as change."
            />

            <p className="mt-5 text-sm font-light leading-relaxed text-mocha/70">
              {activeTreatment.description}
            </p>

            {/* Treatment Selector Thumbnails / Tabs */}
            <div className="mt-8 space-y-3">
              <p className="eyebrow text-[11px] text-mocha/50">Select treatment protocol</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                {treatments.map((t, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-2xl p-2.5 text-left transition-all duration-300 focus-ring border",
                        isSelected
                          ? "bg-oatlinen/60 border-brass/40 shadow-soft"
                          : "bg-transparent border-transparent hover:bg-oatlinen/25 hover:border-brass/15"
                      )}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden arch-mask bg-oatlinen">
                        <img
                          src={t.afterSrc}
                          alt={t.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-base text-mocha leading-snug truncate">
                            {t.name}
                          </span>
                          {isSelected && <Sparkles className="h-3 w-3 text-brass shrink-0" />}
                        </div>
                        <span className="block font-mono text-[10px] uppercase tracking-wider text-brass">
                          {t.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Comparison Slider */}
          <div className="lg:col-span-7">
            <div className="relative">
              <BeforeAfterSlider
                key={activeTreatment.id}
                afterSrc={activeTreatment.afterSrc}
                alt={`Before and after of ${activeTreatment.name}`}
              />

              <div className="mt-4 flex items-center justify-between px-2 text-xs text-mocha/60 font-light">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass/40" />
                  Drag or use left/right arrow keys
                </span>
                <span className="font-mono text-[11px] text-brass uppercase tracking-wider">
                  Unretouched clinical skin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}