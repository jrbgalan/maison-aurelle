"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles, HeartPulse, ListChecks } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/data/services";
import { images } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];

export default function TreatmentDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const reduce = useReducedMotion();
  const service = services.find((s) => s.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-32">
          <div className="text-center">
            <p className="eyebrow mb-4">Not found</p>
            <h1 className="display mb-6 text-3xl text-mocha">
              This treatment is no longer listed
            </h1>
            <BrassButton href="/treatments" variant="outline">
              <ArrowLeft className="h-4 w-4" /> All treatments
            </BrassButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = services.filter((s) => s.id !== service.id).slice(0, 3);
  const heroImage = service.image || images.treatment;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full glow-radial opacity-60" />
          </div>
          <div className="mx-auto max-w-[1200px] px-6 pb-16">
            <Link
              href="/treatments"
              className="mb-8 inline-flex items-center gap-2 text-sm font-light text-mocha/60 transition-colors hover:text-brass focus-ring rounded-pill"
            >
              <ArrowLeft className="h-4 w-4" /> All treatments
            </Link>

            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
              <motion.div
                className="md:col-span-7"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
              >
                <p className="eyebrow mb-4">{service.category}</p>
                <h1 className="display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  {service.name}
                </h1>
                <p className="mt-4 text-xl font-heading font-light italic text-brass">
                  {service.tagline}
                </p>
                <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mocha/70">
                  {service.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <BrassButton href={`/booking?service=${service.id}`} variant="solid">
                    Book this treatment
                  </BrassButton>
                  <BrassButton href="/contact" variant="outline">
                    Ask the concierge
                  </BrassButton>
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-5"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15, ease }}
              >
                <ArchImage
                  src={heroImage}
                  alt={service.tagline}
                  className="aspect-[3/4] shadow-glow"
                  focalPointY={0.4}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* At-a-glance meta */}
        <section className="bg-oatlinen/50 py-12">
          <div className="mx-auto grid max-w-[1200px] gap-6 px-6 sm:grid-cols-3">
            <MetaTile icon={Clock} label="Duration" value={service.duration} />
            <MetaTile icon={HeartPulse} label="Recovery" value={service.recovery} />
            <MetaTile icon={Sparkles} label="Investment" value={service.priceRange} />
          </div>
        </section>

        {/* Benefits & Process */}
        <section className="bg-ricepaper py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-16 px-6 md:grid-cols-2 md:gap-20">
            <div>
              <p className="eyebrow mb-3">Intentions</p>
              <h2 className="display text-3xl sm:text-4xl">What to expect</h2>
              <ul className="mt-8 space-y-4">
                {service.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sakura text-brass text-xs">
                      ✦
                    </span>
                    <span className="text-base font-light text-mocha/80">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-3">The Protocol</p>
              <h2 className="display text-3xl sm:text-4xl">The movements</h2>
              <ol className="mt-8 space-y-5">
                {service.processSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/40 text-sm text-brass">
                      0{i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-base font-light text-mocha/85">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {service.faq && service.faq.length > 0 && (
          <section className="bg-oatlinen/30 py-20 sm:py-28">
            <div className="mx-auto max-w-[800px] px-6">
              <p className="eyebrow mb-3 text-center">Inquiries</p>
              <h2 className="display text-center text-3xl sm:text-4xl">
                Common questions
              </h2>
              <Accordion type="single" collapsible className="mt-12 space-y-3">
                {service.faq.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-2xl border border-brass/25 bg-ricepaper/70 px-6 py-2"
                  >
                    <AccordionTrigger className="text-left font-heading text-lg font-light text-mocha hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm font-light leading-relaxed text-mocha/70">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Related Treatments */}
        {related.length > 0 && (
          <section className="bg-ricepaper py-24 sm:py-32">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="eyebrow mb-3">Discover More</p>
                  <h2 className="display text-3xl sm:text-4xl">Companion rituals</h2>
                </div>
                <Link
                  href="/treatments"
                  className="hidden text-sm font-light text-brass hover:text-rose sm:inline-block focus-ring rounded-pill"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/treatments/${s.id}`}
                    className="group rounded-3xl border border-brass/25 bg-oatlinen/40 p-6 transition-all duration-500 hover:border-brass hover:bg-ricepaper shadow-sm"
                  >
                    <ArchImage
                      src={s.image || images.treatment}
                      alt={s.name}
                      className="aspect-[4/3] rounded-2xl mb-4"
                    />
                    <p className="eyebrow mb-1 text-mocha/60">{s.category}</p>
                    <h3 className="display text-xl text-mocha group-hover:text-brass transition-colors">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-xs font-light text-mocha/70 line-clamp-2">
                      {s.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function MetaTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-brass/20 bg-ricepaper/70 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sakura/50 text-brass">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="eyebrow text-mocha/50">{label}</p>
        <p className="font-heading text-lg font-light text-mocha">{value}</p>
      </div>
    </div>
  );
}

