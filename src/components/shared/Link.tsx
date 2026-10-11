"use client";

import React from "react";
import NextLink from "next/link";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Universal Link component supporting both Next.js `href` and standard `to` prop.
 */
export default function Link({ to, href, children, ...props }: LinkProps) {
  const destination = href || to || "#";
  return (
    <NextLink href={destination} {...props}>
      {children}
    </NextLink>
  );
}

export { Link };
