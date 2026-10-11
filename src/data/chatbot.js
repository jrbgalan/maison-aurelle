// Rule-based decision tree for the L'Aurelle Concierge.
// Structured so an AI backend can be plugged in later by replacing `next`
// resolution with a backend call.
export const chatbotConfig = {
  welcome: "Welcome to Maison Aurelle. How may we guide your journey today?",
  fallback:
    "Let me connect you with our concierge. You can reach us at concierge@maisonaurelle.example or begin a booking and we will confirm personally.",
  contactOptions: [
    { label: "Email the concierge", action: { type: "link", href: "mailto:concierge@maisonaurelle.example" } },
    { label: "Start booking", action: { type: "route", href: "/booking" } },
  ],
  quickReplies: [
    { id: "book", label: "Book a consultation" },
    { id: "treatments", label: "Our treatments" },
    { id: "pricing", label: "Pricing" },
    { id: "hours", label: "Opening hours" },
    { id: "specialists", label: "Meet the specialists" },
    { id: "contact", label: "Contact us" },
  ],
  nodes: {
    book: {
      message: "Lovely. Our booking flow takes about two minutes. Would you like to choose a treatment first, or let us match you with the right specialist?",
      replies: [
        { label: "Choose a treatment", action: { type: "route", href: "/booking" } },
        { label: "Match me", action: { type: "route", href: "/booking?specialist=first-available" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
    treatments: {
      message: "We offer six signature families: Facial & Skin Rejuvenation, Injectables, Laser & Resurfacing, Body Contouring, Hair & Scalp, and Brows & Lashes. Which calls to you?",
      replies: [
        { label: "Facial & Skin", action: { type: "route", href: "/treatments?category=Facial+%26+Skin" } },
        { label: "Injectables", action: { type: "route", href: "/treatments?category=Injectables" } },
        { label: "Laser & Resurfacing", action: { type: "route", href: "/treatments?category=Laser+%26+Resurfacing" } },
        { label: "See all", action: { type: "route", href: "/treatments" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
    pricing: {
      message: "Our treatments range from $90 for Brows & Lashes to $1,200 for advanced Body Contouring. Exact pricing is confirmed in consultation. Would you like a guide?",
      replies: [
        { label: "View treatments", action: { type: "route", href: "/treatments" } },
        { label: "Book a consultation", action: { type: "route", href: "/booking" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
    hours: {
      message: "We welcome guests Monday to Friday, 9:00–20:00, and Saturday 9:00–18:00. Sundays are by appointment, for a private sanctuary.",
      replies: [
        { label: "Book a consultation", action: { type: "route", href: "/booking" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
    specialists: {
      message: "Our atelier is led by Dr. Yuna Kang and Dr. Haru Mori, with aestheticians and nurses devoted to your care. Shall I show you the directory?",
      replies: [
        { label: "Meet the specialists", action: { type: "route", href: "/specialists" } },
        { label: "Book with first available", action: { type: "route", href: "/booking?specialist=first-available" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
    contact: {
      message: "You can reach our concierge at concierge@maisonaurelle.example or +82 2 555 0148. We answer within the day, with care.",
      replies: [
        { label: "Email the concierge", action: { type: "link", href: "mailto:concierge@maisonaurelle.example" } },
        { label: "Start booking", action: { type: "route", href: "/booking" } },
        { label: "Back", action: { type: "back" } },
      ],
    },
  },
};