"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { DURATION, EASE } from "@/lib/animation";
import { Glitter } from "@/components/animations/Glitter";
import { DaVinciLines } from "@/components/animations/DaVinciLines";
import { Icon } from "@/components/ui/Icon";

// Shopify-style elastic overshoot easing
const ELASTIC = [0.34, 1.56, 0.64, 1] as const;

const CYCLING_WORDS = ["small businesses", "startups", "growing companies"] as const;
const CYCLE_INTERVAL_MS = 2000;

// Client-side Next links that keep the hover/tap spring animations
const MotionLink = motion.create(Link);

// Background box is 160px larger than the viewport (-inset-20); the 4095×2489
// image covers it by height on portrait-ish screens and by width otherwise.
// Capped at 1920w: the photo sits under a 55% black overlay, so the 4K
// original (1.2 MB) added weight without visible detail.
const BG_SIZES = "(max-aspect-ratio: 1645/1000) calc((100vh + 160px) * 1.645), calc(100vw + 160px)";
// Portrait screens only ever show the middle of the photo, so they get a 3:4
// centre crop of it — object-cover shows the same area as with the full image.
const BG_PORTRAIT_MEDIA = "(max-aspect-ratio: 2/3)";
const BG_PORTRAIT_SIZES = "calc((100vh + 160px) * 0.75)";

// Figures are hidden below md — the 1×1 fallback means phones download nothing.
const FIGURE_MEDIA = "(min-width: 768px)";
const FIGURE_SIZES = "420px";
const BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const figureSrcSet = (name: string, ext: "avif" | "webp" | "png") =>
  [640, 1080, 1920]
    .map((w) => `/optimized/${name}-${w}w.${ext} ${w}w`)
    .concat(`/optimized/${name}-orig.${ext} 4096w`)
    .join(", ");

function FigureSources({ name }: { name: string }) {
  return (
    <>
      <source media={FIGURE_MEDIA} type="image/avif" srcSet={figureSrcSet(name, "avif")} sizes={FIGURE_SIZES} />
      <source media={FIGURE_MEDIA} type="image/webp" srcSet={figureSrcSet(name, "webp")} sizes={FIGURE_SIZES} />
      <source media={FIGURE_MEDIA} srcSet={figureSrcSet(name, "png")} sizes={FIGURE_SIZES} />
    </>
  );
}

/** Owns the cycling timer, so each tick re-renders this span instead of the whole hero. */
function CyclingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % CYCLING_WORDS.length), CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
  const activeWord = CYCLING_WORDS[wordIndex];

  return (
    // every word shares one grid cell, so the widest reserves the width
    <span className="inline-grid">
      {CYCLING_WORDS.map((word) => (
        <span key={word} className="invisible col-start-1 row-start-1">
          {word}
        </span>
      ))}
      <AnimatePresence mode="wait">
        <motion.span
          key={activeWord}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="col-start-1 row-start-1"
        >
          {activeWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Detect touch/pointer-coarse devices — disable all motion on those
  const [isStill, setIsStill] = useState(false);
  useEffect(() => {
    setIsStill(window.matchMedia("(pointer: coarse)").matches);
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
        style={isStill ? undefined : { x: bgX, y: bgY }}
        className="absolute -inset-20 -z-20"
      >
        {/* WebP only: for this photo it is smaller than AVIF at every width */}
        <picture>
          <source
            media={BG_PORTRAIT_MEDIA}
            type="image/webp"
            srcSet="/optimized/1-portrait-1080w.webp 1080w, /optimized/1-portrait-1440w.webp 1440w"
            sizes={BG_PORTRAIT_SIZES}
          />
          <source
            media={BG_PORTRAIT_MEDIA}
            srcSet="/optimized/1-portrait-1080w.jpg 1080w, /optimized/1-portrait-1440w.jpg 1440w"
            sizes={BG_PORTRAIT_SIZES}
          />
          <source
            type="image/webp"
            srcSet="/optimized/1-640w.webp 640w, /optimized/1-1080w.webp 1080w, /optimized/1-1920w.webp 1920w"
            sizes={BG_SIZES}
          />
          <img
            src="/optimized/1-1920w.jpg"
            srcSet="/optimized/1-640w.jpg 640w, /optimized/1-1080w.jpg 1080w, /optimized/1-1920w.jpg 1920w"
            sizes={BG_SIZES}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="block w-full h-full object-cover object-center"
          />
        </picture>
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
          className="hidden md:block absolute left-0 top-[12%]"
          style={isStill ? undefined : { x: figX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: ELASTIC }}
          >
            <picture>
              <FigureSources name="1.1" />
              <motion.img
                // eslint-disable-next-line @next/next/no-img-element
                src={BLANK_GIF}
                alt=""
                aria-hidden
                className="w-[48vw] md:w-[420px] h-auto object-contain"
                animate={isStill ? {} : { y: [0, -16, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* man — parallax → entrance → float */}
        <motion.div
          className="hidden md:block absolute right-0 top-[34%]"
          style={isStill ? undefined : { x: figX, y: figY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: ELASTIC }}
          >
            <picture>
              <FigureSources name="1.2" />
              <motion.img
                // eslint-disable-next-line @next/next/no-img-element
                src={BLANK_GIF}
                alt=""
                aria-hidden
                className="w-[48vw] md:w-[420px] h-auto object-contain"
                animate={isStill ? {} : { y: [0, -11, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              />
            </picture>
          </motion.div>
        </motion.div>

      </div>

      {/* centered bordered content box — above figures (z-[4] > figures z-[3]).
          In-flow (not absolute) so longer copy grows the section instead of
          clipping under the fixed nav on small or landscape screens. */}
      <div className="relative z-[4] flex min-h-screen w-full items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [...EASE.enter] }}
          className="border border-white p-6 w-full max-w-[420px]"
        >
          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.7 }}
            className="text-sm font-bold tracking-[0.12em] uppercase text-white mb-4"
          >
            <span className="sr-only">Built for small businesses, startups and growing companies</span>
            <span aria-hidden>
              Built for <CyclingWord />
            </span>
          </motion.p>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 0.85 }}
            className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight mb-4"
          >
            We Turn Business Ideas Into Digital Products.
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 1.0 }}
            className="text-sm text-white/90 leading-relaxed mb-6 drop-shadow-sm"
          >
            From high-performing websites to custom applications and business software, Webitai Labs
            helps businesses build the technology they need to grow.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: [...EASE.enter], delay: 1.15 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <MotionLink
              href="/contact"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="inline-flex items-center justify-center h-9 px-5 text-xs font-semibold rounded-full bg-white/90 text-black hover:bg-white"
            >
              Start a Project
            </MotionLink>
            <MotionLink
              href="/services"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors duration-fast"
            >
              Explore Our Services
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </MotionLink>
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
