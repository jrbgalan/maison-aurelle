# Maison Aurelle — Atelier of Luminous Restraint

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A digital sanctuary and high-end atelier experience for **Maison Aurelle**, embodying quiet architectural luxury in the spirit of a Seoul–Kyoto spa. Crafted with contemporary web standards, editorial typography, and thoughtful digital interactions.

---

## Overview

Maison Aurelle is designed to translate the sensory calm and exacting precision of high-tier skin and wellness treatments into a fluid digital experience. Built on modern web architecture with Next.js App Router, it unites editorial visual pacing, rich interactive components, and an intelligent concierge powered by AI.

---

## Key Features

- **Next.js 14 App Router Architecture**: Optimized server-rendered pages, static generation, streamlined routing, and performant asset loading.
- **AI Atelier Concierge**: Intelligent virtual concierge powered by OpenAI (`gpt-4o-mini`), calibrated with bespoke brand knowledge, real-time consultation guidance, and graceful offline fallback support.
- **Editorial Photography & Dynamic Curation**: High-definition, editorial-grade visual assets across all treatments, specialists, journal essays, and gallery showcases integrated with Unsplash.
- **Consultation & Treatment Booking**: Intuitive multi-step reservation system with date/time slot selection, specialist matching, and booking reference generation.
- **Interactive Before & After Sliders**: Custom split-screen image comparison controls demonstrating client transformation outcomes.
- **Curated Journal & Editorial Articles**: Rich typography, long-form layout, and reading time estimation designed for thoughtful beauty essays.
- **Responsive & Accessible Design**: Crafted with Tailwind CSS, Radix UI primitives, Lucide icons, and Framer Motion micro-animations.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/) |
| **Core Library** | [React 18](https://react.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), CSS Custom Properties |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **AI Integration** | [OpenAI Node SDK](https://github.com/openai/openai-node) (`gpt-4o-mini`) |
| **Visual Assets** | [Unsplash API](https://unsplash.com/developers) |
| **State & Forms** | React Hook Form, Zod, TanStack React Query |

---

## Repository Structure

```plaintext
maison-aurelle/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── about/                # Atelier story & philosophy
│   │   ├── api/                  # API routes (chat, appointments, images)
│   │   ├── booking/              # Consultation reservation page
│   │   ├── contact/              # Private client liaison page
│   │   ├── gallery/              # Spatial & ambiance visual gallery
│   │   ├── journal/              # Journal essays and slug pages
│   │   ├── legal/                # Privacy policy and terms
│   │   ├── specialists/          # Specialist directory & profiles
│   │   ├── treatments/           # Signature treatments & detail views
│   │   ├── globals.css           # Design tokens, typography & themes
│   │   ├── layout.jsx            # Global shell, navigation & footer
│   │   ├── not-found.jsx         # Custom 404 error experience
│   │   └── page.jsx              # Atelier flagship home page
│   ├── components/               # Modular UI components
│   │   ├── chat/                 # AI Concierge floating widget
│   │   ├── home/                 # Flagship landing sections
│   │   ├── layout/               # Navigation bar & luxury footer
│   │   ├── shared/               # Reusable cards, sliders & badges
│   │   └── ui/                   # Accessible Radix & styled primitives
│   ├── data/                     # Curated treatments, specialists & content
│   └── lib/                      # Utilities, Unsplash helper & clients
├── public/                       # Static public assets
├── LICENSE                       # MIT License
├── next.config.mjs               # Next.js configuration
├── tailwind.config.js            # Tailwind theme tokens & fonts
└── package.json                  # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+ or higher
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jrbgalan/maison-aurelle.git
   cd maison-aurelle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API configuration for AI Concierge
   OPENAI_API_KEY=your_openai_api_key_here

   # Unsplash API configuration for dynamic photography
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## API Reference

- `POST /api/chat`: Handles conversational inquiries with the AI Concierge using OpenAI `gpt-4o-mini`. Provides domain-specific fallbacks if API limits or offline modes are encountered.
- `POST /api/appointments`: Processes consultation booking requests, generates unique confirmation codes, and returns reservation receipts.
- `GET /api/images?query=<term>`: Fetches editorial photography dynamically via the Unsplash API with cached fallback responses.

---

## License & Copyright

This project is open-source and available under the [MIT License](LICENSE).

Copyright &copy; 2026 **John Romeo Galan**. All rights reserved.

---

## Author

**John Romeo Galan**  
- GitHub: [@jrbgalan](https://github.com/jrbgalan)  
- Email: [jrbgalan@gmail.com](mailto:jrbgalan@gmail.com)
