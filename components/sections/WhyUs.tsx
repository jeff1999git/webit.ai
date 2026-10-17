import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { GradientText } from "@/components/ui/GradientText";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { reasons } from "@/content/company";

export function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Subtle section separator glow */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6">
        <SectionHeader
          id="why-us-heading"
          eyebrow="Why Webitai Labs"
          title={
            <>
              A dependable partner for{" "}
              <GradientText>what you build next</GradientText>
            </>
          }
          description="We focus on understanding your business, building it properly and staying available once it's live."
        />

        {/* Reasons grid — 6 cells divide evenly into 2 and 3 columns */}
        <StaggerContainer
          speed="normal"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border"
        >
          {reasons.map((reason) => (
            <RevealOnScroll
              key={reason.title}
              direction="up"
              className="group relative bg-background p-6 md:p-8 hover:bg-surface transition-colors duration-normal ease-smooth"
            >
              <div className="flex flex-col h-full gap-4">
                <Icon name={reason.icon} className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">{reason.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{reason.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
