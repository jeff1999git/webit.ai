import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SlideUp } from "@/components/animations/SlideUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GradientText } from "@/components/ui/GradientText";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSteps } from "@/content/company";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Webitai Labs is an IT services and software development company helping small businesses, startups and growing companies build websites, apps and custom software.",
  alternates: { canonical: "/about" },
};

const principles: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "target",
    title: "Understand before building",
    text: "We start by learning how your business works and what the software needs to achieve, before any design or code.",
  },
  {
    icon: "layers",
    title: "Build what's needed",
    text: "Scope is shaped around your goal and budget, so effort goes into the features that make a real difference.",
  },
  {
    icon: "software",
    title: "Modern, maintainable technology",
    text: "Proven frameworks and clean, documented code that is straightforward to extend and hand over.",
  },
  {
    icon: "milestone",
    title: "Transparent communication",
    text: "Agreed milestones and regular updates, so you always know what is done, what is next and why.",
  },
  {
    icon: "shield",
    title: "Performance, security and scale",
    text: "Speed, data protection and room to grow are considered from the first decision, not added at the end.",
  },
  {
    icon: "support",
    title: "Support after launch",
    text: "Fixes, updates and improvements remain available once your product is live.",
  },
];

const audiences = [
  {
    title: "Small businesses",
    text: "Establishing or refreshing an online presence, or replacing manual processes with simple, dependable software.",
  },
  {
    title: "Startups",
    text: "Turning an idea into a focused first version that can be tested with real users and improved over time.",
  },
  {
    title: "Growing companies",
    text: "Building custom tools, portals and integrations when off-the-shelf products no longer fit the way the team works.",
  },
];

/** Closing call-to-action band, shared visual style with the services page. */
function CtaBand() {
  return (
    <section aria-labelledby="about-cta-heading" className="relative pb-20 md:pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <SlideUp>
          <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                  Work with us
                </p>
                <h2
                  id="about-cta-heading"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                >
                  Let&apos;s build something <GradientText>useful</GradientText>
                </h2>
                <p className="mt-5 text-base text-foreground/60 leading-relaxed">
                  Tell us about your business and what you want to achieve. We&apos;ll help you work
                  out the right next step.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-6">
                <ButtonLink href="/contact" arrow>
                  Start a Project
                </ButtonLink>
                <ButtonLink href="/services" variant="text" arrow>
                  Explore our services
                </ButtonLink>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const location = site.contact.location;

  return (
    <div>
      <PageHero
        eyebrow={`About ${site.name}`}
        title={
          <>
            Practical software for <GradientText>real businesses</GradientText>
          </>
        }
        intro={`${site.name} is an IT services and software development company that helps small businesses, startups and growing companies establish their digital presence and build software tailored to how they work.`}
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
      />

      {/* Purpose */}
      <section aria-labelledby="purpose-heading" className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SlideUp>
                <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                  Our purpose
                </p>
              </SlideUp>
              <SlideUp delay={0.05}>
                <h2
                  id="purpose-heading"
                  className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
                >
                  Why we <GradientText>exist</GradientText>
                </h2>
              </SlideUp>
            </div>
            <SlideUp delay={0.1} className="lg:col-span-7">
              <div className="space-y-6 text-base text-foreground/60 leading-relaxed">
                <p>
                  Many businesses depend on technology every day but don&apos;t have an in-house
                  team to plan, build and look after it. Choosing tools, finding developers and
                  keeping everything running can take time away from the work that matters.
                </p>
                <p>
                  We act as that technology partner. Whether you need a first website, an
                  application for your customers or custom software for your team, we help you
                  decide what to build, build it properly and keep it working after launch.
                </p>
                <blockquote className="border-l-2 border-accent pl-5 italic text-foreground/80">
                  &ldquo;{site.tagline}&rdquo;
                </blockquote>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="approach-heading" className="relative py-20 md:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
        />
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader
            id="approach-heading"
            eyebrow="Our approach"
            title={
              <>
                How we approach <GradientText>software</GradientText>
              </>
            }
          />
          <StaggerContainer
            speed="normal"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border"
          >
            {principles.map((principle) => (
              <RevealOnScroll
                key={principle.title}
                direction="up"
                className="bg-background p-6 md:p-8 hover:bg-surface transition-colors duration-normal ease-smooth"
              >
                <div className="flex flex-col gap-4">
                  <Icon name={principle.icon} className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-semibold text-foreground">{principle.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{principle.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Audiences */}
      <section aria-labelledby="audience-heading" className="relative py-20 md:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
        />
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader
            id="audience-heading"
            eyebrow="Who we work with"
            title={
              <>
                Built for businesses <GradientText>at every stage</GradientText>
              </>
            }
            action={
              <ButtonLink href="/services" variant="text" arrow>
                See all services
              </ButtonLink>
            }
          />
          <StaggerContainer
            speed="normal"
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-border"
          >
            {audiences.map((audience) => (
              <RevealOnScroll key={audience.title} direction="up" className="bg-background p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground">{audience.title}</h3>
                <p className="mt-4 text-sm text-foreground/60 leading-relaxed">{audience.text}</p>
              </RevealOnScroll>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process recap */}
      <section aria-labelledby="process-heading" className="relative py-20 md:py-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
        />
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader
            id="process-heading"
            eyebrow="How we work"
            title={
              <>
                Four steps from idea <GradientText>to launch</GradientText>
              </>
            }
          />
          <StaggerContainer speed="normal">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border">
              {processSteps.map((step) => (
                <li key={step.number} className="bg-background">
                  <RevealOnScroll direction="up" className="flex h-full flex-col gap-4 p-6 md:p-8">
                    <span className="text-xs font-mono text-foreground/50" aria-hidden>
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{step.text}</p>
                  </RevealOnScroll>
                </li>
              ))}
            </ol>
          </StaggerContainer>

          {location && (
            <SlideUp>
              <p className="mt-10 text-sm text-foreground/60">Based in {location}.</p>
            </SlideUp>
          )}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
