import { Navbar } from "@/components/layout/Navbar";
import { StarField } from "@/components/animations/StarField";

export const metadata = { title: "Privacy Policy — WebitAi" };

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2 [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)]">
          Privacy Policy
        </h1>
        <p className="text-xs text-foreground/30 mb-10 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">Last updated: May 2026</p>

        <div className="space-y-8 text-foreground/60 leading-relaxed text-sm [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, email
              address, and WhatsApp number when you use our contact form. We also collect
              usage data automatically when you interact with our website, including IP
              address, browser type, pages visited, and time spent.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to respond to your inquiries, improve our
              services, send relevant communications, and analyse how our website is used.
              We will never sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfil the purposes
              outlined in this policy, unless a longer retention period is required by law.
              You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Cookies</h2>
            <p>
              Our website uses essential cookies to ensure basic functionality. We do not
              use tracking or advertising cookies. You can disable cookies in your browser
              settings, although this may affect your experience on the site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us
              via the Connect form on our website or email us at{" "}
              <a href="https://mail.google.com/mail/?view=cm&to=webitailabs@gmail.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-foreground transition-colors">
                webitailabs@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
