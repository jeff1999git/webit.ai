"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "@/components/animations/SlideUp";
import { FadeIn } from "@/components/animations/FadeIn";

function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0, frame = 0;

    // Polar-coord star — orbits the galactic center
    type GalStar = {
      angle: number; dist: number; r: number;
      baseOpacity: number; twinkleSpeed: number; twinklePhase: number;
      color: string; orbitSpeed: number;
    };
    // Cartesian background star — twinkle only, covers full section edges
    type BgStar = {
      x: number; y: number; r: number;
      baseOpacity: number; twinkleSpeed: number; twinklePhase: number;
      color: string;
    };
    type Meteor = {
      x: number; y: number; vx: number; vy: number;
      life: number; trail: { x: number; y: number }[];
    };
    type Nebula = {
      rx: number; ry: number; radius: number;
      color: string; baseAlpha: number; phase: number; pulseSpeed: number;
    };

    let galStars: GalStar[] = [];
    let bgStars: BgStar[] = [];
    let meteors: Meteor[] = [];

    const COLORS = ["255,255,255", "210,190,255", "180,215,255", "255,240,210", "195,220,255"];

    const NEBULAE: Nebula[] = [
      { rx: 0.50, ry: 0.50, radius: 0.45, color: "100,55,210",  baseAlpha: 0.13, phase: 0.0, pulseSpeed: 0.0025 },
      { rx: 0.28, ry: 0.38, radius: 0.32, color: "139,92,246",  baseAlpha: 0.11, phase: 1.0, pulseSpeed: 0.0035 },
      { rx: 0.74, ry: 0.62, radius: 0.28, color: "59,130,246",  baseAlpha: 0.09, phase: 2.1, pulseSpeed: 0.0045 },
      { rx: 0.10, ry: 0.72, radius: 0.24, color: "168,85,247",  baseAlpha: 0.08, phase: 0.7, pulseSpeed: 0.003  },
      { rx: 0.88, ry: 0.22, radius: 0.22, color: "99,102,241",  baseAlpha: 0.08, phase: 1.5, pulseSpeed: 0.005  },
      { rx: 0.50, ry: 0.08, radius: 0.20, color: "139,92,246",  baseAlpha: 0.07, phase: 3.0, pulseSpeed: 0.004  },
      { rx: 0.50, ry: 0.92, radius: 0.20, color: "79,70,229",   baseAlpha: 0.07, phase: 2.3, pulseSpeed: 0.004  },
      { rx: 0.08, ry: 0.30, radius: 0.18, color: "120,80,255",  baseAlpha: 0.06, phase: 4.1, pulseSpeed: 0.006  },
      { rx: 0.92, ry: 0.70, radius: 0.18, color: "80,120,255",  baseAlpha: 0.06, phase: 0.3, pulseSpeed: 0.005  },
    ];

    const build = () => {
      const diag = Math.hypot(W, H) * 0.5;

      // Full-coverage background scatter stars
      const bgCount = Math.max(150, Math.floor((W * H) / 4500));
      bgStars = Array.from({ length: bgCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.7 + 0.1,
        baseOpacity: Math.random() * 0.28 + 0.04,
        twinkleSpeed: Math.random() * 0.01 + 0.002,
        twinklePhase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      // Galaxy disc stars in polar coords — two spiral arms
      const galCount = Math.max(300, Math.floor((W * H) / 1600));
      galStars = Array.from({ length: galCount }, () => {
        const arm = Math.random() < 0.5 ? 0 : Math.PI;
        const t = Math.pow(Math.random(), 0.5) * 4.2;
        const spiralAngle = arm + t * 1.5 + (Math.random() - 0.5) * 0.7;
        const dist = Math.min(t * diag * 0.21 + (Math.random() - 0.5) * diag * 0.12, diag * 0.95);
        // Differential rotation: inner orbits faster (galaxy flat-curve approximation)
        const normDist = dist / diag;
        const orbitSpeed = 0.00006 + 0.00028 / (normDist + 0.08);
        return {
          angle: spiralAngle,
          dist,
          r: Math.random() * 1.5 + 0.2,
          baseOpacity: Math.random() * 0.72 + 0.15,
          twinkleSpeed: Math.random() * 0.022 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          orbitSpeed,
        };
      });
    };

    const spawnMeteor = () => {
      const fromTop = Math.random() < 0.6;
      const x = fromTop ? Math.random() * W : -10;
      const y = fromTop ? -10 : Math.random() * H * 0.5;
      const speed = 5 + Math.random() * 7;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
      meteors.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, trail: [] });
    };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      build();
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5, cy = H * 0.5;

      // Animated nebulae
      for (const n of NEBULAE) {
        n.phase += n.pulseSpeed;
        const alpha = n.baseAlpha * (0.75 + 0.25 * Math.sin(n.phase));
        const r = n.radius * Math.min(W, H) * (0.95 + 0.05 * Math.cos(n.phase * 0.7));
        const grd = ctx.createRadialGradient(n.rx * W, n.ry * H, 0, n.rx * W, n.ry * H, r);
        grd.addColorStop(0,   `rgba(${n.color},${alpha})`);
        grd.addColorStop(0.5, `rgba(${n.color},${alpha * 0.35})`);
        grd.addColorStop(1,   `rgba(${n.color},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Pulsing galactic core
      const corePulse = 0.13 + 0.04 * Math.sin(frame * 0.007);
      const coreR = Math.min(W, H) * corePulse;
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrd.addColorStop(0,   "rgba(230,195,255,0.28)");
      coreGrd.addColorStop(0.35,"rgba(160,100,255,0.12)");
      coreGrd.addColorStop(1,   "rgba(100,60,200,0)");
      ctx.fillStyle = coreGrd;
      ctx.fillRect(0, 0, W, H);

      // Background scatter stars (twinkle, no movement)
      for (const s of bgStars) {
        s.twinklePhase += s.twinkleSpeed;
        const op = s.baseOpacity * (0.5 + 0.5 * Math.sin(s.twinklePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${op})`;
        ctx.fill();
      }

      // Orbiting galaxy stars
      for (const s of galStars) {
        s.angle += s.orbitSpeed;
        s.twinklePhase += s.twinkleSpeed;
        const op = s.baseOpacity * (0.5 + 0.5 * Math.sin(s.twinklePhase));
        const x = cx + Math.cos(s.angle) * s.dist;
        const y = cy + Math.sin(s.angle) * s.dist * 0.42; // flatten to elliptical disc
        if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;

        if (s.r > 1.0) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, s.r * 5);
          glow.addColorStop(0, `rgba(${s.color},${op * 0.38})`);
          glow.addColorStop(1, `rgba(${s.color},0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${op})`;
        ctx.fill();
      }

      // Shooting stars / meteors
      if (frame % 200 === 0 && Math.random() < 0.7) spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > 22) m.trail.shift();
        m.x += m.vx; m.y += m.vy; m.life -= 0.013;
        if (m.life <= 0 || m.x > W + 50 || m.y > H + 50) { meteors.splice(i, 1); continue; }

        for (let j = 1; j < m.trail.length; j++) {
          const t = j / m.trail.length;
          ctx.beginPath();
          ctx.moveTo(m.trail[j - 1].x, m.trail[j - 1].y);
          ctx.lineTo(m.trail[j].x, m.trail[j].y);
          ctx.strokeStyle = `rgba(220,200,255,${t * m.life * 0.85})`;
          ctx.lineWidth = t * 1.8;
          ctx.stroke();
        }
        const hGrd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 3.5);
        hGrd.addColorStop(0, `rgba(255,255,255,${m.life})`);
        hGrd.addColorStop(1, "rgba(190,170,255,0)");
        ctx.fillStyle = hGrd;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

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
    <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <GalaxyBackground />
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

          {/* right — blinking figure */}
          <FadeIn delay={0.1}>
            <BlinkingFigure />
          </FadeIn>

        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </section>
  );
}
