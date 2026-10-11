"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Award, Globe, CalendarDays, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import { specialists } from "@/data/specialists";
import { images } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];

export default function SpecialistDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const reduce = useReducedMotion();
  const specialist = specialists.find((s) => s.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!specialist) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-32">
          <div className="text-center">
            <p className="eyebrow mb-4">Not found</p>
            <h1 className="display mb-6 text-3xl text-mocha">Specialist not listed</h1>
            <BrassButton href="/specialists" variant="outline">
              <ArrowLeft className="h-4 w-4" /> All specialists
            </BrassButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const otherSpecialists = specialists.filter((s) => s.id !== specialist.id).slice(0, 3);
  const photo = specialist.image || images.specialist;

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
              href="/specialists"
              className="mb-8 inline-flex items-center gap-2 text-sm font-light text-mocha/60 transition-colors hover:text-brass focus-ring rounded-pill"
            >
              <ArrowLeft className="h-4 w-4" /> All specialists
            </Link>

            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
              <motion.div
                className="md:col-span-5"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease }}
              >
                <ArchImage
                  src={photo}
                  alt={specialist.name}
                  className="aspect-[3/4] shadow-glow"
                  focalPointY={0.35}
                />
              </motion.div>

              <motion.div
                className="md:col-span-7"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
              >
                <p className="eyebrow mb-4">{specialist.role}</p>
                <h1 className="display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  {specialist.name}
                </h1>
                <p className="mt-3 text-xl font-heading font-light italic text-brass">
                  {specialist.title}
                </p>
                <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-mocha/70">
                  {specialist.bio}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <InfoTile icon={Award} label="Specialty" value={specialist.specialty} />
                  <InfoTile icon={Globe} label="Languages" value={specialist.languages.join(", ")} />
                  <InfoTile icon={CalendarDays} label="Schedule" value={specialist.schedule} />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <BrassButton href={`/booking?specialist=${specialist.id}`} variant="solid">
                    Book with {specialist.name.split(" ").slice(-1)[0]}
                  </BrassButton>
                  <BrassButton href="/contact" variant="outline">
                    Ask a question
                  </BrassButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-oatlinen/50 py-16 sm:py-24">
          <div className="mx-auto max-w-[800px] px-6">
            <p className="eyebrow mb-3 text-center">Background & Mastery</p>
            <h2 className="display text-center text-3xl sm:text-4xl">
              Credentials & qualifications
            </h2>
            <div className="mt-10 divide-y divide-brass/20 rounded-3xl border border-brass/25 bg-ricepaper/70 p-6 sm:p-8">
              {specialist.credentials.map((c, i) => (
                <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brass" />
                  <span className="text-base font-light text-mocha/80">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Specialists */}
        {otherSpecialists.length > 0 && (
          <section className="bg-ricepaper py-20 sm:py-28">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="eyebrow mb-2">The Atelier</p>
                  <h2 className="display text-3xl sm:text-4xl">Meet other practitioners</h2>
                </div>
                <Link
                  href="/specialists"
                  className="text-sm font-light text-brass hover:text-rose transition-colors"
                >
                  View all →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {otherSpecialists.map((s) => (
                  <Link
                    key={s.id}
                    href={`/specialists/${s.id}`}
                    className="group rounded-3xl border border-brass/20 bg-oatlinen/30 p-5 transition-all hover:border-brass hover:bg-ricepaper"
                  >
                    <ArchImage
                      src={s.image || images.specialist}
                      alt={s.name}
                      className="aspect-[4/3] rounded-2xl mb-4"
                    />
                    <p className="eyebrow text-mocha/50">{s.role}</p>
                    <h3 className="display text-xl text-mocha group-hover:text-brass transition-colors mt-1">
                      {s.name}
                    </h3>
                    <p className="text-xs font-light text-mocha/65 mt-1">{s.title}</p>
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

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-brass/20 bg-oatlinen/40 p-4">
      <div className="flex items-center gap-2 text-brass">
        <Icon className="h-4 w-4" />
        <span className="eyebrow text-[0.65rem] text-mocha/55">{label}</span>
      </div>
      <p className="mt-2 text-sm font-light text-mocha">{value}</p>
    </div>
  );
}

