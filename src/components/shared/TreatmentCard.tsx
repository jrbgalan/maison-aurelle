"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ArchImage from "@/components/shared/ArchImage";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";
import { Service } from "@/types";

export interface TreatmentCardProps {
  service: Service;
  index?: number;
  className?: string;
}

export default function TreatmentCard({ service, index = 0, className }: TreatmentCardProps) {
  const reduce = useReducedMotion();
  const hero = service.image || images.treatment;

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group flex flex-col", className)}
    >
      <Link
        href={`/treatments/${service.id}`}
        className="block focus-ring rounded-arch"
        aria-label={`${service.name} — view details`}
      >
        <ArchImage
          src={hero}
          alt={service.tagline}
          gradient={index % 2 === 0 ? "sakura" : "oat"}
          className="aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-6">
        <p className="eyebrow mb-2">{service.category}</p>
        <h3 className="display text-2xl text-mocha">{service.name}</h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-mocha/70">
          {service.tagline}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-body text-mocha/80">{service.priceRange}</span>
          <Link
            href={`/treatments/${service.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-brass hover:text-rose focus-ring rounded-pill"
          >
            Discover <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}