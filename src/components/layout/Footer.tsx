"use client";

import React, { useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import BrassButton from "@/components/shared/BrassButton";
import FooterCranes from "@/components/shared/FooterCranes";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    toast.success("Thank you — your invitation to stillness is on its way.");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer className="relative overflow-hidden mt-px border-t border-[#B39B78]/25 bg-[#2B211C] text-[#F3E9DA]">
      {/* Artisanal Japanese Flying Cranes & Dotted Clouds Decorative Layer */}
      <FooterCranes />

      {/* Footer Content (z-10, high contrast ivory/bamboo for WCAG AA compliance) */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-20">
        <div className="grid gap-14 md:grid-cols-12">
          {/* Column 1: Brand & Newsletter */}
          <div className="md:col-span-5">
            <span className="display text-3xl text-[#F3E9DA]">
              Maison <span className="text-[#B89A74]">Aurelle</span>
            </span>
            <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-[#F3E9DA]/80">
              {site.tagline}. A boutique beauty and skin atelier in the spirit of a
              Seoul–Kyoto luxury hotel spa.
            </p>

            <form onSubmit={subscribe} className="mt-8 max-w-sm">
              <label htmlFor="newsletter" className="eyebrow mb-3 block text-[#B89A74]">
                The Aurelle Letter
              </label>
              <div className="flex items-center gap-2 rounded-pill border border-[#B39B78]/40 bg-[#221A16]/90 p-1.5 pl-5 shadow-sm focus-within:border-[#B89A74] focus-within:ring-2 focus-within:ring-[#B89A74]/20 transition-all">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-sm font-light text-[#F3E9DA] placeholder:text-[#F3E9DA]/45 focus:outline-none"
                />
                <BrassButton type="submit" variant="solid" className="px-5 py-2">
                  {sent ? "Sent" : "Join"}
                </BrassButton>
              </div>
            </form>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-[#B89A74]">Explore</p>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-light text-[#F3E9DA]/75 hover:text-[#B89A74] focus-ring rounded-pill transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Atelier Address & Hours */}
          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-[#B89A74]">Visit</p>
            <p className="text-sm font-light leading-relaxed text-[#F3E9DA]/75">
              {site.address}
            </p>
            <ul className="mt-4 space-y-1 text-sm font-light text-[#F3E9DA]/75">
              {site.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-6">
                  <span>{h.day}</span>
                  <span className="text-[#F3E9DA]/55">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-light text-[#F3E9DA]/75">
              <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#B89A74] transition-colors">
                {site.phone}
              </a>
            </p>
            <p className="text-sm font-light text-[#F3E9DA]/75">
              <a href={`mailto:${site.email}`} className="hover:text-[#B89A74] transition-colors">
                {site.email}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Legal & Social Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#B39B78]/25 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-light text-[#F3E9DA]/60">
            {site.copyright} · {site.footerNote}
          </p>
          <div className="flex gap-6">
            <Link
              href="/legal/privacy"
              className="text-xs font-light text-[#F3E9DA]/60 hover:text-[#B89A74] focus-ring rounded-pill transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-xs font-light text-[#F3E9DA]/60 hover:text-[#B89A74] focus-ring rounded-pill transition-colors"
            >
              Terms
            </Link>
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-xs font-light text-[#F3E9DA]/60 hover:text-[#B89A74] focus-ring rounded-pill transition-colors"
                target="_blank"
                rel="noreferrer"
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