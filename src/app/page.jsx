import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SignatureTreatments from "@/components/home/SignatureTreatments";
import AnalyticsSection from "@/components/home/AnalyticsSection";
import MilestonesTimeline from "@/components/home/MilestonesTimeline";
import BeforeAfterPreview from "@/components/home/BeforeAfterPreview";
import FeaturedSpecialists from "@/components/home/FeaturedSpecialists";
import Testimonials from "@/components/home/Testimonials";
import GalleryStrip from "@/components/home/GalleryStrip";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SignatureTreatments />
        <AnalyticsSection />
        <MilestonesTimeline />
        <BeforeAfterPreview />
        <FeaturedSpecialists />
        <Testimonials />
        <GalleryStrip />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

