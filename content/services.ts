// ─────────────────────────────────────────────
// Services — single source for the home grid, /services page,
// footer links and the enquiry form's "service required" options.
// Keep descriptions benefit-focused; never imply every feature is
// included in every project.
// ─────────────────────────────────────────────

import type { IconName } from "@/components/ui/Icon";

export interface Service {
  slug: string;
  number: string;
  title: string;
  /** Short label used in compact lists, e.g. the footer. */
  shortTitle: string;
  icon: IconName;
  /** One or two sentences for cards. */
  summary: string;
  /** Lead paragraph on the services page. */
  intro: string;
  includes: readonly string[];
  useCases: readonly string[];
  deliverables: readonly string[];
  ctaLabel: string;
}

export const services = [
  {
    slug: "website-development",
    number: "01",
    title: "Website Development",
    shortTitle: "Websites",
    icon: "website",
    summary:
      "Fast, responsive websites that present your business clearly and make it easy for customers to get in touch.",
    intro:
      "Your website is often the first conversation a customer has with your business. We design and build websites that load quickly, read well on every screen and give visitors a clear next step.",
    includes: [
      "Business and company websites",
      "Landing pages and portfolio websites",
      "Responsive, performance-focused builds",
      "SEO-friendly technical implementation",
    ],
    useCases: [
      "Launching your first website",
      "Replacing a slow or outdated site",
      "A focused landing page for a product, service or campaign",
      "A portfolio that showcases your work",
    ],
    deliverables: [
      "A responsive website built to the agreed pages and content",
      "Contact or enquiry forms connected to your inbox",
      "Page titles, descriptions, sitemap and other technical SEO basics",
      "Deployment to your domain and hosting",
    ],
    ctaLabel: "Plan your website",
  },
  {
    slug: "web-application-development",
    number: "02",
    title: "Web Application Development",
    shortTitle: "Web Applications",
    icon: "webapp",
    summary:
      "Custom web applications, dashboards and portals that turn day-to-day processes into software your team can rely on.",
    intro:
      "When spreadsheets, paper registers and scattered tools start slowing you down, a web application built around your process can bring everything into one place — accessible from any browser.",
    includes: [
      "Custom web applications",
      "Admin panels and dashboards",
      "Customer portals and management systems",
      "Booking, registration and workflow applications",
    ],
    useCases: [
      "Taking bookings, registrations or orders online",
      "Giving staff a dashboard to manage records and requests",
      "Offering customers a portal to track their activity",
      "Replacing manual registers with a shared system",
    ],
    deliverables: [
      "A web application covering the agreed features and user roles",
      "Admin screens for managing your data",
      "Secure sign-in and role-based access where required",
      "Deployment, handover notes and a walkthrough for your team",
    ],
    ctaLabel: "Discuss your web app",
  },
  {
    slug: "mobile-app-development",
    number: "03",
    title: "Mobile App Development",
    shortTitle: "Mobile Apps",
    icon: "mobile",
    summary:
      "Cross-platform mobile apps built with React Native, connected to the services and data your business already uses.",
    intro:
      "A mobile app puts your service in your customers' pockets. We build cross-platform apps with React Native so one codebase can serve both Android and iOS users.",
    includes: [
      "Cross-platform mobile applications",
      "React Native application development",
      "API integration and backend connectivity",
      "Application maintenance and improvements",
    ],
    useCases: [
      "A companion app for an existing web platform",
      "Field or staff apps for logging work on the go",
      "Customer apps for bookings, orders or updates",
      "Improving or extending an existing React Native app",
    ],
    deliverables: [
      "A React Native app covering the agreed screens and features",
      "Integration with your backend or third-party APIs",
      "Builds prepared for testing on Android and iOS",
      "Support with store submission and updates when required",
    ],
    ctaLabel: "Discuss your mobile app",
  },
  {
    slug: "custom-software-development",
    number: "04",
    title: "Custom Software Development",
    shortTitle: "Custom Software",
    icon: "software",
    summary:
      "Software shaped around how your business actually works — from internal tools to complete management systems.",
    intro:
      "Off-the-shelf tools rarely fit perfectly. We start from your operational requirements and build software that matches the way your team works, so the process drives the tool — not the other way around.",
    includes: [
      "Business-specific software solutions",
      "Internal management systems",
      "Workflow digitisation",
      "Software tailored to your operational requirements",
    ],
    useCases: [
      "Digitising paper-based records and registers",
      "Managing customers, stock, fleet or staff in one system",
      "Automating repetitive, error-prone steps",
      "Reporting and exports for day-to-day decisions",
    ],
    deliverables: [
      "Requirements and workflow mapping before development starts",
      "Software covering the agreed modules and user roles",
      "Data import from existing spreadsheets where feasible",
      "Training, documentation and post-launch support options",
    ],
    ctaLabel: "Discuss your software",
  },
  {
    slug: "ecommerce-development",
    number: "05",
    title: "E-commerce Development",
    shortTitle: "E-commerce",
    icon: "ecommerce",
    summary:
      "Online stores and product catalogues with the payment, order and customer features your products need.",
    intro:
      "Selling online should feel straightforward for your customers and manageable for you. We build stores and catalogues around your products, payments and fulfilment process.",
    includes: [
      "Online stores and product catalogues",
      "Order management and payment integration",
      "Inventory and customer management features",
      "Custom shopping experiences",
    ],
    useCases: [
      "Taking your shop or product range online",
      "A catalogue that lets customers enquire or order",
      "Accepting online payments",
      "Managing orders and stock from one dashboard",
    ],
    deliverables: [
      "A storefront or catalogue built for your product range",
      "Payment gateway integration where required",
      "Order, product and customer management screens",
      "Deployment and a walkthrough of managing your store",
    ],
    ctaLabel: "Plan your store",
  },
  {
    slug: "backend-api-development",
    number: "06",
    title: "Backend & API Development",
    shortTitle: "Backend & APIs",
    icon: "api",
    summary:
      "Reliable backends, REST APIs and integrations that keep your web and mobile products connected and secure.",
    intro:
      "Behind every good product is a backend that keeps data consistent and secure. We design APIs and databases that your websites, apps and partners can depend on.",
    includes: [
      "Backend architecture and REST APIs",
      "Database design and integration",
      "Authentication and authorisation",
      "Third-party service integrations",
    ],
    useCases: [
      "A shared backend for a website and a mobile app",
      "Connecting payment, email or messaging services",
      "Adding secure sign-in and user roles",
      "Restructuring a database that has outgrown its design",
    ],
    deliverables: [
      "API endpoints covering the agreed functionality",
      "Database schema and data access layer",
      "Authentication and access rules where required",
      "API documentation for your team or partners",
    ],
    ctaLabel: "Discuss your backend",
  },
  {
    slug: "maintenance-support",
    number: "07",
    title: "Website Maintenance & Support",
    shortTitle: "Maintenance & Support",
    icon: "support",
    summary:
      "Ongoing fixes, updates and improvements that keep your website or application fast, secure and working as expected.",
    intro:
      "Software needs care after launch. We help keep existing websites and applications healthy — whether we built them or you need someone to take over.",
    includes: [
      "Bug fixes and technical improvements",
      "Performance optimisation",
      "Security and dependency updates",
      "Deployment support and ongoing maintenance",
    ],
    useCases: [
      "Fixing issues on an existing website or app",
      "Improving page speed and Core Web Vitals",
      "Keeping frameworks and dependencies up to date",
      "Taking over a project from a previous developer",
    ],
    deliverables: [
      "An initial review of the current setup and known issues",
      "Agreed fixes and improvements",
      "Dependency and security updates",
      "Deployment support and a record of changes made",
    ],
    ctaLabel: "Request support",
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]["slug"];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
