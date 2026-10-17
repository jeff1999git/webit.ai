import { StarField } from "@/components/animations/StarField";
import { SlideUp } from "@/components/animations/SlideUp";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Buttons/links under the intro. */
  actions?: React.ReactNode;
  /** Content above the eyebrow, e.g. a breadcrumb. */
  before?: React.ReactNode;
  /** Content below the actions, e.g. badges. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * PageHero — header for inner pages, matching the existing sub-page look
 * (StarField backdrop, large shadowed heading). The canvas is confined to
 * this header so long pages don't animate a page-height canvas.
 */
export function PageHero({ eyebrow, title, intro, actions, before, children, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-6xl pt-32 pb-16 md:pt-40 md:pb-24">
        {before}
        <div className="max-w-3xl">
          <SlideUp>
            <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
              {eyebrow}
            </p>
          </SlideUp>
          <SlideUp delay={0.05}>
            {/* text-shadow would paint over clipped gradient text, so GradientText gets a filter shadow instead */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05] [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)] [&_.bg-clip-text]:[text-shadow:none] [&_.bg-clip-text]:drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              {title}
            </h1>
          </SlideUp>
          {intro && (
            <SlideUp delay={0.1}>
              <p className="mt-6 text-base md:text-lg text-foreground/70 leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
                {intro}
              </p>
            </SlideUp>
          )}
          {actions && (
            <SlideUp delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-4">{actions}</div>
            </SlideUp>
          )}
          {children}
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />
    </section>
  );
}
