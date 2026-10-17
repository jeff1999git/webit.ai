import type { Metadata } from "next";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideUp } from "@/components/animations/SlideUp";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { ContactScene } from "@/components/sections/ContactScene";
import { EmailLink } from "@/components/ui/EmailLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import { phoneHref, site, whatsappHref } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — Start a Project",
  description:
    "Tell Webitai Labs about your website, web or mobile app, e-commerce store or custom software project. Share your requirements and we'll get back to you using your preferred contact method.",
  alternates: { canonical: "/contact" },
};

const nextSteps = [
  "We review your enquiry.",
  "We get in touch to discuss your requirements.",
  "If it's a fit, we share a proposed scope and estimate.",
];

interface DirectOption {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  /** Email option: rendered as a Gmail compose link. */
  email?: string;
}

function directOptions(): DirectOption[] {
  const options: DirectOption[] = [];
  const { email, phone, location } = site.contact;
  const tel = phoneHref();
  const whatsapp = whatsappHref();

  if (email) options.push({ icon: "mail", label: "Email", value: email, href: `mailto:${email}`, email });
  if (phone && tel) options.push({ icon: "phone", label: "Phone", value: phone, href: tel });
  if (whatsapp) {
    options.push({ icon: "message", label: "WhatsApp", value: "Chat with us", href: whatsapp, external: true });
  }
  if (location) {
    options.push({
      icon: "mapPin",
      label: "Location",
      value: location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      external: true,
    });
  }
  return options;
}

export default function ContactPage() {
  const options = directOptions();

  return (
    <div>
      <ContactScene variant="page">
        <SlideUp>
          <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">Contact</p>
        </SlideUp>
        <SlideUp delay={0.05}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Let&apos;s talk about your project
          </h1>
        </SlideUp>
        <SlideUp delay={0.1}>
          <p className="mt-5 mb-10 text-base text-foreground/60 leading-relaxed">
            Tell us what you&apos;re planning and we&apos;ll get back to you using your preferred contact
            method.
          </p>
        </SlideUp>

        <FadeIn delay={0.2}>
          <EnquiryForm />
        </FadeIn>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface-border">
          {options.length > 0 && (
            <SlideUp className="bg-background p-6 md:p-8">
              <h2 className="text-xs font-medium tracking-widest uppercase text-accent mb-5">
                Contact us directly
              </h2>
              <ul className="space-y-4">
                {options.map((o) => (
                  <li key={o.label} className="flex items-start gap-3">
                    <Icon name={o.icon} className="mt-0.5 text-foreground/50" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground/50">{o.label}</p>
                      {o.email ? (
                        <EmailLink email={o.email} className="break-words text-sm font-medium text-foreground/90 underline decoration-foreground/30 underline-offset-4 hover:text-foreground hover:decoration-foreground/60 transition-colors duration-fast" />
                      ) : (
                        <a
                          href={o.href}
                          {...(o.external && { target: "_blank", rel: "noopener noreferrer" })}
                          className="break-words text-sm font-medium text-foreground/90 underline decoration-foreground/30 underline-offset-4 hover:text-foreground hover:decoration-foreground/60 transition-colors duration-fast"
                        >
                          {o.value}
                          {o.external && <span className="sr-only"> (opens in a new tab)</span>}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </SlideUp>
          )}

          <SlideUp delay={0.05} className="bg-background p-6 md:p-8">
            <h2 className="text-xs font-medium tracking-widest uppercase text-accent mb-5">
              What happens next
            </h2>
            <ol className="space-y-4">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span aria-hidden className="font-mono text-xs text-foreground/50 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-foreground/70 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </SlideUp>
        </div>
      </ContactScene>
    </div>
  );
}
