"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DURATION, EASE } from "@/lib/animation";
import { Glitter } from "@/components/animations/Glitter";
import { DaVinciLines } from "@/components/animations/DaVinciLines";

// Shopify-style elastic overshoot easing
const ELASTIC = [0.34, 1.56, 0.64, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Detect touch/pointer-coarse devices — disable all motion on those
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const cyclingWords = ["amet", "ipsum", "dolor"];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % cyclingWords.length), 2000);
    return () => clearInterval(id);
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  const bgX = useTransform(x, [-1, 1], [60, -60]);
  const bgY = useTransform(y, [-1, 1], [60, -60]);

  const figX = useTransform(x, [-1, 1], [-45, 45]);
  const figY = useTransform(y, [-1, 1], [-28, 28]);


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
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden isolate"
    >
      {/* parallax background — static on touch devices */}
      <motion.div
        aria-hidden
        style={isTouch ? undefined : { x: bgX, y: bgY }}
        className="absolute -inset-20 -z-20"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url('/optimized/1-orig.webp')",
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

      {/* foreground figures */}
      <div className="absolute inset-0 z-[3] pointer-events-none mx-auto w-full max-w-6xl">

        {/* woman — parallax → entrance → float */}
        <motion.div
          className="absolute left-0 top-[12%]"
          style={isTouch ? undefined : { x: figX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: ELASTIC }}
          >
            <picture>
              <source srcSet="/optimized/1.1-orig.avif" type="image/avif" />
              <source srcSet="/optimized/1.1-orig.webp" type="image/webp" />
              <motion.img
                // eslint-disable-next-line @next/next/no-img-element
                src="/optimized/1.1-orig.png"
                alt=""
                aria-hidden
                className="w-[48vw] md:w-[420px] h-auto object-contain"
                animate={isTouch ? {} : { y: [0, -16, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* man — parallax → entrance → float */}
        <motion.div
          className="absolute right-0 top-[34%]"
          style={isTouch ? undefined : { x: figX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: ELASTIC }}
          >
            <picture>
              <source srcSet="/optimized/1.2-orig.avif" type="image/avif" />
              <source srcSet="/optimized/1.2-orig.webp" type="image/webp" />
              <motion.img
                // eslint-disable-next-line @next/next/no-img-element
                src="/optimized/1.2-orig.png"
                alt=""
                aria-hidden
                className="w-[48vw] md:w-[420px] h-auto object-contain"
                animate={isTouch ? {} : { y: [0, -11, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              />
            </picture>
          </motion.div>
        </motion.div>

      </div>

      {/* centered bordered content box — above figures (z-[4] > figures z-[3]) */}
      <div className="absolute inset-0 z-[4] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [...EASE.enter] }}
          className="border-2 border-white p-6 w-full max-w-[340px]"
        >
          {/* question */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.7 }}
            className="text-sm font-bold tracking-[0.12em] uppercase text-white mb-4"
          >
            Lorem ipsum dolor sit{" "}
            <span className="inline-block relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cyclingWords[wordIndex]}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="inline-block"
                >
                  {cyclingWords[wordIndex]}?
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>

          {/* answer */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.85 }}
            className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
          >
            Lorem ipsum<br />dolor sit amet.
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 1.0 }}
            className="text-sm text-white/50 leading-relaxed mb-6"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
            <span className="text-white/70 font-medium">Sed do eiusmod</span> tempor incididunt
            ut labore et dolore magna aliqua.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 1.15 }}
            className="flex items-center gap-4"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="inline-flex items-center justify-center h-9 px-5 text-xs font-semibold rounded-full bg-white/90 text-black hover:bg-white"
            >
              Get started
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
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
