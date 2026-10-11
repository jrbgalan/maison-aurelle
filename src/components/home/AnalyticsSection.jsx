"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import RecordBar from "@/components/home/RecordBar";
import SectionHeader from "@/components/shared/SectionHeader";
import { clientsByYear } from "@/data/stats";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-pill border border-brass/30 bg-ricepaper/95 px-4 py-2 shadow-soft backdrop-blur">
      <p className="eyebrow text-mocha/55">{label}</p>
      <p className="display text-lg text-mocha">{payload[0].value.toLocaleString()} guests</p>
    </div>
  );
}

export default function AnalyticsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="bg-oatlinen/50 py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader
          eyebrow="The Aurelle Record"
          title="A quiet record of trust"
          description="Twelve years of careful, science-led care — measured not in volume, but in the calm confidence of those we have served."
        />

        <RecordBar />

        <div className="mt-20 rounded-[2rem] border border-brass/20 bg-ricepaper/60 p-6 sm:p-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Guests welcomed, by year</p>
              <h3 className="display text-2xl text-mocha">A gentle, growing curve</h3>
            </div>
            <p className="text-sm font-light text-mocha/55">
              From one serene room to two ateliers
            </p>
          </div>
          <div className="h-72 w-full">
            {inView && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clientsByYear} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aurelleFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(6 30% 70%)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="hsl(8 44% 88%)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(21 28% 58% / 0.15)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "hsl(14 15% 20% / 0.55)", fontSize: 12, fontFamily: "Jost" }}
                    axisLine={{ stroke: "hsl(21 28% 58% / 0.3)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(14 15% 20% / 0.55)", fontSize: 12, fontFamily: "Jost" }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(21 28% 58% / 0.4)" }} />
                  <Area
                    type="monotone"
                    dataKey="clients"
                    stroke="hsl(21 28% 58%)"
                    strokeWidth={2}
                    fill="url(#aurelleFill)"
                    isAnimationActive={!reduce}
                    animationDuration={1800}
                    animationEasing="ease-out"
                    dot={{ r: 3, fill: "hsl(21 28% 58%)", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "hsl(6 30% 70%)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}