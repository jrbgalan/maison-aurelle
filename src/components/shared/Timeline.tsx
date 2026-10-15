"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import { milestones } from "@/data/milestones";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types";

export interface TimelineProps {
  items?: Milestone[];
  className?: string;
}

export default function Timeline({ items = milestones, className }: TimelineProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Recalculate max scroll distance dynamically
  useEffect(() => {
    const measure = () => {
      if (containerRef.current && scrollTrackRef.current) {
        const containerW = containerRef.current.offsetWidth;
        const trackW = scrollTrackRef.current.scrollWidth;
        const diff = Math.max(0, trackW - containerW + 64);
        setMaxScrollX(diff);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  // Update active index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (items.length === 0) return;
    const step = 1 / items.length;
    const idx = Math.min(items.length - 1, Math.floor(latest / step));
    setActiveIdx(idx);
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -maxScrollX]);

  // If prefers-reduced-motion, render static accessible layout
  if (reduce) {
    return (
      <section className={cn("bg-ricepaper py-24 sm:py-32", className)} aria-label="Clinic milestones timeline">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="eyebrow mb-3">The Aurelle Chronicle</p>
          <h2 className="display mb-10 text-3xl sm:text-4xl md:text-5xl text-mocha">
            A quiet evolution
          </h2>
          <div className="relative mb-12 h-px w-full bg-brass" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((m, i) => (
              <div key={m.id || i} className="bg-oatlinen/30 p-6 rounded-arch border border-brass/15">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-3 w-3 rounded-full bg-brass ring-4 ring-brass/25" />
                  <span className="display text-2xl text-brass">{m.year}</span>
                </div>
                <h3 className="display text-xl text-mocha">{m.title}</h3>
                <p className="mt-2 text-sm font-light text-mocha/70">{m.description || m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const currentYear = items[activeIdx]?.year || items[0]?.year || "2014";

  return (
    <section
      ref={trackRef}
      className={cn("relative bg-ricepaper", className)}
      aria-label="Clinic milestones timeline"
    >
      {/* DESKTOP & TABLET SCROLL-PINNED TIMELINE (hidden on small mobile) */}
      <div className="hidden md:block relative h-[320vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div ref={containerRef} className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
            {/* Top header row with active year backdrop & counter */}
            <div className="flex items-end justify-between border-b border-brass/10 pb-6">
              <div>
                <p className="eyebrow mb-2">The Aurelle Chronicle</p>
                <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-mocha">
                  A quiet evolution
                </h2>
              </div>

              <div className="flex items-baseline gap-6">
                <div className="text-right">
                  <span className="block font-mono text-[11px] uppercase tracking-widest text-brass">
                    Milestone
                  </span>
                  <span className="font-mono text-sm font-light text-mocha/80">
                    {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                </div>
                <span className="font-display text-7xl lg:text-8xl text-brass/20 select-none leading-none -mb-3 transition-colors duration-500">
                  {currentYear}
                </span>
              </div>
            </div>

            {/* Hairline track with brass progress line */}
            <div className="relative my-10 h-px w-full bg-brass/20">
              <motion.div
                style={{ scaleX: lineScale, transformOrigin: "0% 50%" }}
                className="absolute inset-0 h-px bg-brass shadow-[0_0_8px_rgba(164,138,102,0.4)]"
              />
            </div>

            {/* Horizontal scrolling milestones strip */}
            <div className="relative overflow-visible">
              <motion.div
                ref={scrollTrackRef}
                style={{ x: xTransform }}
                className="flex items-start gap-10 sm:gap-14 pr-16"
              >
                {items.map((m, i) => {
                  const isActive = activeIdx >= i;
                  const isCurrent = activeIdx === i;

                  return (
                    <div
                      key={m.id || i}
                      className="relative w-[300px] lg:w-[340px] shrink-0 transition-all duration-500 select-none"
                    >
                      {/* Node indicator on top */}
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={cn(
                            "relative flex h-4 w-4 items-center justify-center rounded-full transition-all duration-500",
                            isCurrent
                              ? "bg-brass ring-4 ring-brass/30 scale-110"
                              : isActive
                              ? "bg-brass ring-2 ring-brass/20"
                              : "bg-brass/30 ring-0"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                              isActive ? "bg-ricepaper" : "bg-transparent"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "display text-2xl lg:text-3xl transition-colors duration-500",
                            isActive ? "text-brass font-normal" : "text-mocha/40"
                          )}
                        >
                          {m.year}
                        </span>
                      </div>

                      {/* Content card */}
                      <div
                        className={cn(
                          "rounded-2xl border bg-ricepaper/70 p-6 backdrop-blur-sm transition-all duration-500",
                          isActive
                            ? "opacity-100 translate-y-0 border-brass/30 shadow-soft"
                            : "opacity-30 translate-y-2 border-brass/10"
                        )}
                      >
                        <h3 className="display text-xl lg:text-2xl text-mocha mb-2">
                          {m.title}
                        </h3>
                        <p className="text-sm font-light leading-relaxed text-mocha/70">
                          {m.description || m.desc}
                        </p>
                        {m.image && (
                          <div className="mt-4 arch-mask aspect-[16/10] overflow-hidden bg-oatlinen">
                            <img
                              src={m.image}
                              alt={m.title}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VERTICAL TIMELINE (screens < 768px) */}
      <div className="block md:hidden py-20 px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-10">
            <p className="eyebrow mb-2">The Aurelle Chronicle</p>
            <h2 className="display text-3xl text-mocha">
              A quiet evolution
            </h2>
            <p className="mt-2 text-sm font-light text-mocha/70">
              Vertical trajectory of our aesthetic sanctuaries.
            </p>
          </div>

          <div className="relative pl-8">
            {/* Left vertical timeline track */}
            <div className="absolute left-[7px] top-3 bottom-6 w-px bg-brass/25" />

            <div className="space-y-10">
              {items.map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative group"
                >
                  {/* Left dot positioned on the line */}
                  <div className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass ring-4 ring-brass/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-ricepaper" />
                  </div>

                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="display text-2xl text-brass">{m.year}</span>
                    <span className="eyebrow text-[10px] text-mocha/50">
                      Phase {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-brass/20 bg-oatlinen/20 p-5 backdrop-blur-sm">
                    <h3 className="display text-xl text-mocha mb-2">{m.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-mocha/70">
                      {m.description || m.desc}
                    </p>
                    {m.image && (
                      <div className="mt-4 arch-mask aspect-[16/10] overflow-hidden bg-oatlinen">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}