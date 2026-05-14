"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
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

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

  const bgX = useTransform(x, [-1, 1], [60, -60]);
  const bgY = useTransform(y, [-1, 1], [60, -60]);

  const figX = useTransform(x, [-1, 1], [-45, 45]);
  const figY = useTransform(y, [-1, 1], [-28, 28]);

  const { scrollY } = useScroll();
  const womanScrollX = useTransform(scrollY, [0, 600], [0, 70]);
  const manScrollX   = useTransform(scrollY, [0, 600], [0, -70]);

  // combine cursor parallax + scroll compression per figure
  const womanX = useTransform([figX, womanScrollX], ([fx, sx]) => (fx as number) + (sx as number));
  const manX   = useTransform([figX, manScrollX],   ([fx, sx]) => (fx as number) + (sx as number));

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

      {/* foreground figures */}
      <div className="absolute inset-0 z-[3] pointer-events-none mx-auto w-full max-w-6xl">

        {/* woman — parallax → entrance → float */}
        <motion.div
          className="absolute left-0 top-[12%]"
          style={isTouch ? undefined : { x: womanX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: ELASTIC }}
          >
            <motion.img
              // eslint-disable-next-line @next/next/no-img-element
              src="/1.1.png"
              alt=""
              aria-hidden
              className="w-[48vw] md:w-[420px] h-auto object-contain"
              animate={isTouch ? {} : { y: [0, -16, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            />
          </motion.div>
        </motion.div>

        {/* man — parallax → entrance → float */}
        <motion.div
          className="absolute right-0 top-[34%]"
          style={isTouch ? undefined : { x: manX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: ELASTIC }}
          >
            <motion.img
              // eslint-disable-next-line @next/next/no-img-element
              src="/1.2.png"
              alt=""
              aria-hidden
              className="w-[48vw] md:w-[420px] h-auto object-contain"
              animate={isTouch ? {} : { y: [0, -11, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            />
          </motion.div>
        </motion.div>

      </div>

      {/* content — anchored to bottom, light and minimal */}
      <div className="absolute bottom-14 inset-x-0 z-10 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.7 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-white/60 max-w-lg leading-snug"
        >
          Lorem ipsum dolor sit amet
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.85 }}
          className="mt-5 flex items-center gap-4"
        >
          {/* primary CTA — elastic spring on hover */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold rounded-full bg-white/90 text-black hover:bg-white"
          >
            Get started
          </motion.a>

          {/* secondary CTA */}
          <motion.a
            href="#about"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors duration-fast"
          >
            Learn more
            <span aria-hidden className="text-xs">→</span>
          </motion.a>
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
