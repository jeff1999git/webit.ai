"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fireflies } from "@/components/animations/Fireflies";

const BOXES = [
  {
    word: "Design",
    desc: "Pixel-perfect interfaces crafted to captivate, delight, and guide every user effortlessly.",
    x: "38%", y: "12%",
    float: { dur: 3.6, delay: 0 },
  },
  {
    word: "Strategy",
    desc: "Aligning technology with your vision to drive meaningful, measurable business outcomes.",
    x: "62%", y: "28%",
    float: { dur: 4.2, delay: 0.8 },
  },
  {
    word: "Build",
    desc: "Scalable, robust digital products engineered for performance, reliability, and longevity.",
    x: "42%", y: "52%",
    float: { dur: 3.9, delay: 1.4 },
  },
  {
    word: "Launch",
    desc: "Taking your ideas from concept to market swiftly, with precision and full confidence.",
    x: "22%", y: "34%",
    float: { dur: 4.5, delay: 0.4 },
  },
  {
    word: "Grow",
    desc: "Continuous optimisation and intelligent scaling to keep your digital presence ahead.",
    x: "60%", y: "64%",
    float: { dur: 3.3, delay: 1.1 },
  },
];

function FloatingBox({
  word, desc, x, y, float: { dur, delay },
}: (typeof BOXES)[number]) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, translateX: "-50%", translateY: "-50%" }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={hovered ? { scale: 1.45 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="cursor-default rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-4 shadow-lg origin-center"
        style={{ minWidth: 110 }}
      >
        <p className="text-base font-bold text-foreground text-center tracking-wide">
          {word}
        </p>

        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 10 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
              className="text-xs text-foreground/70 leading-relaxed text-center max-w-[160px]"
            >
              {desc}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

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

      <Fireflies />

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

      {/* floating boxes */}
      {BOXES.map((box) => (
        <FloatingBox key={box.word} {...box} />
      ))}
    </section>
  );
}
