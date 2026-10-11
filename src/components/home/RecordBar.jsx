"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { stats } from "@/data/stats";
import { cn } from "@/lib/utils";

const N = stats.length;

function useCountUp(target, active, duration = 1400, reduce) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);
  return value;
}

function StatNumber({ stat, active, reduce }) {
  const value = useCountUp(stat.value, active, 1400, reduce);
  return (
    <p
      className={cn(
        "display text-3xl sm:text-4xl md:text-5xl tabular-nums transition-colors duration-700",
        active ? "text-mocha" : "text-mocha/25"
      )}
    >
      {value.toLocaleString("en-US")}
      {stat.suffix && (
        <span className={cn("transition-colors duration-700", active ? "text-brass" : "text-brass/40")}>
          {stat.suffix}
        </span>
      )}
    </p>
  );
}

function SummaryLine({ index, reduce }) {
  const parts = stats[index].summaryParts;
  return (
    <motion.p
      key={index}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-lg sm:text-xl font-body font-light text-mocha/70"
    >
      {parts.map((seg, i) =>
        seg.bold ? (
          <span key={i} className="font-medium text-mocha">
            {seg.text}
          </span>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </motion.p>
  );
}

export default function RecordBar() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 35%"],
  });

  // Latched activation: progress only ever increases the active count,
  // so scrolling back up slightly never deactivates a stat (no flicker).
  const [maxProgress, setMaxProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setMaxProgress((prev) => (v > prev ? v : prev));
  });

  const currentActive = reduce
    ? N - 1
    : Math.min(Math.floor(maxProgress * N), N - 1);
  const fillScale = reduce ? 1 : scrollYProgress;

  return (
    <div ref={ref} className="mt-16">
      {/* Dynamic summary — cross-fades to the currently active stat */}
      <div className="mx-auto mb-12 min-h-[3.5rem] max-w-3xl text-center">
        <AnimatePresence mode="wait">
          <SummaryLine key={currentActive} index={currentActive} reduce={reduce} />
        </AnimatePresence>
      </div>

      {/* ---------- Desktop: horizontal track ---------- */}
      <div className="hidden md:block">
        <div className="relative pt-5">
          {/* track + fill */}
          <div className="absolute left-0 right-0 top-0 h-px bg-oatlinen" />
          <motion.div
            style={{ scaleX: fillScale, transformOrigin: "0% 50%" }}
            className="absolute left-0 top-0 h-px bg-brass"
          />
          {/* ticks + stats */}
          <div className="grid grid-cols-5 gap-6">
            {stats.map((s, i) => {
              const active = i <= currentActive;
              return (
                <div key={s.id} className="relative">
                  <span
                    className={cn(
                      "absolute -top-5 left-0 h-3 w-px transition-colors duration-700",
                      active ? "bg-brass" : "bg-oatlinen"
                    )}
                  />
                  <StatNumber stat={s} active={active} reduce={reduce} />
                  <p
                    className={cn(
                      "eyebrow mt-3 transition-opacity duration-700",
                      active ? "opacity-100" : "opacity-30"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Mobile: vertical track ---------- */}
      <div className="md:hidden">
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-oatlinen" />
          <motion.div
            style={{ scaleY: fillScale, transformOrigin: "0% 0%" }}
            className="absolute left-0 top-0 w-px bg-brass"
          />
          <div className="space-y-9">
            {stats.map((s, i) => {
              const active = i <= currentActive;
              return (
                <div key={s.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-8 top-1 h-3 w-px transition-colors duration-700",
                      active ? "bg-brass" : "bg-oatlinen"
                    )}
                  />
                  <StatNumber stat={s} active={active} reduce={reduce} />
                  <p
                    className={cn(
                      "eyebrow mt-2 transition-opacity duration-700",
                      active ? "opacity-100" : "opacity-30"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}