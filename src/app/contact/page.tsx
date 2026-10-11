"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import { site } from "@/data/site";

const ease = [0.22, 1, 0.36, 1];

export default function ContactPage() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Thank you — our concierge will respond within the day.");
    }, 700);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full glow-radial opacity-60" />
          </div>
          <div className="mx-auto max-w-[1200px] px-6 pb-16">
            <SectionHeader
              eyebrow="Contact"
              title="Reach the concierge"
              description="Whether you are planning your first visit or simply have a quiet question, we are here — and we answer with care."
            />
          </div>
        </section>

        <section className="bg-ricepaper pb-24 sm:pb-32">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-12 md:gap-10">
            {/* Form */}
            <motion.div
              className="md:col-span-7"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <form
                onSubmit={submit}
                className="rounded-[2rem] border border-brass/20 bg-oatlinen/40 p-6 sm:p-10 shadow-sm"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="eyebrow mb-2 block text-mocha/60">Your name</span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      className="input-field"
                      placeholder="Eun-ji Kim"
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow mb-2 block text-mocha/60">Email</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={update("email")}
                      className="input-field"
                      placeholder="eunji@example.com"
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="eyebrow mb-2 block text-mocha/60">Subject</span>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={update("subject")}
                    className="input-field"
                    placeholder="Consultation inquiry / general question"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="eyebrow mb-2 block text-mocha/60">Message</span>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={update("message")}
                    className="input-field resize-none"
                    placeholder="Tell us what you are hoping to explore…"
                  />
                </label>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center rounded-pill bg-brass px-8 py-3 text-sm font-body font-medium tracking-wide text-ricepaper shadow-soft transition-all duration-500 hover:bg-rose focus-ring disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Atelier Info */}
            <motion.div
              className="space-y-6 md:col-span-5"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <InfoBlock icon={MapPin} title="Atelier Location">
                <p>{site.address}</p>
                <p className="mt-2 text-xs font-light text-mocha/55">
                  Valet parking available upon arrival
                </p>
              </InfoBlock>

              <InfoBlock icon={Clock} title="Atelier Hours">
                <ul className="space-y-1.5">
                  {site.hours.map((h) => (
                    <li key={h.day} className="flex justify-between">
                      <span>{h.day}</span>
                      <span className="font-light text-mocha/60">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </InfoBlock>

              <InfoBlock icon={Phone} title="Direct Inquiries">
                <p>{site.phone}</p>
                <p className="mt-1 text-xs text-mocha/55">Concierge desk open daily</p>
              </InfoBlock>

              <InfoBlock icon={Mail} title="Electronic Letter">
                <p>{site.email}</p>
              </InfoBlock>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoBlock({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[1.75rem] border border-brass/20 bg-oatlinen/40 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sakura/50 text-brass">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="display text-xl text-mocha">{title}</h3>
      </div>
      <div className="mt-4 text-sm font-light leading-relaxed text-mocha/70">
        {children}
      </div>
    </div>
  );
}

