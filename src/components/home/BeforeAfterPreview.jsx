"use client";

import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";
import { images } from "@/data/images";

export default function BeforeAfterPreview() {
  return (
    <section className="bg-ricepaper py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="The Quiet Reveal"
              title="See the difference, gently"
              description="Drag to reveal the before and after of our signature rejuvenation. Results that read as rest — never as change."
            />
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-mocha/70">
              Every result is composed over time, in conversation with your skin.
              We measure success in calm confidence, not in spectacle.
            </p>
          </div>
          <BeforeAfterSlider src={images.hero} alt="Before and after of signature rejuvenation" />
        </div>
      </div>
    </section>
  );
}