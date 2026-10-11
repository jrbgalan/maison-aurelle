"use client";

import React from "react";
import LegalLayout from "@/components/shared/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="October 2026"
      intro="Maison Aurelle is a portfolio demonstration project. These terms govern the use of this demonstration website only."
      sections={[
        {
          heading: "Demonstration notice",
          paragraphs: [
            "This website is a design and development portfolio. Maison Aurelle is not a real medical clinic, and no treatments are actually provided. Please do not submit bookings expecting to receive a medical or aesthetic service.",
          ],
        },
        {
          heading: "Use of the site",
          paragraphs: [
            "You agree to use this site only for the purpose of evaluating the demonstration. You agree not to misuse the forms, attempt to access restricted areas, or introduce harmful content.",
          ],
        },
        {
          heading: "Bookings & enquiries",
          paragraphs: [
            "Bookings and contact submissions made through this demo are for illustration only. No appointment will be honoured, and no medical advice will be given in response.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "All content on this site — including text, imagery, design, and code — is the property of the author and may not be reproduced without permission.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "As this is a demonstration, no liability is accepted for any reliance on the information presented. No real services are offered or implied.",
          ],
        },
        {
          heading: "Changes to these terms",
          paragraphs: [
            "We may update these terms as the demonstration evolves. Continued use of the site constitutes acceptance of any revised terms.",
          ],
        },
      ]}
    />
  );
}

