"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import ArchImage from "@/components/shared/ArchImage";
import { galleryItems, galleryCategories } from "@/data/gallery";
import { images, gradients } from "@/data/images";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

export default function GalleryPage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const visible = useMemo(
    () => (active === "All" ? galleryItems : galleryItems.filter((g) => g.category === active)),
    [active]
  );

  const openLightbox = (id) => {
    const idx = visible.findIndex((g) => g.id === id);
    setLightboxIndex(idx);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length]
  );
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)),
    [visible.length]
  );

  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, next, prev]);

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
                eyebrow="The Atelier Gallery"
                title="Moments of stillness"
                description="Textures, light, and quiet results from our Gangnam and Kyoto sanctuaries. Click any frame to step inside."
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-ricepaper pb-24 sm:pb-32">
          <div className="mx-auto max-w-[1200px] px-6">
            {/* Filter pills */}
            <div className="mb-14 flex flex-wrap justify-center gap-2.5">
              {galleryCategories.map((f) => (
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

            {/* Gallery Grid */}
            <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {visible.map((item, i) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease }}
                  onClick={() => openLightbox(item.id)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-arch focus-ring bg-oatlinen shadow-sm"
                  aria-label={`Open ${item.title}`}
                >
                  <ArchImage
                    src={item.image || images.gallery}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-end p-6">
                    <span className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0 text-left">
                      <span className="eyebrow block text-ricepaper/75">{item.category}</span>
                      <span className="display block text-xl text-ricepaper mt-0.5">{item.title}</span>
                    </span>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && visible[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/85 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-ricepaper/15 text-ricepaper transition-colors hover:bg-ricepaper/30 focus-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-ricepaper/15 text-ricepaper transition-colors hover:bg-ricepaper/30 focus-ring sm:left-8"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-ricepaper/15 text-ricepaper transition-colors hover:bg-ricepaper/30 focus-ring sm:right-8"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={visible[lightboxIndex].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className="relative mx-auto max-h-[85vh] w-full max-w-2xl px-6 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[65vh] aspect-[4/5] w-full overflow-hidden rounded-arch shadow-glow bg-oatlinen">
                <img
                  src={visible[lightboxIndex].image || images.gallery}
                  alt={visible[lightboxIndex].title}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-5 text-center">
                <p className="eyebrow text-ricepaper/70">{visible[lightboxIndex].category}</p>
                <p className="display mt-1 text-2xl text-ricepaper">
                  {visible[lightboxIndex].title}
                </p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

