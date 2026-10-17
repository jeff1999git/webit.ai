// ─────────────────────────────────────────────
// Site configuration — brand, contact details and navigation.
// Edit this file to update business information across the whole site.
// Fields set to `null` (or empty arrays) are hidden in the UI — never fill
// them with placeholder data.
// ─────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  /** Shown as text, e.g. "LinkedIn" */
  label: string;
  href: string;
}

const DEFAULT_SITE_URL = "https://webitai.vercel.app";

export const site = {
  name: "Webitai Labs",
  shortName: "Webitai",
  tagline: "We build digital products that move your business forward.",
  description:
    "Webitai Labs is an IT services and software development company. We build websites, web and mobile applications, e-commerce stores and custom business software for small businesses, startups and growing companies.",
  /** Public base URL — set NEXT_PUBLIC_SITE_URL when a custom domain is added. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, ""),
  locale: "en_IN",
  logo: "/webitai-logo.png",

  contact: {
    /** Public enquiry address (already published on the previous privacy policy). */
    email: "webitailabs@gmail.com" as string | null,
    /** TODO(owner): business phone in international format, e.g. "+91 98765 43210". */
    phone: null as string | null,
    /** TODO(owner): WhatsApp number as digits with country code, e.g. "919876543210". */
    whatsapp: null as string | null,
    /** TODO(owner): city / region to display, e.g. "Kerala, India". */
    location: null as string | null,
  },

  /** TODO(owner): add profiles, e.g. { label: "LinkedIn", href: "https://…" }. */
  socials: [] as SocialLink[],

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  cta: { label: "Let's Talk", href: "/contact" } satisfies NavLink,

  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ] satisfies NavLink[],
};

/** Absolute URL for a site path, e.g. absoluteUrl("/services"). */
export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Click-to-chat link, or null when no WhatsApp number is configured. */
export function whatsappHref() {
  const digits = site.contact.whatsapp?.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

/** Gmail web compose link — works without a desktop mail app. */
export function gmailComposeHref(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

/** tel: link, or null when no phone number is configured. */
export function phoneHref() {
  const phone = site.contact.phone?.replace(/[^\d+]/g, "");
  return phone ? `tel:${phone}` : null;
}
