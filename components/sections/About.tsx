import { SlideUp } from "@/components/animations/SlideUp";

export function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6 max-w-2xl">
        <SlideUp>
          <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
            About
          </p>
        </SlideUp>

        <SlideUp delay={0.05}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Ut enim ad minim veniam
          </h2>
        </SlideUp>

        <SlideUp delay={0.1}>
          <p className="text-foreground/50 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </SlideUp>

        <SlideUp delay={0.15}>
          <p className="text-foreground/50 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </SlideUp>
      </div>
    </section>
  );
}
