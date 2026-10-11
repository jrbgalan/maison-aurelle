import { SiteConfig } from "@/types";

// Central brand + navigation content for Maison Aurelle.
export const site: SiteConfig = {
  name: "Maison Aurelle",
  tagline: "An atelier of luminous restraint",
  phone: "+82 2 555 0148",
  email: "concierge@maisonaurelle.example",
  address: "12 Apgujeong-ro, Gangnam, Seoul",
  hours: [
    { day: "Monday – Friday", time: "9:00 – 20:00" },
    { day: "Saturday", time: "9:00 – 18:00" },
    { day: "Sunday", time: "By appointment" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "Journal", href: "/journal" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Treatments", href: "/treatments" },
    { label: "Specialists", href: "/specialists" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNote: "Portfolio demonstration.",
  copyright: "© 2026 Maison Aurelle",
};

