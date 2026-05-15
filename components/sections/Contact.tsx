"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";
import { FadeIn } from "@/components/animations/FadeIn";

function BlinkingFigure() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none overflow-hidden">
      {/* invisible spacer — locks container to 3.1.png's natural aspect ratio */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/3.1.png" alt="" aria-hidden className="w-full h-auto invisible" />

      {/* open eyes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/3.1.png"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-contain object-top"
      />
      {/* open eyes — snaps in over the closed-eyes base; nudged left to correct source alignment */}
      <div className="absolute inset-0" style={{ transform: "translateX(9px)" }}>
        <motion.img
          // eslint-disable-next-line @next/next/no-img-element
          src="/3.2.png"
          alt=""
          aria-hidden
          className="w-full h-full object-contain object-top"
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            times: [0, 0.499, 0.501, 1],
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* left — heading + form */}
          <div>
            <div className="mb-10">
              <SlideUp>
                <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                  Connect
                </p>
              </SlideUp>
              <SlideUp delay={0.05}>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                  Quis nostrud exercitation
                </h2>
              </SlideUp>
              <SlideUp delay={0.1}>
                <p className="mt-4 text-foreground/50">
                  Duis aute irure dolor in reprehenderit in voluptate velit.
                </p>
              </SlideUp>
            </div>

            <FadeIn delay={0.2}>
              {submitted ? (
                <div className="py-16">
                  <p className="text-2xl font-semibold text-foreground mb-2">Done!</p>
                  <p className="text-foreground/50">Lorem ipsum dolor sit amet.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    className="h-12 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className="h-12 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast"
                  />
                  <textarea
                    required
                    rows={4}
                    placeholder="Message"
                    className="rounded-xl bg-surface border border-surface-border px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast resize-none"
                  />
                  <button
                    type="submit"
                    className="mt-2 h-12 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-normal ease-smooth"
                  >
                    Send
                  </button>
                </form>
              )}
            </FadeIn>
          </div>

          {/* right — blinking figure */}
          <FadeIn delay={0.1}>
            <BlinkingFigure />
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
