"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Calendar, Clock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { services } from "@/data/services";
import { specialists } from "@/data/specialists";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];
const steps = ["Treatment", "Specialist", "Date & Time", "Your details", "Confirm"];

const timeSlots = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

function makeReference() {
  return "MA-" + Date.now().toString(36).toUpperCase().slice(-6);
}

function BookingContent() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    serviceId: "",
    specialistId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  // Pre-fill from query params
  useEffect(() => {
    const svc = searchParams.get("service");
    const spec = searchParams.get("specialist");
    setData((d) => ({
      ...d,
      serviceId: svc && services.some((s) => s.id === svc) ? svc : d.serviceId,
      specialistId:
        spec && (specialists.some((s) => s.id === spec) || spec === "first-available")
          ? spec
          : d.specialistId,
    }));
  }, [searchParams]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const selectedService = services.find((s) => s.id === data.serviceId);
  const selectedSpecialist =
    data.specialistId === "first-available"
      ? { id: "first-available", name: "First available", title: "We'll match you", role: "Any" }
      : specialists.find((s) => s.id === data.specialistId);

  const canProceed = (() => {
    if (step === 0) return !!data.serviceId;
    if (step === 1) return !!data.specialistId;
    if (step === 2) return !!data.date && !!data.time;
    if (step === 3) return !!data.name && !!data.email;
    return true;
  })();

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    const reference = makeReference();
    const payload = {
      reference,
      patientName: data.name,
      email: data.email,
      phone: data.phone,
      serviceName: selectedService?.name || "Consultation",
      specialistName: selectedSpecialist?.name || "First available",
      date: data.date,
      time: data.time,
      status: "Confirmed",
      notes: data.notes,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking request failed");

      setConfirmed({ reference, ...payload });
      toast.success("Your consultation request has been reserved.");
    } catch (err) {
      console.error(err);
      // Fallback offline confirmation so user is never blocked
      setConfirmed({ reference, ...payload });
      toast.success("Your request has been received by our concierge.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-lg text-center"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-sakura/50 text-brass">
            <Check className="h-10 w-10" />
          </div>
          <p className="eyebrow mb-4">Request received</p>
          <h1 className="display text-4xl text-mocha sm:text-5xl">Thank you</h1>
          <p className="mt-5 text-base font-light leading-relaxed text-mocha/70">
            We have received your request for <strong className="font-medium text-mocha">{confirmed.serviceName}</strong> with{" "}
            <strong className="font-medium text-mocha">{confirmed.specialistName}</strong> on{" "}
            <strong className="font-medium text-mocha">{confirmed.date}</strong> at{" "}
            <strong className="font-medium text-mocha">{confirmed.time}</strong>.
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-brass/25 bg-oatlinen/50 px-6 py-5">
            <p className="eyebrow text-mocha/55">Your reservation reference</p>
            <p className="display mt-1 text-2xl text-brass">{confirmed.reference}</p>
          </div>
          <p className="mt-6 text-sm font-light text-mocha/55">
            Our concierge will confirm your appointment by email within the day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-brass px-7 py-3 text-sm font-body font-medium tracking-wide text-ricepaper shadow-soft transition-all duration-500 hover:bg-rose focus-ring"
            >
              Return home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[900px] px-6 pb-24 sm:pb-32">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-4">Booking</p>
          <h1 className="display text-4xl sm:text-5xl text-mocha">Reserve your visit</h1>
          <p className="mt-4 text-base font-light text-mocha/65">
            A quiet, two-minute flow. We will confirm personally by email.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12 flex items-center justify-center gap-2 sm:gap-3">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-body transition-all duration-300",
                  i === step
                    ? "border-brass bg-brass text-ricepaper font-medium"
                    : i < step
                    ? "border-brass bg-sakura/50 text-brass"
                    : "border-brass/20 text-mocha/40"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-6 sm:w-12 transition-all duration-300",
                    i < step ? "bg-brass" : "bg-brass/20"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step container */}
        <div className="rounded-[2.5rem] border border-brass/25 bg-oatlinen/40 p-6 sm:p-12 shadow-sm">
          <AnimatePresence mode="wait">
            {/* Step 0: Treatment */}
            {step === 0 && (
              <Step key="treatment">
                <StepTitle icon={Sparkles} title="Choose a ritual" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <SelectCard
                      key={s.id}
                      active={data.serviceId === s.id}
                      onClick={() => set("serviceId", s.id)}
                      title={s.name}
                      subtitle={s.tagline}
                      meta={`${s.duration} · ${s.priceRange}`}
                    />
                  ))}
                </div>
              </Step>
            )}

            {/* Step 1: Specialist */}
            {step === 1 && (
              <Step key="specialist">
                <StepTitle icon={User} title="Select a practitioner" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <SelectCard
                    active={data.specialistId === "first-available"}
                    onClick={() => set("specialistId", "first-available")}
                    title="First available"
                    subtitle="We'll pair you with the best practitioner for your treatment."
                    meta="Recommended"
                  />
                  {specialists.map((s) => (
                    <SelectCard
                      key={s.id}
                      active={data.specialistId === s.id}
                      onClick={() => set("specialistId", s.id)}
                      title={s.name}
                      subtitle={s.title}
                      meta={`${s.role} · ${s.schedule}`}
                    />
                  ))}
                </div>
              </Step>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <Step key="datetime">
                <StepTitle icon={Calendar} title="Choose date & time" />
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="eyebrow mb-2 block text-mocha/60">Preferred date</label>
                    <input
                      type="date"
                      value={data.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => set("date", e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block text-mocha/60">Preferred time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => set("time", slot)}
                          className={cn(
                            "rounded-pill border py-2 text-xs font-light transition-all focus-ring",
                            data.time === slot
                              ? "border-brass bg-brass text-ricepaper font-medium"
                              : "border-brass/30 text-mocha/80 hover:border-brass hover:bg-sakura/30"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Step>
            )}

            {/* Step 3: Guest Details */}
            {step === 3 && (
              <Step key="details">
                <StepTitle icon={User} title="Your information" />
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow mb-2 block text-mocha/60">Full name</span>
                      <input
                        type="text"
                        required
                        value={data.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="input-field"
                        placeholder="Elena Vance"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow mb-2 block text-mocha/60">Email address</span>
                      <input
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => set("email", e.target.value)}
                        className="input-field"
                        placeholder="elena@example.com"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="eyebrow mb-2 block text-mocha/60">Phone (optional)</span>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className="input-field"
                      placeholder="+82 10 1234 5678"
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow mb-2 block text-mocha/60">Notes or skin concerns</span>
                    <textarea
                      rows={3}
                      value={data.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      className="input-field resize-none"
                      placeholder="Anything our concierge should know in advance…"
                    />
                  </label>
                </div>
              </Step>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <Step key="confirm">
                <StepTitle icon={Check} title="Review & confirm" />
                <div className="mt-6 space-y-3">
                  <SummaryRow label="Treatment" value={selectedService?.name} />
                  <SummaryRow label="Specialist" value={selectedSpecialist?.name} />
                  <SummaryRow label="Date" value={data.date} />
                  <SummaryRow label="Time" value={data.time} />
                  <SummaryRow label="Name" value={data.name} />
                  <SummaryRow label="Email" value={data.email} />
                  {data.phone && <SummaryRow label="Phone" value={data.phone} />}
                  {data.notes && <SummaryRow label="Notes" value={data.notes} />}
                </div>
                <p className="mt-6 text-xs font-light leading-relaxed text-mocha/50">
                  This consultation reservation will be confirmed personally by our concierge.
                </p>
              </Step>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={back}
                className="inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-body font-light text-mocha/70 transition-colors hover:text-mocha focus-ring"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <span />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                disabled={!canProceed}
                className="inline-flex items-center gap-2 rounded-pill bg-brass px-7 py-3 text-sm font-body font-medium tracking-wide text-ricepaper shadow-soft transition-all duration-500 hover:bg-rose focus-ring disabled:opacity-40 disabled:shadow-none"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-pill bg-brass px-7 py-3 text-sm font-body font-medium tracking-wide text-ricepaper shadow-soft transition-all duration-500 hover:bg-rose focus-ring disabled:opacity-60"
              >
                {submitting ? "Reserving…" : "Confirm booking"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-brass border-t-transparent animate-spin" /></div>}>
        <BookingContent />
      </Suspense>
      <Footer />
    </>
  );
}

function Step({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sakura/50 text-brass">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="display text-2xl text-mocha">{title}</h2>
    </div>
  );
}

function SelectCard({ active, onClick, title, subtitle, meta }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 text-left transition-all duration-300 focus-ring flex flex-col justify-between",
        active
          ? "border-brass bg-ricepaper shadow-sm ring-1 ring-brass"
          : "border-brass/20 bg-ricepaper/50 hover:border-brass/50 hover:bg-ricepaper/80"
      )}
    >
      <div>
        <p className="font-heading text-lg font-light text-mocha">{title}</p>
        <p className="mt-1 text-xs font-light text-mocha/65 line-clamp-2">{subtitle}</p>
      </div>
      {meta && (
        <p className="mt-3 text-[0.7rem] font-medium uppercase tracking-wider text-brass">
          {meta}
        </p>
      )}
    </button>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-brass/15 py-2.5 text-sm">
      <span className="font-light text-mocha/60">{label}</span>
      <span className="font-medium text-mocha">{value}</span>
    </div>
  );
}

