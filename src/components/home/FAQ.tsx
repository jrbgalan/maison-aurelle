"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/shared/SectionHeader";
import { homeFaq } from "@/data/faq";

export default function FAQ() {
  return (
    <section className="bg-ricepaper py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="Good to Know"
              title="Quiet answers"
              description="The small details that make a visit feel considered. Anything else, our concierge will gladly answer."
            />
          </div>
          <div className="md:col-span-7">
            <Accordion type="single" collapsible className="w-full">
              {homeFaq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-brass/20"
                >
                  <AccordionTrigger className="py-5 text-left font-heading text-lg font-light text-mocha hover:no-underline focus-ring rounded-pill">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm font-light leading-relaxed text-mocha/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}