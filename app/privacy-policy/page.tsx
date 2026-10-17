import type { Metadata } from "next";
import { EmailLink } from "@/components/ui/EmailLink";
import Link from "next/link";
import { StarField } from "@/components/animations/StarField";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles the information you share through the project enquiry form on this website.`,
  alternates: { canonical: "/privacy-policy" },
};

const linkClass =
  "text-accent underline underline-offset-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm";

export default function PrivacyPolicyPage() {
  const email = site.contact.email;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2 [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)]">
          Privacy Policy
        </h1>
        <p className="text-xs text-foreground/50 mb-10 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">Last updated: October 2026</p>

        <div className="space-y-8 text-foreground/60 leading-relaxed text-sm [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
          <p>
            This policy explains what information {site.name} receives through this website and
            what we do with it. We keep it short because we collect very little.
          </p>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>
              When you send us a project enquiry through our{" "}
              <Link href="/contact" className={linkClass}>
                contact form
              </Link>
              , we receive the details you enter: your name, business or company name, email
              address, phone or WhatsApp number, the service you are interested in, your budget
              range, your project description and your preferred contact method.
            </p>
            <p className="mt-3">
              Like any website, this site is delivered by a hosting provider (Vercel), which
              processes standard technical request data, such as your IP address and browser
              details, in its server logs in order to deliver and secure the site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>
              We use the details you submit only to respond to your enquiry and to discuss your
              project with you. Your IP address is used briefly to limit spam and abuse of the
              enquiry form. We do not sell your personal data, and we do not use it for
              advertising.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Service Providers</h2>
            <p>
              Enquiry form submissions are delivered to our inbox by email through Resend, an
              email delivery service. The website is hosted on Vercel. These providers process
              data only as needed to provide their services to us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Cookies</h2>
            <p>
              This website does not use analytics, advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Data Retention</h2>
            <p>
              We keep enquiries for as long as we need them to respond to you and for related
              business records. You can ask us to delete your enquiry at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Your Rights</h2>
            <p>
              You can ask to see the information we hold about you, ask us to correct it, or ask
              us to delete it by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us via
              the{" "}
              <Link href="/contact" className={linkClass}>
                contact form
              </Link>
              {email ? (
                <>
                  {" "}or email us at{" "}
                  <EmailLink email={email} className={linkClass} />
                </>
              ) : null}
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
