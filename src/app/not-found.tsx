import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrassButton from "@/components/shared/BrassButton";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-20">
        <div className="mx-auto max-w-md text-center">
          <p className="eyebrow mb-4">404</p>
          <h1 className="display text-4xl text-mocha sm:text-5xl">Stillness not found</h1>
          <p className="mt-4 text-base font-light leading-relaxed text-mocha/70">
            The page or ritual you are seeking has moved or is no longer listed in our atelier catalogue.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <BrassButton href="/" variant="solid">
              <ArrowLeft className="h-4 w-4" /> Return to Sanctuary
            </BrassButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

