"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import ArchImage from "@/components/shared/ArchImage";
import { journalArticles, journalCategories } from "@/data/journal";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function JournalPage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("All");

  const visible = useMemo(
    () => (active === "All" ? journalArticles : journalArticles.filter((a) => a.category === active)),
    [active]
  );

  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <>
      <Navbar />
      <main>
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
                eyebrow="The Aurelle Journal"
                title="Essays on stillness & skin"
                description="Reflections from our doctors and aestheticians on restraint, the architecture of calm, and the science of compounding radiance."
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-ricepaper pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1200px] px-6">
            {/* Category filter */}
            <div className="mb-14 flex flex-wrap justify-center gap-2.5">
              {journalCategories.map((f) => (
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

            {/* Featured */}
            {featured && (
              <motion.article
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="mb-16"
              >
                <Link
                  href={`/journal/${featured.id}`}
                  className="group grid items-center gap-8 rounded-[2rem] border border-brass/20 bg-oatlinen/40 p-6 sm:p-8 md:grid-cols-2 md:gap-12 transition-all hover:border-brass/40 hover:bg-ricepaper shadow-sm"
                >
                  <ArchImage
                    src={featured.image || images.hero}
                    alt={featured.title}
                    className="aspect-[4/3] w-full rounded-arch transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div>
                    <p className="eyebrow mb-3">Featured · {featured.category}</p>
                    <h2 className="display text-3xl text-mocha sm:text-4xl group-hover:text-brass transition-colors">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-base font-light leading-relaxed text-mocha/70">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-light text-mocha/50">
                        {formatDate(featured.date)} · {featured.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-brass group-hover:text-rose transition-colors">
                        Read essay <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Grid */}
            <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article, i) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="flex flex-col"
                >
                  <Link
                    href={`/journal/${article.id}`}
                    className="group block flex-1 rounded-[2rem] border border-brass/20 bg-oatlinen/40 p-6 transition-all duration-500 hover:border-brass/40 hover:bg-ricepaper focus-ring"
                  >
                    <ArchImage
                      src={article.image || images.treatment}
                      alt={article.title}
                      className="aspect-[16/10] w-full rounded-2xl mb-5 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <p className="eyebrow mb-2">{article.category}</p>
                    <h3 className="display text-2xl text-mocha group-hover:text-brass transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-mocha/70 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="mt-5 text-xs font-light text-mocha/50">
                      {formatDate(article.date)} · {article.readTime}
                    </p>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

