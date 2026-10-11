"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrassButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  variant?: "solid" | "outline" | "ghost" | "dark" | string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3 text-sm font-body font-medium tracking-wide transition-all duration-500 focus-ring min-h-[44px]";

const variants: Record<string, string> = {
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
}: BrassButtonProps) {
  const cls = cn(base, variants[variant] || variants.solid, className);
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