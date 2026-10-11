"use client";

import React from "react";
import LegalLayout from "@/components/shared/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="October 2026"
      intro="Maison Aurelle is a portfolio demonstration, not a real medical service. This policy describes how we handle information in the context of this demo."
      sections={[
        {
          heading: "Information we collect",
          paragraphs: [
            "When you use the booking or contact forms, we collect the details you provide — your name, email, phone number, and any notes you choose to include.",
          ],
          list: [
            "Contact details: name, email, and phone number.",
            "Booking preferences: chosen treatment, specialist, date, and time.",
            "Optional notes you share with our concierge.",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: [
            "Your information is used solely to respond to enquiries and to manage demonstration bookings within this app. We do not use your data for any real medical treatment.",
          ],
        },
        {
          heading: "How we store your data",
          paragraphs: [
            "Data submitted through this demo is stored securely within the application's database. Access is restricted to authorised administrators of the demonstration.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of any information you have submitted through this demo by contacting our concierge. We will respond within a reasonable timeframe.",
          ],
        },
        {
          heading: "Cookies & analytics",
          paragraphs: [
            "This demo may use basic analytics to understand how visitors interact with the site. No personally identifying analytics are collected without your explicit action.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "For any privacy questions, please reach our concierge at concierge@maisonaurelle.example.",
          ],
        },
      ]}
    />
  );
}

