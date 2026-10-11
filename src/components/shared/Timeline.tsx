"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { milestones } from "@/data/milestones";
import { cn } from "@/lib/utils";
import { Milestone } from "@/types";

export interface TimelineProps {
  items?: Milestone[];
  className?: string;
}

export default function Timeline({ items = milestones, className }: TimelineProps) {
  const trackRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={trackRef}
      className={cn(
        "relative h-[320vh] sm:h-[280vh]",
        className
      )}
      aria-label="Clinic milestones timeline"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <p className="eyebrow mb-3">The Aurelle Chronicle</p>
          <h2 className="display mb-10 text-3xl sm:text-4xl md:text-5xl">
            A quiet evolution
          </h2>

          {/* progress filament */}
          <div className="relative mb-12 h-px w-full bg-brass/20">
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "0% 50%" }}
              className="absolute inset-0 h-px bg-brass"
            />
          </div>

          {/* horizontal scroll of years */}
          <div className="-mx-6 overflow-x-auto no-scrollbar px-6">
            <ol className="flex gap-8 sm:gap-14">
              {items.map((m, i) => (
                <TimelineItem key={m.id || i} item={m} index={i} reduce={reduce} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index, reduce }: { item: Milestone; index: number; reduce: boolean | null }) {
  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[78vw] shrink-0 sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-brass" />
        <span className="display text-2xl text-brass">{item.year}</span>
      </div>
      <h3 className="display text-xl text-mocha">{item.title}</h3>
      <p className="mt-3 text-sm font-light leading-relaxed text-mocha/70">
        {item.description || item.desc}
      </p>
    </motion.li>
  );
}