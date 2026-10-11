"use client";

import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import SpecialistCard from "@/components/shared/SpecialistCard";
import BrassButton from "@/components/shared/BrassButton";
import { specialists } from "@/data/specialists";

export default function FeaturedSpecialists() {
  const featured = specialists.slice(0, 4);
  return (
    <section className="bg-oatlinen/40 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="The Atelier"
          title="Guided by devoted hands"
          description="Doctors, aestheticians, and nurses — each chosen for their precision, their calm, and their belief in invisible refinement."
        />
        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s, i) => (
            <SpecialistCard key={s.id} specialist={s} index={i} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <BrassButton to="/specialists" variant="outline">
            Meet the full atelier
          </BrassButton>
        </div>
      </div>
    </section>
  );
}