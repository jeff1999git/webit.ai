import { Resend } from "resend";
import { NextResponse } from "next/server";
import { site } from "@/content/site";
import {
  HONEYPOT_FIELD,
  budgetOptions,
  contactMethods,
  labelFor,
  normalizeEnquiry,
  serviceOptions,
  validateEnquiry,
  type EnquiryInput,
  type EnquiryResponse,
} from "@/lib/enquiry";

export const runtime = "nodejs";

/** Larger than any valid enquiry (the description is capped at 5,000 characters). */
const MAX_BODY_CHARS = 20_000;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

/** Inbox that receives enquiries when CONTACT_TO_EMAIL isn't set (the original form's inbox). */
const FALLBACK_TO = "jeffdevelop1@gmail.com";
/** Resend's shared sender works without a verified domain. */
const FALLBACK_FROM = "Webitai Labs <onboarding@resend.dev>";

const emailFallback = site.contact.email ? ` or email us at ${site.contact.email}` : "";

function reply(body: EnquiryResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json<EnquiryResponse>(body, { status, headers });
}

// ─────────────────────────────────────────────
// Rate limiting — best effort only. The map lives in this server instance's
// memory, so on serverless hosting each instance keeps its own count and a
// cold start resets it. It deters casual repeat submissions; it is not a
// security boundary.
// ─────────────────────────────────────────────

const submissions = new Map<string, number[]>();

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "unknown";
}

function pruneSubmissions(now: number) {
  for (const [ip, times] of submissions) {
    const recent = times.filter((t) => now - t < RATE_LIMIT.windowMs);
    if (recent.length > 0) submissions.set(ip, recent);
    else submissions.delete(ip);
  }
}

/** Seconds until this IP may submit again, or 0 if it's under the limit. */
function retryAfter(ip: string, now: number) {
  const times = submissions.get(ip) ?? [];
  if (times.length < RATE_LIMIT.max) return 0;
  return Math.max(1, Math.ceil((times[0] + RATE_LIMIT.windowMs - now) / 1000));
}

function recordSubmission(ip: string, now: number) {
  submissions.set(ip, [...(submissions.get(ip) ?? []), now]);
}

// ─────────────────────────────────────────────
// Email content
// ─────────────────────────────────────────────

const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

function buildSubject(data: EnquiryInput) {
  const subject = singleLine(`New enquiry — ${labelFor(serviceOptions, data.service)} — ${data.name}`);
  return subject.length > 150 ? `${subject.slice(0, 149)}…` : subject;
}

function buildText(data: EnquiryInput) {
  const orDash = (value: string) => value || "—";
  return [
    `Name: ${data.name}`,
    `Business / company: ${orDash(data.company)}`,
    `Email: ${data.email}`,
    `WhatsApp / phone: ${orDash(data.phone)}`,
    `Service: ${labelFor(serviceOptions, data.service)}`,
    `Budget: ${data.budget ? labelFor(budgetOptions, data.budget) : "—"}`,
    `Preferred contact method: ${labelFor([...contactMethods], data.contactMethod)}`,
    "",
    "Project description:",
    data.description,
    "",
    "—",
    `Sent from the contact form at ${site.url}/contact`,
  ].join("\n");
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY_CHARS) {
    return reply({ ok: false, error: "Your enquiry is too long. Please shorten it and try again." }, 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "We couldn't read your enquiry. Please try again." }, 400);
  }

  // Spam trap: pretend it worked so bots don't learn to skip the field.
  const trap = (parsed as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return reply({ ok: true });
  }

  const data = normalizeEnquiry(parsed);
  const fieldErrors = validateEnquiry(data);
  if (Object.keys(fieldErrors).length > 0) {
    return reply({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }

  // Only valid submissions count towards the limit.
  const ip = clientIp(req);
  const now = Date.now();
  pruneSubmissions(now);
  const wait = retryAfter(ip, now);
  if (wait > 0) {
    return reply(
      {
        ok: false,
        error: `Too many enquiries from your connection. Please try again in a few minutes${emailFallback}.`,
      },
      429,
      { "Retry-After": String(wait) }
    );
  }
  recordSubmission(ip, now);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — enquiry not sent.");
    return reply(
      {
        ok: false,
        error: site.contact.email
          ? `Our enquiry form is temporarily unavailable. Please email us at ${site.contact.email}.`
          : "Our enquiry form is temporarily unavailable. Please try again later.",
      },
      503
    );
  }

  // Created per request: the constructor throws when the key is missing.
  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL?.trim() || FALLBACK_TO;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || FALLBACK_FROM;
  const sendFailed = `We couldn't send your enquiry right now. Please try again${emailFallback}.`;

  try {
    // send() reports API failures in `error` rather than throwing.
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: buildSubject(data),
      text: buildText(data),
    });

    if (error) {
      console.error("[contact] Resend rejected the enquiry email:", error);
      return reply({ ok: false, error: sendFailed }, 502);
    }
  } catch (err) {
    console.error("[contact] Failed to reach Resend:", err);
    return reply({ ok: false, error: sendFailed }, 502);
  }

  return reply({ ok: true });
}
