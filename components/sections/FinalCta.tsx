import { SlideUp } from "@/components/animations/SlideUp";
import { EmailLink } from "@/components/ui/EmailLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ContactScene } from "@/components/sections/ContactScene";
import { site, whatsappHref } from "@/content/site";

const inlineLink =
  "text-foreground/80 underline decoration-foreground/30 underline-offset-4 hover:text-foreground hover:decoration-foreground/60 transition-colors duration-fast";

/**
 * FinalCta — closing call to action on the home page, set in the contact
 * scene. Keeps id="contact" so older /#contact links still land here.
 */
export function FinalCta() {
  const email = site.contact.email;
  const whatsapp = whatsappHref();

  return (
    <ContactScene id="contact" variant="cta">
      <SlideUp>
        <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Have a Project in Mind?
        </h2>
      </SlideUp>

      <SlideUp delay={0.1}>
        <p className="text-base text-foreground/60 leading-relaxed mb-8">
          Tell us what you&apos;re planning. Let&apos;s discuss the right solution for your business.
        </p>
      </SlideUp>

      <SlideUp delay={0.15}>
        <ButtonLink href="/contact" arrow className="h-12 px-7">
          Discuss Your Project
        </ButtonLink>
      </SlideUp>

      {(email || whatsapp) && (
        <SlideUp delay={0.2}>
          <p className="mt-8 text-sm text-foreground/60 leading-relaxed">
            {email && (
              <>
                Prefer email?{" "}
                <EmailLink email={email} className={inlineLink} />
              </>
            )}
            {email && whatsapp && <span aria-hidden> · </span>}
            {whatsapp && (
              <>
                {email ? "Or message us on " : "Prefer to chat? Message us on "}
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </>
            )}
          </p>
        </SlideUp>
      )}
    </ContactScene>
  );
}
