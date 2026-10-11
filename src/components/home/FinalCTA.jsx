"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import { images } from "@/data/images";

export default function FinalCTA() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-ricepaper px-6 py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.5rem]">
        <ArchImage
          src={images.ambiance}
          alt="Serene atelier interior with linen seating and a single ikebana branch"
          className="absolute inset-0 h-full w-full"
          rounded="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/40 to-espresso/20" />
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative px-8 py-24 text-center sm:px-16 sm:py-32"
        >
          <p className="eyebrow mb-5 text-sakura/80">Begin your journey</p>
          <h2 className="display text-3xl text-ricepaper sm:text-5xl md:text-6xl">
            Your most luminous self,
            <br /> quietly restored
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-ricepaper/75">
            Reserve a consultation and let our atelier compose a ritual made
            entirely for you.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <BrassButton to="/booking" variant="solid">
              Book a Consultation
            </BrassButton>
            <BrassButton to="/contact" variant="outline" className="border-ricepaper/40 text-ricepaper hover:bg-ricepaper/10">
              Contact the Atelier
            </BrassButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}