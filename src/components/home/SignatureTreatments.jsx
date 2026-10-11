"use client";

import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import TreatmentCard from "@/components/shared/TreatmentCard";
import BrassButton from "@/components/shared/BrassButton";
import { services } from "@/data/services";

export default function SignatureTreatments() {
  const featured = services.filter((s) => s.featured).slice(0, 4);
  return (
    <section className="bg-ricepaper py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="Signature Rituals"
          title="Treatments, composed with care"
          description="Six families of treatment, each a quiet conversation between science and serenity — refined for an undetectable, lasting result."
        />
        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s, i) => (
            <TreatmentCard key={s.id} service={s} index={i} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <BrassButton to="/treatments" variant="outline">
            View all treatments
          </BrassButton>
        </div>
      </div>
    </section>
  );
}