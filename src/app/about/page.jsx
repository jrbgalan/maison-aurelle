"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import StatCard from "@/components/shared/StatCard";
import Timeline from "@/components/shared/Timeline";
import { stats } from "@/data/stats";
import { images } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];

export default function AboutPage() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full glow-radial opacity-60" />
          </div>
          <div className="mx-auto max-w-[1200px] px-6 pb-20">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="max-w-3xl"
            >
              <p className="eyebrow mb-5">Our Story</p>
              <h1 className="display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                A house built on
                <br />
                <span className="italic text-brass">luminous restraint</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg font-light leading-relaxed text-mocha/70">
                Maison Aurelle began in 2014 as a single serene room in Gangnam — a
                quiet protest against the loud, the rushed, and the overdone. Twelve
                years later, two ateliers and twelve thousand guests later, the
                philosophy has not changed. Only deepened.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy split */}
        <section className="bg-oatlinen/50 py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <ArchImage
                src={images.ambiance}
                alt="The serene atelier interior in soft morning light"
                className="aspect-[4/5] shadow-glow"
                focalPointY={0.4}
              />
            </motion.div>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="eyebrow mb-4">Our Philosophy</p>
              <h2 className="display mb-6 text-3xl sm:text-4xl text-mocha">
                Refinement, made invisible
              </h2>
              <div className="space-y-5 text-base font-light leading-relaxed text-mocha/70">
                <p>
                  We believe the best aesthetic result is the one no one notices —
                  the guest who simply looks rested, well, and like themselves.
                </p>
                <p>
                  We believe a treatment room should feel like a sanctuary, not a
                  clinic — because the body heals where it feels safe.
                </p>
                <p>
                  And we believe science and stillness are not opposites. They are
                  partners. The medicine is rigorous. The experience is gentle. Both
                  matter.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section ref={ref} className="bg-ricepaper py-24 sm:py-32">
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionHeader
              eyebrow="By the Numbers"
              title="A quiet record of trust"
            />
            <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-6">
              {stats.map((s) => (
                <StatCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <Timeline />

        {/* CTA */}
        <section className="bg-oatlinen/50 py-24 sm:py-32">
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="eyebrow mb-4">Begin your journey</p>
              <h2 className="display mb-8 text-3xl sm:text-4xl md:text-5xl text-mocha">
                We would be honoured to welcome you
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <BrassButton href="/booking" variant="solid">
                  Book a Consultation <ArrowRight className="h-4 w-4" />
                </BrassButton>
                <BrassButton href="/contact" variant="outline">
                  Contact the concierge
                </BrassButton>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

