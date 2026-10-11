"use client";

import React, { useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import BrassButton from "@/components/shared/BrassButton";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    toast.success("Thank you — your invitation to stillness is on its way.");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer className="relative mt-px border-t border-brass/20 bg-oatlinen/60">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="display text-3xl text-mocha">
              Maison <span className="text-brass">Aurelle</span>
            </span>
            <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-mocha/70">
              {site.tagline}. A boutique beauty and skin atelier in the spirit of a
              Seoul–Kyoto luxury hotel spa.
            </p>
            <form onSubmit={subscribe} className="mt-8 max-w-sm">
              <label htmlFor="newsletter" className="eyebrow mb-3 block">
                The Aurelle Letter
              </label>
              <div className="flex items-center gap-2 rounded-pill border border-brass/40 bg-ricepaper/70 p-1.5 pl-5">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-sm font-light text-mocha placeholder:text-mocha/40 focus:outline-none"
                />
                <BrassButton type="submit" variant="solid" className="px-5 py-2">
                  {sent ? "Sent" : "Join"}
                </BrassButton>
              </div>
            </form>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-light text-mocha/70 hover:text-brass focus-ring rounded-pill"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Visit</p>
            <p className="text-sm font-light leading-relaxed text-mocha/70">
              {site.address}
            </p>
            <ul className="mt-4 space-y-1 text-sm font-light text-mocha/70">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6">
                  <span>{h.day}</span>
                  <span className="text-mocha/55">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-light text-mocha/70">
              {site.phone}
            </p>
            <p className="text-sm font-light text-mocha/70">
              {site.email}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brass/20 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-light text-mocha/50">
            {site.copyright} · {site.footerNote}
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-xs font-light text-mocha/50 hover:text-brass focus-ring rounded-pill">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-xs font-light text-mocha/50 hover:text-brass focus-ring rounded-pill">
              Terms
            </Link>
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-xs font-light text-mocha/50 hover:text-brass focus-ring rounded-pill"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}