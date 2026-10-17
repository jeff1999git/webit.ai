import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/content/services";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="mb-12 md:mb-20 max-w-2xl">
          <SlideUp>
            <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
              What we do
            </p>
          </SlideUp>
          <SlideUp delay={0.05}>
            <h2
              id="services-heading"
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
            >
              Services built around{" "}
              <GradientText>your business</GradientText>
            </h2>
          </SlideUp>
          <SlideUp delay={0.1}>
            <p className="mt-5 text-base text-foreground/60 leading-relaxed">
              From a first website to custom business software, we plan, build and support digital
              products that fit the way you work.
            </p>
          </SlideUp>
        </div>

        {/* Services grid — 7 services + a CTA cell that closes the grid evenly
            (2 columns: 8 cells; 3 columns: 7 + a 2-wide cell). */}
        <StaggerContainer speed="normal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border">
          {services.map((service) => (
            <RevealOnScroll
              key={service.slug}
              direction="up"
              className="group relative bg-background p-6 md:p-8 hover:bg-surface transition-colors duration-normal ease-smooth"
            >
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-foreground/50">
                    {service.number}
                  </span>
                  <Icon name={service.icon} className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed flex-1">
                  {service.summary}
                </p>
                <ButtonLink
                  href={`/services#${service.slug}`}
                  variant="text"
                  arrow
                  aria-label={`Learn more about ${service.title}`}
                  className="self-start pt-2"
                >
                  Learn more
                </ButtonLink>
              </div>
            </RevealOnScroll>
          ))}

          {/* Enquiry cell */}
          <RevealOnScroll
            direction="up"
            className="relative bg-background p-6 md:p-8 md:col-span-1 lg:col-span-2"
          >
            <div className="flex flex-col h-full justify-center gap-4">
              <h3 className="text-xl font-semibold text-foreground">
                Not sure what you need?
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
                Tell us what you want to achieve and we&apos;ll help you work out the right
                approach, scope and next steps.
              </p>
              <ButtonLink href="/contact" arrow className="self-start mt-2">
                Tell us about your project
              </ButtonLink>
            </div>
          </RevealOnScroll>
        </StaggerContainer>
      </div>
    </section>
  );
}
