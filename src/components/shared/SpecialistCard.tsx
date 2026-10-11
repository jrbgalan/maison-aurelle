"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ArchImage from "@/components/shared/ArchImage";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";
import { Specialist } from "@/types";

export interface SpecialistCardProps {
  specialist: Specialist;
  index?: number;
  className?: string;
}

export default function SpecialistCard({ specialist, index = 0, className }: SpecialistCardProps) {
  const reduce = useReducedMotion();
  const photo = specialist.image || images.specialist;

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group", className)}
    >
      <Link
        href={`/specialists/${specialist.id}`}
        className="block focus-ring rounded-arch"
        aria-label={`${specialist.name}, ${specialist.title}`}
      >
        <ArchImage
          src={photo}
          alt={`${specialist.name}, ${specialist.title}`}
          gradient="sage"
          className="aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-5">
        <p className="eyebrow mb-2">{specialist.role}</p>
        <h3 className="display text-2xl text-mocha">{specialist.name}</h3>
        <p className="mt-1 text-sm font-light text-mocha/70">{specialist.title}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-body text-mocha/60">
          <span>{specialist.specialty}</span>
          <span className="text-brass">·</span>
          <span>{specialist.yearsExperience} yrs</span>
          <span className="text-brass">·</span>
          <span>{specialist.languages.join(", ")}</span>
        </div>
      </div>
    </motion.article>
  );
}