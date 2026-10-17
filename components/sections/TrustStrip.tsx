import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Icon } from "@/components/ui/Icon";
import { trustPillars } from "@/content/company";

/**
 * TrustStrip — compact band under the hero listing how we work.
 * Commitments only: no numbers, client counts or claims.
 */
export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative border-y border-surface-border"
    >
      <div className="container mx-auto px-6 py-12 md:py-16">
        <h2 id="trust-heading" className="sr-only">
          What you can expect
        </h2>

        {/* 1 col → 2 cols (last cell spans) → 5 cols, so no empty cells show */}
        <StaggerContainer
          speed="normal"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-surface-border"
        >
          {trustPillars.map((pillar, i) => (
            <RevealOnScroll
              key={pillar.title}
              direction="fade"
              className={
                i === trustPillars.length - 1
                  ? "bg-background p-6 sm:col-span-2 lg:col-span-1"
                  : "bg-background p-6"
              }
            >
              <div className="flex items-start gap-3">
                <Icon name="check" className="mt-0.5 h-4 w-4 text-accent" strokeWidth={2} />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">{pillar.text}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
