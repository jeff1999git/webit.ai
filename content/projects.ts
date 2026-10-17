// ─────────────────────────────────────────────
// Portfolio — real projects only.
// Every statement here must be something that was actually delivered.
// Do not add results, metrics, testimonials or client names that the
// client has not agreed to publish.
//
// To add a project: append an entry below. `cover.image` is optional —
// put a screenshot in /public/projects/ and reference it to replace the
// gradient cover.
// ─────────────────────────────────────────────

import type { ServiceSlug } from "@/content/services";

export const projectCategories = {
  websites: "Websites",
  "web-applications": "Web Applications",
  "mobile-apps": "Mobile Apps",
  "custom-software": "Custom Software",
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export type ProjectStatus = "live" | "prototype";

export interface ProjectLink {
  label: string;
  href: string;
  /** Extra context shown next to the link, e.g. "Login required". */
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Business the work was for, or null when it should not be named. */
  client: string | null;
  /** Short line describing the client when it isn't named, or adding context. */
  clientDescription: string;
  categories: ProjectCategory[];
  status: ProjectStatus;
  /** One or two sentences for cards. */
  summary: string;
  /** Overview paragraph on the project page. */
  overview: string;
  features: string[];
  stack: string[];
  links: ProjectLink[];
  /** Service used to prefill the enquiry form from this project. */
  relatedService: ServiceSlug;
  cover: {
    /** Tailwind gradient stops used by the existing card design. */
    gradient: string;
    image?: { src: string; alt: string };
  };
}

export const projects: Project[] = [
  {
    slug: "ulsaham-entertainments",
    title: "Ulsaham Entertainments",
    client: "Ulsaham Entertainments",
    clientDescription: "Events company in Kerala, India",
    categories: ["web-applications"],
    status: "live",
    summary:
      "A production event booking and ticketing platform with a customer website, a REST API and a staff admin panel.",
    overview:
      "For Ulsaham Entertainments, an events company in Kerala, India, we built a production event booking and ticketing platform made up of a customer website, a REST API and a staff admin panel, with Razorpay payments, QR-code tickets and role-based access for staff.",
    features: [
      "Customer website for browsing events and booking tickets",
      "Online payments through Razorpay",
      "QR-code tickets",
      "REST API powering the website and the admin panel",
      "Staff admin panel with role-based access",
    ],
    stack: ["Astro", "React", "Next.js", "TypeScript", "MongoDB", "Razorpay", "Vercel"],
    links: [{ label: "Visit ulsaaham.com", href: "https://www.ulsaaham.com/" }],
    relatedService: "web-application-development",
    cover: {
      gradient: "from-violet-500/10 to-purple-500/5",
      image: { src: "/projects/ulsaham-entertainments.webp", alt: "Homepage of the Ulsaham Entertainments website" },
    },
  },
  {
    slug: "royal-king-water-supply",
    title: "Royal King Water Supply",
    client: "Royal King Water Supply",
    clientDescription: "Drinking-water supplier in Thrissur, Kerala",
    categories: ["custom-software", "websites"],
    status: "live",
    summary:
      "Operations software that replaced paper registers for a drinking-water delivery business, plus a mobile-first business-card website.",
    overview:
      "Royal King Water Supply ran its deliveries on paper registers. We built a full-stack web app that replaced them: drivers log deliveries, expenses and odometer readings from their phones in an installable PWA, while the owner manages the ledger, customers, fleet and stock from an admin portal with analytics and ledger exports. For customers, we built a mobile-first digital business card with one-tap contact options and a bulk-order enquiry form.",
    features: [
      "Installable PWA for drivers to log deliveries, expenses and odometer readings",
      "Admin portal for the ledger, customers, fleet and stock",
      "Analytics and ledger exports",
      "Mobile-first business card with one-tap call, WhatsApp, Google Maps and Instagram",
      "Save Contact (vCard) and native share with a copy-link fallback",
      "Bulk-order enquiry form delivered by email through a rate-limited API route",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "NextAuth",
      "TanStack Query",
      "Cloudinary",
      "PWA",
      "Turborepo",
      "Resend",
    ],
    links: [
      { label: "Business-card website", href: "https://royal-king-home.vercel.app" },
      {
        label: "Admin portal",
        href: "https://royalkingadmin-web.vercel.app/",
        note: "Login required",
      },
    ],
    relatedService: "custom-software-development",
    cover: {
      gradient: "from-sky-500/10 to-cyan-500/5",
      image: { src: "/projects/royal-king-water-supply.webp", alt: "Royal King Water Supply business-card website" },
    },
  },
  {
    slug: "seffer-exports",
    title: "Seffer Exports",
    client: "Seffer Exports",
    clientDescription: "Export company",
    categories: ["websites"],
    status: "live",
    summary: "A business website and product catalogue for an export company.",
    overview:
      "We built a business website and product catalogue for Seffer Exports, an export company.",
    features: ["Business website", "Product catalogue"],
    stack: ["Next.js", "Tailwind CSS"],
    links: [{ label: "Visit the website", href: "https://seffer-exports.vercel.app/" }],
    relatedService: "website-development",
    cover: {
      gradient: "from-emerald-500/10 to-green-500/5",
      image: { src: "/projects/seffer-exports.webp", alt: "Homepage of the Seffer Exports website" },
    },
  },
  {
    slug: "bus-booking-platform",
    title: "Bus Booking Platform",
    client: null,
    clientDescription: "Private shuttle bus service",
    categories: ["web-applications"],
    status: "prototype",
    summary:
      "A clickable prototype of a booking and operations app with separate customer, driver and admin areas.",
    overview:
      "A clickable front-end prototype of a booking and operations app for a private shuttle bus service. Every screen reads data through typed service interfaces backed by mock data, so a real API can be connected later. This is a prototype, not a launched product.",
    features: [
      "Separate customer, driver and admin areas",
      "Customers search trips and book seats",
      "Drivers see their trips and passenger lists",
      "Admins manage buses, drivers, trips, holidays and bookings",
      "Typed service interfaces backed by mock data, ready for a real API",
      "Playwright end-to-end tests covering the main flows",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "React Hook Form",
      "Zod",
      "Playwright",
      "Turborepo",
    ],
    links: [{ label: "Open the prototype", href: "https://excelcabs.vercel.app/" }],
    relatedService: "web-application-development",
    cover: {
      gradient: "from-indigo-500/10 to-blue-500/5",
      image: { src: "/projects/bus-booking-platform.webp", alt: "Trip booking screen of the bus booking prototype" },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Categories that currently have at least one project, in display order. */
export function activeCategories(): ProjectCategory[] {
  return (Object.keys(projectCategories) as ProjectCategory[]).filter((c) =>
    projects.some((p) => p.categories.includes(c))
  );
}

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  prototype: "Prototype",
};
