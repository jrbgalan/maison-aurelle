"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ease = [0.22, 1, 0.36, 1];

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalLayoutProps {
  title: string;
  updated?: string;
  intro?: string;
  sections: LegalSection[];
}

export default function LegalLayout({ title, updated, intro, sections }: LegalLayoutProps) {
  const reduce = useReducedMotion();
  return (
    <>
      <Navbar />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-[900px] px-6 pb-24 sm:pb-32">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="eyebrow mb-4">Legal</p>
            <h1 className="display text-4xl sm:text-5xl text-mocha">{title}</h1>
            {updated && (
              <p className="mt-3 text-sm font-light text-mocha/50">Last updated: {updated}</p>
            )}
            {intro && (
              <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-mocha/70">
                {intro}
              </p>
            )}
          </motion.div>

          <div className="mt-14 space-y-12">
            {sections.map((s, i) => (
              <motion.section
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease }}
              >
                <h2 className="display mb-4 text-2xl text-mocha">{s.heading}</h2>
                <div className="space-y-4 text-sm font-light leading-relaxed text-mocha/70">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {s.list && (
                    <ul className="space-y-2 pl-1">
                      {s.list.map((li, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.section>
            ))}
          </div>

          <p className="mt-16 border-t border-brass/20 pt-8 text-sm font-light text-mocha/50">
            Questions about this policy? Reach our concierge at concierge@maisonaurelle.example.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}