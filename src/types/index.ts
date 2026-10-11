export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  benefits: string[];
  processSteps: string[];
  duration: string;
  recovery: string;
  priceRange: string;
  image: string;
  featured?: boolean;
  faq: ServiceFAQ[];
}

export type SpecialistRole = "Doctor" | "Aesthetician" | "Nurse" | string;

export interface Specialist {
  id: string;
  name: string;
  role: SpecialistRole;
  title: string;
  specialty: string;
  yearsExperience: number;
  languages: string[];
  bio: string;
  credentials: string[];
  image: string;
  schedule: string;
}

export interface JournalArticle {
  id: string;
  slug?: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author?: string;
  authorRole?: string;
  excerpt: string;
  image?: string;
  heroImage?: string;
  content?: string;
  body?: string[];
  keyTakeaways?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image?: string;
  type?: string;
  treatmentName?: string;
  duration?: string;
  before?: string;
  after?: string;
  notes?: string;
}

export interface StatSummaryPart {
  text: string;
  bold: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  summaryParts: StatSummaryPart[];
}

export interface ClientYearData {
  year: string;
  clients: number;
}

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

export interface Milestone {
  id?: string;
  year: string;
  title: string;
  description?: string;
  desc?: string;
  tag?: string;
  image?: string;
}

export interface Testimonial {
  id?: string;
  name?: string;
  author?: string;
  quote: string;
  location: string;
  treatment: string;
  rating: number;
  image?: string;
}

export interface SiteHour {
  day: string;
  time: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: SiteHour[];
  social: NavLink[];
  nav: NavLink[];
  footerNote: string;
  copyright: string;
}

export interface ChatAction {
  type: "route" | "external";
  href: string;
}

export interface ChatMessage {
  id?: string;
  from: "bot" | "user";
  text: string;
  time?: string;
  action?: ChatAction;
}

export interface AppointmentData {
  serviceId?: string;
  specialistId?: string;
  date?: string;
  time?: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
