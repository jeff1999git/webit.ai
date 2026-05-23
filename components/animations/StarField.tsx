"use client";

import { useEffect, useRef } from "react";

const COLORS: [number, number, number][] = [
  [255, 255, 255],
  [180, 210, 255],
  [255, 240, 200],
  [210, 185, 255],
];

interface Star {
  angle: number;
  dist: number;
  size: number;
  colorIdx: number;
  twinkleSpeed: number;
  twinklePhase: number;
  orbitSpeed: number;
  isBright: boolean;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = window.matchMedia("(pointer: coarse)").matches;
    const TARGET_MS = mobile ? 1000 / 24 : 0; // 24 fps cap on mobile

    let raf: number;
    let stars: Star[] = [];
    let nebGrad: CanvasGradient | null = null;
    let neb2Grad: CanvasGradient | null = null;
    let lastDraw = 0;

    const build = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      const maxR = Math.sqrt(cx ** 2 + cy ** 2);

      const count = mobile
        ? Math.min(40, Math.max(15, Math.floor((w * h) / 9000)))
        : Math.floor((w * h) / 3200);

      stars = Array.from({ length: count }, () => {
        const dist = Math.min(Math.sqrt(-Math.log(1 - Math.random() * 0.99)) * 0.46, 1.25);
        const size =
          Math.random() < 0.04 ? Math.random() * 1.6 + 1.8
          : Math.random() < 0.25 ? Math.random() * 0.9 + 0.9
          : Math.random() * 0.5 + 0.25;

        return {
          angle: Math.random() * Math.PI * 2,
          dist,
          size,
          colorIdx:
            Math.random() < 0.55 ? 0
            : Math.random() < 0.5 ? 1
            : Math.random() < 0.5 ? 2 : 3,
          twinkleSpeed: Math.random() * 2 + 0.4,
          twinklePhase: Math.random() * Math.PI * 2,
          orbitSpeed: (0.008 + (1 - dist) * 0.014 + Math.random() * 0.006),
          isBright: size > 1.8,
        };
      });

      // Cache nebula gradients — recreated on resize, reused every frame
      nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.65);
      nebGrad.addColorStop(0,   "rgba(90, 50, 150, 0.18)");
      nebGrad.addColorStop(0.3, "rgba(30, 20,  90, 0.10)");
      nebGrad.addColorStop(0.7, "rgba(10, 10,  40, 0.05)");
      nebGrad.addColorStop(1,   "rgba(0,  0,   0,  0)");

      if (!mobile) {
        neb2Grad = ctx.createRadialGradient(cx * 0.4, cy * 0.6, 0, cx * 0.4, cy * 0.6, maxR * 0.35);
        neb2Grad.addColorStop(0, "rgba(20, 60, 120, 0.10)");
        neb2Grad.addColorStop(1, "rgba(0,  0,  0,   0)");
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      build();
    };

    const drawSparkle = (
      x: number, y: number, size: number,
      alpha: number, color: [number, number, number]
    ) => {
      const [r, g, b] = color;
      const arms = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      const diag = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

      ctx.save();
      ctx.translate(x, y);

      for (const a of arms) {
        ctx.save();
        ctx.rotate(a);
        const len = size * 7;
        const grad = ctx.createLinearGradient(0, 0, 0, -len);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.9})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.moveTo(-size * 0.25, 0);
        ctx.lineTo(0, -len);
        ctx.lineTo(size * 0.25, 0);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      for (const a of diag) {
        ctx.save();
        ctx.rotate(a);
        const len = size * 4;
        const grad = ctx.createLinearGradient(0, 0, 0, -len);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.moveTo(-size * 0.18, 0);
        ctx.lineTo(0, -len);
        ctx.lineTo(size * 0.18, 0);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);

      // Frame throttle on mobile — skip work, keep the loop alive
      if (mobile && t - lastDraw < TARGET_MS) return;
      lastDraw = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ts = t / 1000;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.sqrt(cx ** 2 + cy ** 2);

      if (nebGrad) {
        ctx.fillStyle = nebGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (!mobile && neb2Grad) {
        ctx.fillStyle = neb2Grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const s of stars) {
        const theta = s.angle + ts * s.orbitSpeed;
        const d = s.dist * maxR;
        const x = cx + Math.cos(theta) * d;
        const y = cy + Math.sin(theta) * (d * 0.55);

        if (x < -30 || x > canvas.width + 30 || y < -30 || y > canvas.height + 30) continue;

        const glow = (Math.sin(ts * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        const glitter = Math.pow(glow, 2.2);
        const alpha = 0.15 + glitter * 0.85;
        const r = s.size * (0.65 + glitter * 0.7);
        const col = COLORS[s.colorIdx];
        const [cr, cg, cb] = col;

        // Skip expensive per-star halo gradient on mobile
        if (!mobile) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
          halo.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.35})`);
          halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath();
          ctx.arc(x, y, r * 6, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();

        // Sparkle cross — desktop only
        if (!mobile && s.isBright && glitter > 0.45) {
          drawSparkle(x, y, r, (glitter - 0.45) / 0.55 * alpha * 0.85, col);
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
