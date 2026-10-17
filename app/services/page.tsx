import type { Metadata } from "next";
import { EmailLink } from "@/components/ui/EmailLink";
import { PageHero } from "@/components/layout/PageHero";
import { SlideUp } from "@/components/animations/SlideUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GradientText } from "@/components/ui/GradientText";
import { Icon } from "@/components/ui/Icon";
import { services, type Service } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, web and mobile apps, custom software, e-commerce stores, backend and API development, and ongoing maintenance for growing businesses.",
  alternates: { canonical: "/services" },
};

/** Bulleted list with accent check marks, used in each service's detail grid. */
function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3 text-sm text-foreground/70 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DetailCell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-background p-6", className)}>
      <h3 className="mb-4 text-xs font-medium tracking-widest uppercase text-foreground/50">{label}</h3>
      {children}
    </div>
  );
}

function ServiceBlock({ service }: { service: Service }) {
  const headingId = `${service.slug}-heading`;

  return (
    <section
      id={service.slug}
      aria-labelledby={headingId}
      className="border-t border-surface-border first:border-t-0 py-16 md:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <SlideUp className="lg:col-span-5">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-xs font-mono text-foreground/50">{service.number}</span>
            <Icon name={service.icon} className="h-6 w-6 text-accent" />
          </div>
          <h2
            id={headingId}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
          >
            {service.title}
          </h2>
          <p className="mt-5 text-base text-foreground/60 leading-relaxed">{service.intro}</p>
          <div className="mt-8">
            <ButtonLink href={`/contact?service=${service.slug}`} arrow>
              {service.ctaLabel}
            </ButtonLink>
          </div>
        </SlideUp>

        <RevealOnScroll direction="up" delay={0.05} className="lg:col-span-7">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface-border sm:grid-cols-2">
            <DetailCell label="What's included">
              <CheckList items={service.includes} />
            </DetailCell>
            <DetailCell label="Good for">
              <CheckList items={service.useCases} />
            </DetailCell>
            <DetailCell label="What you get" className="sm:col-span-2">
              <CheckList items={service.deliverables} />
              <p className="mt-5 text-xs text-foreground/50">
                Final scope and deliverables are agreed for each project.
              </p>
            </DetailCell>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  const email = site.contact.email;

  return (
    <div>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Software and web services for <GradientText>growing businesses</GradientText>
          </>
        }
        intro="From a first website to custom business software, we design, build and support the digital products your business runs on. Each project is scoped around your goals, users and budget."
        actions={
          <>
            <ButtonLink href="/contact" arrow>
              Start a Project
            </ButtonLink>
            <ButtonLink href="/projects" variant="glass">
              See our work
            </ButtonLink>
          </>
        }
      >
        <SlideUp delay={0.2}>
          <nav aria-label="Services on this page" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <a
                    href={`#${service.slug}`}
                    className="inline-flex h-8 items-center rounded-full border border-white/25 bg-white/15 px-4 text-xs font-medium text-foreground/90 backdrop-blur-lg transition-colors duration-fast ease-smooth hover:bg-white/25 hover:text-foreground"
                  >
                    {service.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </SlideUp>
      </PageHero>

      <div className="container mx-auto px-6 max-w-6xl">
        {services.map((service) => (
          <ServiceBlock key={service.slug} service={service} />
        ))}
      </div>

      {/* Estimate / enquiry band */}
      <section aria-labelledby="estimate-heading" className="relative pb-20 md:pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <SlideUp>
            <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                    Pricing &amp; estimates
                  </p>
                  <h2
                    id="estimate-heading"
                    className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                  >
                    Have a project <GradientText>in mind?</GradientText>
                  </h2>
                  <p className="mt-5 text-base text-foreground/60 leading-relaxed">
                    Pricing depends on scope, so we don&apos;t publish fixed prices. Tell us what you
                    need and we&apos;ll prepare a project estimate.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-6">
                  <ButtonLink href="/contact" arrow>
                    Request an estimate
                  </ButtonLink>
                  {email && (
                    <EmailLink
                      email={email}
                      className="text-sm font-medium text-foreground/70 transition-colors duration-fast ease-smooth hover:text-foreground"
                    >
                      Email us
                    </EmailLink>
                  )}
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>
    </div>
  );
}
