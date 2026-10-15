import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";
import SakuraPetals from "@/components/shared/SakuraPetals";
import { Toaster } from "sonner";

export const metadata = {
  title: "Maison Aurelle — Quiet Luxury Beauty & Skin Atelier",
  description:
    "A boutique beauty and skin sanctuary in the spirit of a Seoul–Kyoto luxury hotel spa. Serene, science-led treatments for luminous restraint.",
  keywords: [
    "Maison Aurelle",
    "Luxury Skin Clinic",
    "Seoul Aesthetics",
    "Kyoto Spa",
    "Facial Rejuvenation",
    "Dermatology",
  ],
  authors: [{ name: "Maison Aurelle" }],
  openGraph: {
    title: "Maison Aurelle — Quiet Luxury Beauty & Skin Atelier",
    description:
      "A boutique beauty and skin sanctuary in the spirit of a Seoul–Kyoto luxury hotel spa.",
    type: "website",
    siteName: "Maison Aurelle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Aurelle — Quiet Luxury Beauty & Skin Atelier",
    description:
      "A boutique beauty and skin sanctuary in the spirit of a Seoul–Kyoto luxury hotel spa.",
  },
};

export const viewport = {
  themeColor: "#F8F4EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ricepaper text-mocha font-body antialiased selection:bg-sakura selection:text-mocha">
        <SakuraPetals />
        {children}
        <ChatWidget />
        <Toaster position="bottom-left" richColors />
      </body>
    </html>
  );
}
