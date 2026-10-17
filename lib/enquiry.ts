// ─────────────────────────────────────────────
// Project enquiry — shared field rules for the contact form (client)
// and /api/contact (server). The server result is authoritative.
// ─────────────────────────────────────────────

import { services } from "@/content/services";

export const NOT_SURE = "not-sure";

export const serviceOptions: { value: string; label: string }[] = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: NOT_SURE, label: "Not sure yet" },
];

/** TODO(owner): confirm currency and ranges. */
export const budgetOptions: { value: string; label: string }[] = [
  { value: "under-50k", label: "Under ₹50,000" },
  { value: "50k-150k", label: "₹50,000 – ₹1,50,000" },
  { value: "150k-500k", label: "₹1,50,000 – ₹5,00,000" },
  { value: "above-500k", label: "Above ₹5,00,000" },
  { value: "not-sure", label: "Not sure yet" },
];

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export type ContactMethod = (typeof contactMethods)[number]["value"];

export interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  description: string;
  contactMethod: string;
}

export type EnquiryField = keyof EnquiryInput;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

/** Name of the hidden spam trap. Deliberately not an autofill-able name. */
export const HONEYPOT_FIELD = "_gotcha";

export const LIMITS = {
  name: 100,
  company: 120,
  email: 254,
  phone: 20,
  descriptionMin: 20,
  description: 5000,
} as const;

export const emptyEnquiry: EnquiryInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  budget: "",
  description: "",
  contactMethod: "email",
};

// Dot-atom local part and a hostname: rejects list/header punctuation such as
// "a@b.com," or "a@b.com>" that the email provider would refuse as a reply-to.
const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const PHONE_CHARS_RE = /^[+\d\s()-]+$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Trim and coerce untrusted input into the expected shape. */
export function normalizeEnquiry(raw: unknown): EnquiryInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name),
    company: str(r.company),
    email: str(r.email),
    phone: str(r.phone),
    service: str(r.service),
    budget: str(r.budget),
    description: str(r.description),
    contactMethod: str(r.contactMethod) || "email",
  };
}

/** Validate one field in the context of the whole form. Returns an error message or undefined. */
export function validateField(field: EnquiryField, data: EnquiryInput): string | undefined {
  const v = data[field];
  switch (field) {
    case "name":
      if (!v) return "Please enter your name.";
      if (v.length > LIMITS.name) return `Please keep your name under ${LIMITS.name} characters.`;
      return;
    case "company":
      if (v.length > LIMITS.company) return `Please keep this under ${LIMITS.company} characters.`;
      return;
    case "email":
      if (!v) return "Please enter your email address.";
      if (v.length > LIMITS.email || !EMAIL_RE.test(v))
        return "Please enter a valid email address, e.g. name@company.com.";
      return;
    case "phone": {
      const needsPhone = data.contactMethod === "phone" || data.contactMethod === "whatsapp";
      if (!v) {
        return needsPhone
          ? "Please add a phone or WhatsApp number so we can reach you there."
          : undefined;
      }
      const digits = v.replace(/\D/g, "").length;
      if (v.length > LIMITS.phone || !PHONE_CHARS_RE.test(v) || digits < 7 || digits > 15)
        return "Please enter a valid phone number, including the country code if outside India.";
      return;
    }
    case "service":
      if (!serviceOptions.some((o) => o.value === v)) return "Please choose the service you need.";
      return;
    case "budget":
      if (v && !budgetOptions.some((o) => o.value === v)) return "Please choose a budget range.";
      return;
    case "description":
      if (!v) return "Please tell us a little about your project.";
      if (v.length < LIMITS.descriptionMin)
        return `Please add a bit more detail (at least ${LIMITS.descriptionMin} characters).`;
      if (v.length > LIMITS.description)
        return `Please keep this under ${LIMITS.description} characters.`;
      return;
    case "contactMethod":
      if (!contactMethods.some((m) => m.value === v))
        return "Please choose how you'd like us to contact you.";
      return;
  }
}

export const enquiryFields: EnquiryField[] = [
  "name",
  "company",
  "email",
  "phone",
  "service",
  "budget",
  "description",
  "contactMethod",
];

export function validateEnquiry(data: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of enquiryFields) {
    const message = validateField(field, data);
    if (message) errors[field] = message;
  }
  return errors;
}

export const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

/** Successful API response. */
export interface EnquirySuccess {
  ok: true;
}

/** Failed API response. `fieldErrors` is present for validation failures. */
export interface EnquiryFailure {
  ok: false;
  error: string;
  fieldErrors?: EnquiryErrors;
}

export type EnquiryResponse = EnquirySuccess | EnquiryFailure;
