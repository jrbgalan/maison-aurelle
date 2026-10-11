"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  className?: string;
}

function useCountUp(target: number, inView: boolean, duration = 2000, reduce: boolean | null = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduce]);
  return value;
}

function formatValue(v: number): string {
  return v.toLocaleString("en-US");
}

export default function StatCard({ label, value, suffix = "", className }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const display = useCountUp(value, inView, 1800, reduce);
  return (
    <div
      ref={ref}
      className={cn("text-center sm:text-left", className)}
    >
      <p className="display text-4xl md:text-5xl text-mocha tabular-nums">
        {formatValue(display)}
        <span className="text-brass">{suffix}</span>
      </p>
      <p className="eyebrow mt-3 text-mocha/55">{label}</p>
    </div>
  );
}