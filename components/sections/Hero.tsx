"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DURATION, EASE } from "@/lib/animation";
import { Glitter } from "@/components/animations/Glitter";
import { DaVinciLines } from "@/components/animations/DaVinciLines";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth spring follow
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  // Map mouse position to a subtle image shift (±20px)
  const bgX = useTransform(x, [-1, 1], [60, -60]);
  const bgY = useTransform(y, [-1, 1], [60, -60]);

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
        className="absolute -inset-20 -z-20"
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

      {/* Da Vinci geometric lines */}
      <DaVinciLines />

      {/* glitter particles */}
      <Glitter />

      {/* foreground figures — in front of all overlays, anchored to bottom sides */}
      {/* woman — left side, high up */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/1.1.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-[2%] h-[65%] w-auto pointer-events-none z-[3]"
      />
      {/* man — right side, slightly lower */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/1.2.png"
        alt=""
        aria-hidden
        className="absolute right-0 top-[24%] h-[65%] w-auto pointer-events-none z-[3]"
      />

      {/* content-layer — anchored to bottom, light and minimal */}
      <div className="absolute bottom-14 inset-x-0 z-10 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter] }}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-white/60 max-w-lg leading-snug"
        >
          Lorem ipsum dolor sit amet
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.2 }}
          className="mt-5 flex items-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold rounded-full bg-white/90 text-black hover:bg-white transition-all duration-normal ease-smooth"
          >
            Get started
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-fast"
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
