"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * BrassButton — pill-shaped CTA in the Maison Aurelle language.
 * Renders a Next.js <Link> when `to` or `href` is given, otherwise a <button>.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3 text-sm font-body font-medium tracking-wide transition-all duration-500 focus-ring min-h-[44px]";

const variants = {
  solid: "bg-brass text-ricepaper hover:bg-rose shadow-soft",
  outline:
    "border border-brass/50 text-mocha hover:border-brass hover:bg-sakura/40",
  ghost: "text-mocha hover:text-brass",
  dark: "bg-mocha text-ricepaper hover:bg-espresso",
};

export default function BrassButton({
  children,
  to,
  href,
  onClick,
  variant = "solid",
  className,
  type,
  disabled,
  ariaLabel,
}) {
  const cls = cn(base, variants[variant], className);
  const target = to || href;

  if (target) {
    return (
      <Link href={target} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={cls}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}