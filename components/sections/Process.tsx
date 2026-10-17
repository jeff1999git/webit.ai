"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fireflies } from "@/components/animations/Fireflies";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";
import { processSteps, type ProcessStep } from "@/content/company";

// Desktop placement + float timing per step, in reading order (left-to-right,
// top-to-bottom). Positions are relative to the box area below the heading
// (see the desktop <ol>), so the boxes never drift under it on short screens.
const LAYOUT = [
  { x: "36%", y: "18%", float: { dur: 4.5, delay: 0.4 } },
  { x: "58%", y: "34%", float: { dur: 4.2, delay: 0.8 } },
  { x: "44%", y: "56%", float: { dur: 3.9, delay: 1.4 } },
  { x: "54%", y: "76%", float: { dur: 3.3, delay: 1.1 } },
] as const;

const BOXES = processSteps.map((step, i) => ({ ...step, ...LAYOUT[i % LAYOUT.length] }));

const HEADING_ID = "process-heading";

const GLOW = {
  filter: [
    "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
    "drop-shadow(0 0 32px rgba(255,255,255,0.75))",
    "drop-shadow(0 0 8px rgba(255,255,255,0.25))",
  ],
};

const GLOW_TRANSITION = { duration: 2.8, repeat: Infinity, ease: "easeInOut" } as const;

function FloatingBox({
  number, title, text, x, y, float: { dur, delay },
}: ProcessStep & (typeof LAYOUT)[number]) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const open = hovered || focused;

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.div
        tabIndex={0}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        // Reveal on keyboard focus only — a mouse click shouldn't leave it open.
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        whileHover={{ scale: 1.1, y: -8 }}
        animate={focused ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className="cursor-default rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-4 origin-center
          hover:bg-white/20 hover:border-white/40 hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)]
          focus-visible:bg-white/20 focus-visible:border-white/40 focus-visible:shadow-[0_12px_40px_rgba(255,255,255,0.12)]
          outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
          transition-[background-color,border-color,box-shadow] duration-300"
        style={{ minWidth: 110 }}
      >
        <p className="text-xs font-mono text-foreground/50 text-center tracking-wide">
          {number}
        </p>
        <p className="mt-1 text-base font-bold text-foreground text-center tracking-wide">
          {title}
        </p>

        {/* Always available to assistive tech; the reveal below is visual only. */}
        <span className="sr-only">{text}</span>

        <AnimatePresence>
          {open && (
            <motion.p
              aria-hidden
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xs text-foreground/70 leading-relaxed text-center max-w-[160px] overflow-hidden"
            >
              {text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby={HEADING_ID}
      className="relative min-h-screen md:min-h-[max(100vh,40rem)] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* static background — an <img> rather than a CSS background so it can lazy-load */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/optimized/2-orig.webp"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />

      <Fireflies />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      {/* bottom-anchored glowing figure — desktop only */}
      <div className="hidden md:block">
        <picture>
          <source
            type="image/avif"
            srcSet="/optimized/2.2-640w.avif 640w, /optimized/2.2-1080w.avif 1080w, /optimized/2.2-1920w.avif 1920w, /optimized/2.2-orig.avif 2972w"
            sizes="(min-width: 1024px) 576px, 448px"
          />
          <source
            type="image/webp"
            srcSet="/optimized/2.2-640w.webp 640w, /optimized/2.2-1080w.webp 1080w, /optimized/2.2-1920w.webp 1920w, /optimized/2.2-orig.webp 2972w"
            sizes="(min-width: 1024px) 576px, 448px"
          />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/2.2-1080w.png"
            srcSet="/optimized/2.2-640w.png 640w, /optimized/2.2-1080w.png 1080w, /optimized/2.2-1920w.png 1920w, /optimized/2.2-orig.png 2972w"
            sizes="(min-width: 1024px) 576px, 448px"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute bottom-0 right-8 w-[28rem] lg:w-[36rem] object-contain object-bottom pointer-events-none"
            animate={GLOW}
            transition={GLOW_TRANSITION}
          />
        </picture>
      </div>

      {/* side-center glowing figure — desktop only */}
      <div className="hidden md:block">
        <picture>
          <source
            type="image/avif"
            srcSet="/optimized/2.1-640w.avif 640w, /optimized/2.1-1080w.avif 1080w, /optimized/2.1-1920w.avif 1920w, /optimized/2.1-orig.avif 2504w"
            sizes="(min-width: 1024px) 416px, 320px"
          />
          <source
            type="image/webp"
            srcSet="/optimized/2.1-640w.webp 640w, /optimized/2.1-1080w.webp 1080w, /optimized/2.1-1920w.webp 1920w, /optimized/2.1-orig.webp 2504w"
            sizes="(min-width: 1024px) 416px, 320px"
          />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/2.1-1080w.png"
            srcSet="/optimized/2.1-640w.png 640w, /optimized/2.1-1080w.png 1080w, /optimized/2.1-1920w.png 1920w, /optimized/2.1-orig.png 2504w"
            sizes="(min-width: 1024px) 416px, 320px"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute top-1/2 -translate-y-1/2 left-0 w-[20rem] lg:w-[26rem] object-contain pointer-events-none"
            animate={GLOW}
            transition={GLOW_TRANSITION}
          />
        </picture>
      </div>

      {/* heading — in-flow on mobile, pinned to the top centre on desktop */}
      <div className="relative z-10 w-full px-6 pt-20 text-center md:absolute md:top-24 md:inset-x-0 md:pt-0 md:pointer-events-none">
        <SlideUp>
          <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
            How we work
          </p>
        </SlideUp>
        <SlideUp delay={0.05}>
          <h2
            id={HEADING_ID}
            className="mx-auto max-w-3xl text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9),0_0_48px_rgba(0,0,0,0.7)]"
          >
            From idea to launch in{" "}
            {/* text-shadow would paint over clipped gradient text — use a filter shadow instead */}
            <GradientText className="[text-shadow:none] drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              four clear steps
            </GradientText>
          </h2>
        </SlideUp>
      </div>

      {/* mobile layout: static card grid */}
      <div className="md:hidden relative z-10 w-full px-6 pt-10 pb-20 flex items-center justify-center">
        <ol className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {BOXES.map((box) => (
            <li
              key={box.title}
              className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-4"
            >
              <p className="text-xs font-mono text-foreground/50 text-center tracking-wide">{box.number}</p>
              <p className="mt-1 text-sm font-bold text-foreground text-center tracking-wide">{box.title}</p>
              <p className="text-xs text-foreground/60 text-center mt-2 leading-relaxed">{box.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* desktop layout: floating boxes, placed within the area below the heading */}
      <ol className="hidden md:block absolute inset-x-0 top-[17rem] bottom-8">
        {BOXES.map((box) => (
          <li key={box.title}>
            <FloatingBox {...box} />
          </li>
        ))}
      </ol>
    </section>
  );
}
