"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const t = testimonials[i];

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-ricepaper py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader eyebrow="In Their Words" title="Quiet confidence, spoken softly" />
        <div className="relative mt-14 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              <Quote className="mx-auto mb-6 h-8 w-8 text-brass/60" />
              <p className="display text-2xl font-light italic leading-relaxed text-mocha sm:text-3xl">
                “{t.quote}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-1 text-brass">
                {Array.from({ length: t.rating }).map((_, d) => (
                  <Star key={d} className="h-4 w-4 fill-brass" />
                ))}
              </div>
              <p className="mt-4 eyebrow text-mocha/60">
                {t.name} · {t.treatment} · {t.location}
              </p>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((item, d) => (
            <button
              key={item.id}
              onClick={() => setI(d)}
              aria-label={`Show testimonial ${d + 1}`}
              className={cn(
                "h-1.5 rounded-pill transition-all duration-500 focus-ring",
                d === i ? "w-8 bg-brass" : "w-3 bg-brass/30 hover:bg-brass/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}