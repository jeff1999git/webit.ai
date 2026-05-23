"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fireflies } from "@/components/animations/Fireflies";

const BOXES = [
  {
    word: "Design",
    desc: "Pixel-perfect interfaces crafted to captivate, delight, and guide every user effortlessly.",
    x: "40%", y: "12%",
    float: { dur: 3.6, delay: 0 },
  },
  {
    word: "Strategy",
    desc: "Aligning technology with your vision to drive meaningful, measurable business outcomes.",
    x: "58%", y: "24%",
    float: { dur: 4.2, delay: 0.8 },
  },
  {
    word: "Build",
    desc: "Scalable, robust digital products engineered for performance, reliability, and longevity.",
    x: "44%", y: "50%",
    float: { dur: 3.9, delay: 1.4 },
  },
  {
    word: "Launch",
    desc: "Taking your ideas from concept to market swiftly, with precision and full confidence.",
    x: "36%", y: "34%",
    float: { dur: 4.5, delay: 0.4 },
  },
  {
    word: "Grow",
    desc: "Continuous optimisation and intelligent scaling to keep your digital presence ahead.",
    x: "52%", y: "66%",
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
        whileHover={{ scale: 1.1, y: -8 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className="cursor-default rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 px-6 py-4 origin-center
          hover:bg-white/20 hover:border-white/40 hover:shadow-[0_12px_40px_rgba(255,255,255,0.12)]
          transition-[background-color,border-color,box-shadow] duration-300"
        style={{ minWidth: 110 }}
      >
        <p className="text-base font-bold text-foreground text-center tracking-wide">
          {word}
        </p>

        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xs text-foreground/70 leading-relaxed text-center max-w-[160px] overflow-hidden"
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

      {/* bottom-anchored glowing figure — desktop only */}
      <div className="hidden md:block">
        <picture>
          <source srcSet="/optimized/2.2-orig.avif" type="image/avif" />
          <source srcSet="/optimized/2.2-orig.webp" type="image/webp" />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/2.2-orig.png"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute bottom-0 right-8 w-[28rem] lg:w-[36rem] object-contain object-bottom pointer-events-none"
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
      </div>

      {/* side-center glowing figure — desktop only */}
      <div className="hidden md:block">
        <picture>
          <source srcSet="/optimized/2.1-orig.avif" type="image/avif" />
          <source srcSet="/optimized/2.1-orig.webp" type="image/webp" />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/2.1-orig.png"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute top-1/2 -translate-y-1/2 left-0 w-[20rem] lg:w-[26rem] object-contain pointer-events-none"
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
      </div>

      {/* mobile layout: static card grid */}
      <div className="md:hidden relative z-10 w-full px-6 py-8 flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {BOXES.map((box) => (
            <div
              key={box.word}
              className={`rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-4${box.word === "Build" ? " col-span-2" : ""}`}
            >
              <p className="text-sm font-bold text-foreground text-center tracking-wide">{box.word}</p>
              <p className="text-xs text-foreground/60 text-center mt-2 leading-relaxed">{box.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* desktop layout: floating boxes */}
      {BOXES.map((box) => (
        <div key={box.word} className="hidden md:block">
          <FloatingBox {...box} />
        </div>
      ))}
    </section>
  );
}
