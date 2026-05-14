"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DURATION, EASE } from "@/lib/animation";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth spring follow
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  // Map mouse position to a subtle image shift (±20px)
  const bgX = useTransform(x, [-1, 1], [20, -20]);
  const bgY = useTransform(y, [-1, 1], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -1 → 1
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
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden isolate"
    >
      {/* bg-layer: parallax image — slightly oversized so edges never show on shift */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-8 -z-20"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url('/1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      {/* overlay */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />

      {/* content-layer */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05] max-w-4xl"
        >
          Lorem ipsum dolor sit amet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.15 }}
          className="mt-6 text-lg md:text-xl text-foreground/50 max-w-xl leading-relaxed"
        >
          Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-12 px-8 text-sm font-semibold rounded-full bg-white text-black hover:bg-white/90 transition-all duration-normal ease-smooth"
          >
            Get started
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors duration-fast"
          >
            Learn more
            <span aria-hidden className="text-xs">→</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-foreground/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
