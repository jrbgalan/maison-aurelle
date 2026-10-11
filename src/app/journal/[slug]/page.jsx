"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchImage from "@/components/shared/ArchImage";
import BrassButton from "@/components/shared/BrassButton";
import { journalArticles } from "@/data/journal";
import { images } from "@/data/images";

const ease = [0.22, 1, 0.36, 1];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function JournalArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const reduce = useReducedMotion();
  const article = journalArticles.find((a) => a.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center px-6 pt-32">
          <div className="text-center">
            <p className="eyebrow mb-4">Not found</p>
            <h1 className="display mb-6 text-3xl text-mocha">This essay is no longer available</h1>
            <BrassButton href="/journal" variant="outline">
              <ArrowLeft className="h-4 w-4" /> The Journal
            </BrassButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = journalArticles.filter((a) => a.id !== article.id).slice(0, 3);
  const coverImage = article.image || images.hero;

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full glow-radial opacity-60" />
          </div>
          <div className="mx-auto max-w-[800px] px-6 pb-12">
            <Link
              href="/journal"
              className="mb-8 inline-flex items-center gap-2 text-sm font-light text-mocha/60 transition-colors hover:text-brass focus-ring rounded-pill"
            >
              <ArrowLeft className="h-4 w-4" /> The Journal
            </Link>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="eyebrow mb-4">{article.category}</p>
              <h1 className="display text-4xl leading-[1.08] sm:text-5xl">{article.title}</h1>
              <p className="mt-5 text-base font-light leading-relaxed text-mocha/65">
                {article.excerpt}
              </p>
              <p className="mt-5 text-sm font-light text-mocha/45">
                {formatDate(article.date)} · {article.readTime} read
              </p>
            </motion.div>
          </div>
        </section>

        {/* Cover */}
        <div className="mx-auto max-w-[900px] px-6">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="aspect-[16/9] w-full overflow-hidden rounded-arch shadow-glow bg-oatlinen"
          >
            <ArchImage
              src={coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        {/* Body */}
        <article className="bg-ricepaper py-16 sm:py-24">
          <div className="mx-auto max-w-[680px] px-6">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="display mt-10 mb-4 text-2xl text-mocha" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="display mt-8 mb-3 text-xl text-mocha" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-5 text-base font-light leading-relaxed text-mocha/75" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="my-8 border-l-2 border-brass pl-6 font-heading text-xl italic text-mocha/90"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="my-5 list-disc space-y-2 pl-6 text-sm font-light text-mocha/75" {...props} />
                ),
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="border-t border-brass/20 bg-oatlinen/40 py-20 sm:py-28">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="eyebrow mb-2">Further Reading</p>
                  <h2 className="display text-3xl sm:text-4xl">More from the atelier</h2>
                </div>
                <Link
                  href="/journal"
                  className="text-sm font-light text-brass hover:text-rose transition-colors"
                >
                  All essays →
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/journal/${r.id}`}
                    className="group rounded-3xl border border-brass/20 bg-ricepaper/70 p-6 transition-all hover:border-brass hover:bg-ricepaper"
                  >
                    <ArchImage
                      src={r.image || images.treatment}
                      alt={r.title}
                      className="aspect-[16/10] w-full rounded-2xl mb-4"
                    />
                    <p className="eyebrow text-mocha/50">{r.category}</p>
                    <h3 className="display text-xl text-mocha group-hover:text-brass transition-colors mt-2">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs font-light text-mocha/65 line-clamp-2">
                      {r.excerpt}
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

