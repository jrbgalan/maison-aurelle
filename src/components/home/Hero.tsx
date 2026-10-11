"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import { images } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const reveal = (delay) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } }
      : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } };

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* slow-moving soft gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full glow-radial animate-slow-pulse" />
        <div className="absolute bottom-0 right-0 h-[60vh] w-[60vh] rounded-full glow-radial opacity-70" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-24 md:grid-cols-12 md:gap-8 md:pb-32">
        <div className="md:col-span-7 lg:col-span-6">
          <motion.p className="eyebrow mb-6" {...reveal(0.05)}>
            Seoul · Kyoto · Quiet Luxury Atelier
          </motion.p>
          <motion.h1 className="display text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-7xl" {...reveal(0.12)}>
            An atelier of
            <br />
            <span className="italic text-brass">luminous</span> restraint
          </motion.h1>
          <motion.p
            className="mt-7 max-w-md text-base font-light leading-relaxed text-mocha/70"
            {...reveal(0.22)}
          >
            A boutique beauty and skin sanctuary in the spirit of a luxury hotel
            spa — where science meets stillness, and refinement is always invisible.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-4" {...reveal(0.32)}>
            <BrassButton to="/booking" variant="solid">
              Book a Consultation
            </BrassButton>
            <BrassButton to="/treatments" variant="outline">
              Explore Treatments <ArrowRight className="h-4 w-4" />
            </BrassButton>
          </motion.div>

          <motion.div className="mt-12 flex items-center gap-8" {...reveal(0.42)}>
            <div>
              <p className="display text-3xl text-mocha">12k+</p>
              <p className="eyebrow mt-1 text-mocha/55">Guests cared for</p>
            </div>
            <div className="h-10 w-px bg-brass/30" />
            <div>
              <p className="display text-3xl text-mocha">98%</p>
              <p className="eyebrow mt-1 text-mocha/55">Would return</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="md:col-span-5 lg:col-span-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease }}
        >
          <div className="relative mx-auto max-w-md md:ml-auto md:mr-0">
            <ArchImage
              src={images.hero}
              alt="Serene guest resting in soft morning light, monstera shadow across dewy skin"
              className="aspect-[3/4] shadow-glow"
              focalPointY={0.4}
            />
            <div className="absolute -left-6 bottom-10 hidden rounded-pill bg-ricepaper/90 px-5 py-3 shadow-soft backdrop-blur sm:block">
              <p className="eyebrow text-mocha/55">Signature ritual</p>
              <p className="display text-lg text-mocha">The Luminous Reset</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}