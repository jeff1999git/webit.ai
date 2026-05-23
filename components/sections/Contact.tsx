"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";
import { FadeIn } from "@/components/animations/FadeIn";
import { StarField } from "@/components/animations/StarField";

function BlinkingFigure() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none overflow-hidden">
      {/* invisible spacer — locks container to 3.1.png's natural aspect ratio */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/optimized/3.1-orig.webp" alt="" aria-hidden className="w-full h-auto invisible" />

      {/* closed eyes base */}
      <picture>
        <source srcSet="/optimized/3.1-orig.avif" type="image/avif" />
        <source srcSet="/optimized/3.1-orig.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/optimized/3.1-orig.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain object-top"
        />
      </picture>
      {/* open eyes — snaps in over the closed-eyes base; nudged left to correct source alignment */}
      <div className="absolute inset-0" style={{ transform: "translateX(9px) translateY(3px)" }}>
        <picture>
          <source srcSet="/optimized/3.2-orig.avif" type="image/avif" />
          <source srcSet="/optimized/3.2-orig.webp" type="image/webp" />
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src="/optimized/3.2-orig.png"
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
        </picture>
      </div>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-white text-black text-sm font-medium shadow-lg"
    >
      <span className="text-green-600">✓</span>
      {message}
    </motion.div>
  );
}

export function Contact() {
  const [fields, setFields] = useState({ name: "", email: "", whatsapp: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setFields({ name: "", email: "", whatsapp: "", message: "" });
      showToast("Message sent! We'll be in touch soon.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-24 md:justify-center md:pt-0 overflow-hidden">
      <StarField />

      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      {/* bottom-anchored blinking figure — desktop only */}
      <div className="absolute bottom-0 right-8 w-[42rem] pointer-events-none select-none hidden lg:block">
        <FadeIn delay={0.1}>
          <BlinkingFigure />
        </FadeIn>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-lg">
          <div>
            <div className="mb-10">
              <SlideUp>
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  Connect
                </h2>
              </SlideUp>
            </div>

            <FadeIn delay={0.2}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={fields.name}
                  onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                  className="h-12 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={fields.email}
                  onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                  className="h-12 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={fields.whatsapp}
                  onChange={(e) => setFields((f) => ({ ...f, whatsapp: e.target.value }))}
                  className="h-12 rounded-xl bg-surface border border-surface-border px-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Message"
                  value={fields.message}
                  onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
                  className="rounded-xl bg-surface border border-surface-border px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/60 transition-colors duration-fast resize-none"
                />
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-12 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-normal ease-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send"}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </section>
  );
}
