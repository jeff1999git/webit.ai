import { Navbar } from "@/components/layout/Navbar";
import { StarField } from "@/components/animations/StarField";

export const metadata = { title: "Terms & Conditions — WebApp" };

export default function TermsConditionsPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <Navbar />
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl py-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2">
          Terms & Conditions
        </h1>
        <p className="text-xs text-foreground/30 mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-foreground/60 leading-relaxed text-sm">
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
              and code — is the property of WebApp and is protected by applicable intellectual
              property laws. You may not reproduce, distribute, or create derivative works
              without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Services</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our
              services at any time without notice. We are not liable to you or any third
              party for any modification, suspension, or discontinuation of services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, WebApp shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your
              use of the website or our services, even if advised of the possibility of
              such damages.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable
              law. Any disputes arising under these Terms shall be subject to the exclusive
              jurisdiction of the relevant courts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Contact</h2>
            <p>
              For any questions regarding these Terms & Conditions, please contact us
              through the Connect form on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
