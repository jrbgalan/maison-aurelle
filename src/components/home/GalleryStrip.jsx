"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/shared/SectionHeader";
import ArchImage from "@/components/shared/ArchImage";
import { images } from "@/data/images";
import { galleryItems } from "@/data/gallery";

const gradients = ["sakura", "oat", "sage", "rose", "oat", "sakura"];

export default function GalleryStrip() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-oatlinen/40 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="The Gallery"
          title="Moments of stillness"
          description="A quiet strip of textures and light from the atelier — the calm that surrounds every ritual."
        />
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-6">
          {galleryItems.map((g, i) => (
            <motion.div
              key={g.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={i === 0 || i === 3 ? "md:col-span-2" : ""}
            >
              <ArchImage
                src={g.image || (i === 1 ? images.gallery : "")}
                alt={g.title}
                gradient={gradients[i % gradients.length]}
                className="aspect-[4/5] transition-transform duration-700 hover:scale-[1.03]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}