"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import {
  HONEYPOT_FIELD,
  LIMITS,
  budgetOptions,
  contactMethods,
  emptyEnquiry,
  enquiryFields,
  normalizeEnquiry,
  serviceOptions,
  validateEnquiry,
  validateField,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryInput,
  type EnquiryResponse,
} from "@/lib/enquiry";

// ─────────────────────────────────────────────
// Styling — the original contact form's inputs, plus a focus-visible ring
// and an error state.
// ─────────────────────────────────────────────

const controlBase =
  "w-full rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent/70 transition-colors duration-fast";
const controlError = "border-red-400/60 focus:border-red-400/80 focus-visible:ring-red-400/20";

const fieldId = (field: EnquiryField) => `enquiry-${field}`;
const errorId = (field: EnquiryField) => `enquiry-${field}-error`;
const hintId = (field: EnquiryField) => `enquiry-${field}-hint`;

/** How the success message refers to each contact method. */
const methodPhrase: Record<string, string> = {
  email: "email",
  phone: "phone",
  whatsapp: "WhatsApp",
};

const allTouched = Object.fromEntries(enquiryFields.map((f) => [f, true])) as Record<EnquiryField, boolean>;

function fallbackError() {
  return site.contact.email
    ? `We couldn't send your enquiry. Please try again or email us at ${site.contact.email}.`
    : "We couldn't send your enquiry. Please try again in a moment.";
}

// ─────────────────────────────────────────────
// Pieces
// ─────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-white text-black text-sm font-medium shadow-lg"
    >
      <span aria-hidden className="text-green-600">✓</span>
      {message}
    </motion.div>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden className="ml-0.5 text-accent">*</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

function OptionalNote({ children = "(optional)" }: { children?: React.ReactNode }) {
  return <span className="ml-1.5 font-normal text-foreground/50">{children}</span>;
}

function FieldError({ field, message }: { field: EnquiryField; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(field)} className="mt-2 flex items-start gap-1.5 text-sm text-red-400">
      <Icon name="alert" className="mt-0.5 h-4 w-4" />
      <span>{message}</span>
    </p>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const labelClass = "mb-2 block text-sm font-medium text-foreground/80";

// ─────────────────────────────────────────────
// Form
// ─────────────────────────────────────────────

type Status = "idle" | "submitting" | "success";

/**
 * EnquiryForm — project enquiry form for /contact. Field rules come from
 * lib/enquiry (shared with /api/contact, whose answer is authoritative).
 *
 * Errors appear once a field has been edited and left, then update as the
 * visitor types. On submit every field is checked and focus moves to the
 * first problem.
 */
export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryInput>(emptyEnquiry);
  const [honeypot, setHoneypot] = useState("");
  /** Fields edited at least once — only these are validated on blur. */
  const [dirty, setDirty] = useState<Partial<Record<EnquiryField, boolean>>>({});
  /** Fields whose errors are shown (and re-checked on every change). */
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [sent, setSent] = useState<{ firstName: string; method: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);
  const focusFormOnReset = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prefill the service from ?service=<slug> (links from service and project
  // pages). Read here rather than with useSearchParams so the page stays static.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested && serviceOptions.some((o) => o.value === requested)) {
      setValues((v) => (v.service ? v : { ...v, service: requested }));
    }
  }, []);

  // Focus management when the form and the success panel swap.
  useEffect(() => {
    if (status === "success") {
      successHeadingRef.current?.focus();
    } else if (status === "idle" && focusFormOnReset.current) {
      focusFormOnReset.current = false;
      document.getElementById(fieldId("name"))?.focus();
    }
  }, [status]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const normalized = useMemo(() => normalizeEnquiry(values), [values]);

  // Client-side errors for touched fields; the server's errors fill in until
  // the visitor edits that field.
  const errors = useMemo(() => {
    const result: EnquiryErrors = {};
    for (const field of enquiryFields) {
      const message = (touched[field] && validateField(field, normalized)) || serverErrors[field];
      if (message) result[field] = message;
    }
    return result;
  }, [normalized, touched, serverErrors]);

  const needsPhone = values.contactMethod === "phone" || values.contactMethod === "whatsapp";
  const loading = status === "submitting";

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  function update(field: EnquiryField, value: string, { commit = false } = {}) {
    setValues((v) => ({ ...v, [field]: value }));
    setDirty((d) => (d[field] ? d : { ...d, [field]: true }));
    // Choices (selects, radios) are complete as soon as they're made.
    if (commit) setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
    if (serverErrors[field]) {
      setServerErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  }

  function handleBlur(field: EnquiryField) {
    if (dirty[field] && !touched[field]) setTouched((t) => ({ ...t, [field]: true }));
  }

  function focusField(field: EnquiryField) {
    const el =
      field === "contactMethod"
        ? formRef.current?.querySelector<HTMLInputElement>('input[name="contactMethod"]:checked') ??
          formRef.current?.querySelector<HTMLInputElement>('input[name="contactMethod"]')
        : document.getElementById(fieldId(field));
    el?.focus();
  }

  function reportInvalid(fieldErrors: EnquiryErrors, message?: string) {
    const invalid = enquiryFields.filter((f) => fieldErrors[f]);
    if (invalid.length === 0) return;
    setAnnouncement(
      message ??
        (invalid.length === 1
          ? "Please fix 1 field before sending."
          : `Please fix ${invalid.length} fields before sending.`)
    );
    // Wait for the error state to render so the field is announced with it.
    requestAnimationFrame(() => focusField(invalid[0]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    setTouched(allTouched);
    setSubmitError(null);

    const clientErrors = validateEnquiry(normalized);
    if (Object.keys(clientErrors).length > 0) {
      reportInvalid(clientErrors);
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setAnnouncement("Sending your enquiry…");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalized, [HONEYPOT_FIELD]: honeypot }),
      });

      let body: EnquiryResponse | null = null;
      if (res.headers.get("content-type")?.includes("application/json")) {
        try {
          body = (await res.json()) as EnquiryResponse;
        } catch {
          body = null;
        }
      }

      if (res.ok && body?.ok) {
        setSent({
          firstName: normalized.name.split(/\s+/)[0],
          method: methodPhrase[normalized.contactMethod] ?? "email",
        });
        setAnnouncement("");
        setStatus("success");
        showToast("Enquiry sent! We'll be in touch soon.");
        return;
      }

      const failure = body && !body.ok ? body : null;
      setStatus("idle");

      if (res.status === 400 && failure?.fieldErrors && Object.keys(failure.fieldErrors).length > 0) {
        setServerErrors(failure.fieldErrors);
        reportInvalid(failure.fieldErrors, failure.error);
        return;
      }

      const message = failure?.error || fallbackError();
      setSubmitError(message);
      setAnnouncement(message);
    } catch {
      const message = fallbackError();
      setStatus("idle");
      setSubmitError(message);
      setAnnouncement(message);
    } finally {
      submittingRef.current = false;
    }
  }

  function reset() {
    setValues(emptyEnquiry);
    setHoneypot("");
    setDirty({});
    setTouched({});
    setServerErrors({});
    setSubmitError(null);
    setAnnouncement("");
    setSent(null);
    focusFormOnReset.current = true;
    setStatus("idle");
  }

  /** Shared accessibility props for a single control. */
  function a11y(field: EnquiryField, { hint = false, required = false } = {}) {
    const describedBy = [hint && hintId(field), errors[field] && errorId(field)].filter(Boolean).join(" ");
    return {
      id: fieldId(field),
      name: field,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": describedBy || undefined,
      "aria-required": required || undefined,
      onBlur: () => handleBlur(field),
    };
  }

  const descriptionLength = values.description.length;

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {status === "success" && sent ? (
        <section
          aria-labelledby="enquiry-success-heading"
          className="rounded-2xl bg-surface border border-surface-border p-8"
        >
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Icon name="check" />
          </span>
          <h2
            id="enquiry-success-heading"
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-foreground leading-snug focus:outline-none"
          >
            Thanks, {sent.firstName} — your enquiry is on its way.
          </h2>
          <p className="mt-3 text-base text-foreground/60 leading-relaxed">
            We&apos;ll get back to you by {sent.method}.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 h-11 rounded-full bg-white/15 backdrop-blur-lg border border-white/25 px-6 text-sm font-medium text-foreground/90 hover:bg-white/25 hover:text-foreground transition-all duration-fast ease-smooth"
          >
            Send another enquiry
          </button>
        </section>
      ) : (
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          aria-busy={loading || undefined}
          aria-label="Project enquiry"
          className="relative flex flex-col gap-5"
        >
          <p className="text-sm text-foreground/50">
            Fields marked <span aria-hidden className="text-accent">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={fieldId("name")} className={labelClass}>
                Name
                <RequiredMark />
              </label>
              <input
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                className={cn(controlBase, "h-12", errors.name && controlError)}
                {...a11y("name", { required: true })}
              />
              <FieldError field="name" message={errors.name} />
            </div>

            <div>
              <label htmlFor={fieldId("company")} className={labelClass}>
                Business or company name
                <OptionalNote />
              </label>
              <input
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                className={cn(controlBase, "h-12", errors.company && controlError)}
                {...a11y("company")}
              />
              <FieldError field="company" message={errors.company} />
            </div>
          </div>

          <div>
            <label htmlFor={fieldId("email")} className={labelClass}>
              Email
              <RequiredMark />
            </label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="name@company.com"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              className={cn(controlBase, "h-12", errors.email && controlError)}
              {...a11y("email", { required: true })}
            />
            <FieldError field="email" message={errors.email} />
          </div>

          <div>
            <label htmlFor={fieldId("phone")} className={labelClass}>
              WhatsApp or phone number
              {needsPhone ? (
                <>
                  <RequiredMark />
                  <OptionalNote>(required for phone/WhatsApp)</OptionalNote>
                </>
              ) : (
                <OptionalNote />
              )}
            </label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={cn(controlBase, "h-12", errors.phone && controlError)}
              {...a11y("phone", { hint: true, required: needsPhone })}
            />
            <p id={hintId("phone")} className="mt-2 text-sm text-foreground/50">
              Include the country code if you&apos;re outside India.
            </p>
            <FieldError field="phone" message={errors.phone} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={fieldId("service")} className={labelClass}>
                Service required
                <RequiredMark />
              </label>
              <div className="relative">
                <select
                  value={values.service}
                  onChange={(e) => update("service", e.target.value, { commit: true })}
                  className={cn(
                    controlBase,
                    "h-12 appearance-none pr-10 cursor-pointer",
                    !values.service && "text-foreground/50",
                    errors.service && controlError
                  )}
                  {...a11y("service", { required: true })}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {serviceOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <FieldError field="service" message={errors.service} />
            </div>

            <div>
              <label htmlFor={fieldId("budget")} className={labelClass}>
                Approximate budget
                <OptionalNote />
              </label>
              <div className="relative">
                <select
                  value={values.budget}
                  onChange={(e) => update("budget", e.target.value, { commit: true })}
                  className={cn(
                    controlBase,
                    "h-12 appearance-none pr-10 cursor-pointer",
                    !values.budget && "text-foreground/50",
                    errors.budget && controlError
                  )}
                  {...a11y("budget")}
                >
                  <option value="">Prefer not to say</option>
                  {budgetOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <FieldError field="budget" message={errors.budget} />
            </div>
          </div>

          <div>
            <label htmlFor={fieldId("description")} className={labelClass}>
              Project description
              <RequiredMark />
            </label>
            <textarea
              rows={6}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className={cn(controlBase, "py-3 resize-y min-h-[9rem]", errors.description && controlError)}
              {...a11y("description", { hint: true, required: true })}
            />
            <div id={hintId("description")} className="mt-2 flex items-start justify-between gap-4 text-sm text-foreground/50">
              <span>What you need, who it&apos;s for, and any timeline you have in mind.</span>
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  descriptionLength > LIMITS.description && "text-red-400"
                )}
              >
                {descriptionLength} / {LIMITS.description}
                <span className="sr-only"> characters</span>
              </span>
            </div>
            <FieldError field="description" message={errors.description} />
          </div>

          <fieldset aria-describedby={errors.contactMethod ? errorId("contactMethod") : undefined}>
            <legend className={labelClass}>
              Preferred contact method
              <RequiredMark />
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {contactMethods.map((m) => (
                <label
                  key={m.value}
                  htmlFor={`${fieldId("contactMethod")}-${m.value}`}
                  className={cn(
                    "flex h-12 cursor-pointer items-center gap-3 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground/80 transition-colors duration-fast hover:border-white/15",
                    "has-[:checked]:border-accent/60 has-[:checked]:text-foreground",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
                  )}
                >
                  <input
                    type="radio"
                    id={`${fieldId("contactMethod")}-${m.value}`}
                    name="contactMethod"
                    value={m.value}
                    checked={values.contactMethod === m.value}
                    onChange={() => update("contactMethod", m.value, { commit: true })}
                    className="h-4 w-4 accent-accent focus-visible:outline-none"
                  />
                  {m.label}
                </label>
              ))}
            </div>
            <FieldError field="contactMethod" message={errors.contactMethod} />
          </fieldset>

          {/* Spam trap — off-screen rather than display:none so naive bots still fill it. */}
          <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
            <input
              type="text"
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {submitError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              <Icon name="alert" className="mt-0.5 h-4 w-4" />
              <p>{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            aria-disabled={loading || undefined}
            className={cn(
              "mt-2 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-normal ease-smooth",
              loading && "opacity-60 cursor-wait hover:bg-white"
            )}
          >
            {loading && (
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black"
              />
            )}
            {loading ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      )}

      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
    </div>
  );
}
