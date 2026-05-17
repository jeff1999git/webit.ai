"use client";

import { motion } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";

export function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* static background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/optimized/2-orig.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      {/* bottom-anchored glowing figure */}
      <picture>
        <source srcSet="/optimized/2.2-orig.avif" type="image/avif" />
        <source srcSet="/optimized/2.2-orig.webp" type="image/webp" />
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src="/optimized/2.2-orig.png"
          alt=""
          aria-hidden
          className="absolute bottom-0 right-8 w-[36rem] object-contain object-bottom pointer-events-none"
          animate={{
            filter: [
              "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
              "drop-shadow(0 0 32px rgba(255,255,255,0.75))",
              "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </picture>

      {/* side-center glowing figure */}
      <picture>
        <source srcSet="/optimized/2.1-orig.avif" type="image/avif" />
        <source srcSet="/optimized/2.1-orig.webp" type="image/webp" />
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src="/optimized/2.1-orig.png"
          alt=""
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 left-0 w-[26rem] object-contain pointer-events-none"
          animate={{
            filter: [
              "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
              "drop-shadow(0 0 32px rgba(255,255,255,0.75))",
              "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </picture>

      <div className="container mx-auto px-6 max-w-2xl w-full">
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
