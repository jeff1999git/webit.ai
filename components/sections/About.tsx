"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";

export function About() {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  const bgX = useTransform(x, [-1, 1], [60, -60]);
  const bgY = useTransform(y, [-1, 1], [60, -60]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width * 2 - 1);
    rawY.set((e.clientY - rect.top) / rect.height * 2 - 1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section
      ref={ref}
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* parallax background */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-20 -z-20"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url('/2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      {/* overlay */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />

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
