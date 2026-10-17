"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { StarField } from "@/components/animations/StarField";
import { cn } from "@/lib/utils";

function BlinkingFigure() {
  return (
    // aspect ratio of 3.1-orig (811×1082) — sizes the box without a spacer image
    <div className="relative w-full max-w-sm mx-auto select-none overflow-hidden aspect-[811/1082]">
      {/* closed eyes base */}
      <picture>
        <source srcSet="/optimized/3.1-orig.avif" type="image/avif" />
        <source srcSet="/optimized/3.1-orig.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/optimized/3.1-orig.png"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain object-top"
        />
      </picture>
      {/* open eyes — snaps in over the closed-eyes base; nudged left to correct source alignment */}
      <div className="absolute inset-0" style={{ transform: "translateX(9px) translateY(3px)" }}>
        <picture>
          <source srcSet="/optimized/3.2-orig.avif" type="image/avif" />
          <source srcSet="/optimized/3.2-orig.webp" type="image/webp" />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/3.2-orig.png"
            alt=""
            aria-hidden
            loading="lazy"
            className="w-full h-full object-contain object-top"
            animate={{ opacity: [0, 0, 1, 1] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              times: [0, 0.499, 0.501, 1],
              ease: "linear",
            }}
          />
        </picture>
      </div>
    </div>
  );
}

interface ContactSceneProps {
  id?: string;
  children: React.ReactNode;
  /**
   * "cta"  — home-page band: fills the screen with content centred vertically.
   * "page" — /contact: content is top-aligned under the fixed header, since the
   *          full enquiry form is taller than the screen.
   */
  variant?: "cta" | "page";
  className?: string;
}

/**
 * ContactScene — the starfield + blinking figure backdrop shared by the home
 * page's closing call to action and the /contact page.
 */
export function ContactScene({ id, children, variant = "cta", className }: ContactSceneProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative min-h-screen overflow-hidden",
        variant === "cta" && "flex flex-col items-center justify-start pt-24 md:justify-center md:pt-0",
        variant === "page" && "pt-32 pb-24",
        className
      )}
    >
      <StarField />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      {/* bottom-anchored blinking figure — desktop only */}
      <div className="absolute bottom-0 right-8 w-[42rem] pointer-events-none select-none hidden lg:block">
        <FadeIn delay={0.1}>
          <BlinkingFigure />
        </FadeIn>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        {/* z-10 keeps the content above the figure where they overlap (≈1024–1095px) */}
        <div className="relative z-10 max-w-lg">{children}</div>
      </div>
    </section>
  );
}
