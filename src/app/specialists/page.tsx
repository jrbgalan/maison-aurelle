"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import SpecialistCard from "@/components/shared/SpecialistCard";
import { specialists, specialistRoles } from "@/data/specialists";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

export default function SpecialistsPage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("All");
  const filters = ["All", ...specialistRoles];

  const visible = useMemo(
    () => (active === "All" ? specialists : specialists.filter((s) => s.role === active)),
    [active]
  );

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full glow-radial opacity-60" />
          </div>
          <div className="mx-auto max-w-[1200px] px-6 pb-16">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <SectionHeader
                eyebrow="The Atelier"
                title="The hands behind the care"
                description="A small, devoted team of doctors, aestheticians, and nurses — each chosen as much for their stillness as for their skill."
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-ricepaper pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 flex flex-wrap justify-center gap-2.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={cn(
                    "rounded-pill border px-5 py-2 text-sm font-body font-light tracking-wide transition-all duration-300 focus-ring",
                    active === f
                      ? "border-brass bg-brass text-ricepaper"
                      : "border-brass/30 text-mocha/70 hover:border-brass hover:text-mocha"
                  )}
                >
                  {f === "All" ? "All" : f + "s"}
                </button>
              ))}
            </div>

            <motion.div layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((s, i) => (
                <SpecialistCard key={s.id} specialist={s} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

