"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";
import BrassButton from "@/components/shared/BrassButton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ricepaper/80 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1200px] items-center justify-between px-6 transition-all duration-500",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <Link href="/" className="focus-ring rounded-pill" aria-label="Maison Aurelle home">
          <span className="display text-2xl tracking-tight text-mocha">
            Maison <span className="text-brass">Aurelle</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-body font-light text-mocha/80 transition-colors hover:text-brass focus-ring rounded-pill"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <BrassButton href="/booking" variant="solid">
            Book a Consultation
          </BrassButton>
        </div>

        <button
          className="focus-ring rounded-pill p-2 text-mocha md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-ricepaper/95 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 text-lg font-heading font-light text-mocha/80 hover:text-brass focus-ring rounded-pill"
                >
                  {item.label}
                </Link>
              ))}
              <BrassButton href="/booking" variant="solid" className="mt-4 self-start">
                Book a Consultation
              </BrassButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}