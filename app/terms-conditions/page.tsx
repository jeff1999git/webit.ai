import type { Metadata } from "next";
import { EmailLink } from "@/components/ui/EmailLink";
import Link from "next/link";
import { StarField } from "@/components/animations/StarField";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use the ${site.name} website.`,
  alternates: { canonical: "/terms-conditions" },
};

const linkClass =
  "text-accent underline underline-offset-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm";

export default function TermsConditionsPage() {
  const email = site.contact.email;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2 [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-foreground/50 mb-10 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">Last updated: October 2026</p>

        <div className="space-y-8 text-foreground/60 leading-relaxed text-sm [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by
              these Terms and Conditions. If you do not agree, please discontinue use
              of the site immediately.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, animations,
              and code — is the property of {site.name} and is protected by applicable
              intellectual property laws. You may not reproduce, distribute, or create
              derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Services</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of this
              website or our services at any time without notice. We are not liable to you
              or any third party for any modification, suspension, or discontinuation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Project Work</h2>
            <p>
              Information on this website is general in nature and is not an offer. Each
              project we take on is governed by the proposal or agreement made for that
              project.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {site.name} shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your
              use of the website or our services, even if advised of the possibility of
              such damages.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable
              law. Any disputes arising under these Terms shall be subject to the exclusive
              jurisdiction of the relevant courts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Contact</h2>
            <p>
              For any questions regarding these Terms & Conditions, please contact us
              through the{" "}
              <Link href="/contact" className={linkClass}>
                contact form
              </Link>{" "}
              on our website
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
