"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import TreatmentCard from "@/components/shared/TreatmentCard";
import { services, serviceCategories } from "@/data/services";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

function TreatmentsContent() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("All");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && serviceCategories.includes(cat)) setActive(cat);
  }, [searchParams]);

  const filters = ["All", ...serviceCategories];
  const visible = useMemo(
    () => (active === "All" ? services : services.filter((s) => s.category === active)),
    [active]
  );

  return (
    <>
      {/* Page header */}
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
              eyebrow="The Treatments"
              title="A considered menu of care"
              description="Each ritual is designed around a single intention — to restore, refine, and reveal the quietest version of you. Explore by concern or by category."
            />
          </motion.div>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="bg-ricepaper pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* category filter pills */}
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
                {f}
              </button>
            ))}
          </div>

          {/* grid */}
          <motion.div
            layout
            className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((service, i) => (
              <TreatmentCard key={service.id} service={service} index={i} />
            ))}
          </motion.div>

          {visible.length === 0 && (
            <p className="mt-10 text-center text-sm font-light text-mocha/60">
              No treatments in this category yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default function TreatmentsPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-brass border-t-transparent animate-spin" /></div>}>
          <TreatmentsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

