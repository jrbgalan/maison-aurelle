"use client";

import React from "react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { gradients } from "@/data/images";

/**
 * ArchImage — houses imagery in a soft portal arch.
 * Falls back to a warm gradient placeholder when no src is supplied.
 */
export default function ArchImage({
  src,
  alt = "",
  className,
  gradient = "sakura",
  rounded = "arch",
  fittingType = "fill",
  focalPointX,
  focalPointY,
}) {
  const radiusClass =
    rounded === "arch"
      ? "arch-mask"
      : rounded === "pill"
      ? "rounded-pill"
      : rounded === "lg"
      ? "rounded-lg"
      : "rounded-none";

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-oatlinen", radiusClass, className)}
      style={!src ? { background: gradients[gradient] || gradients.sakura } : undefined}
      role={src ? undefined : "presentation"}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fittingType={fittingType}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="eyebrow opacity-60">{alt || "Maison Aurelle"}</span>
        </div>
      )}
    </div>
  );
}