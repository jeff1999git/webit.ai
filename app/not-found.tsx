import type { Metadata } from "next";
import { StarField } from "@/components/animations/StarField";
import { SlideUp } from "@/components/animations/SlideUp";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center overflow-hidden">
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl pt-32 pb-24">
        <SlideUp>
          <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
            404
          </p>
        </SlideUp>
        <SlideUp delay={0.05}>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05] [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)]">
            This page could not be found
          </h1>
        </SlideUp>
        <SlideUp delay={0.1}>
          <p className="mt-6 text-base md:text-lg text-foreground/70 leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
            The link may be out of date, or the page may have moved. Head back to the home page,
            explore our services or get in touch and we&apos;ll point you in the right direction.
          </p>
        </SlideUp>
        <SlideUp delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/services" variant="glass">
              Our services
            </ButtonLink>
            <ButtonLink href="/contact" variant="text" arrow>
              Contact us
            </ButtonLink>
          </div>
        </SlideUp>
      </div>
    </div>
  );
}
