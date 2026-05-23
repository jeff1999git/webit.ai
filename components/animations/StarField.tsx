"use client";

import { useEffect, useRef } from "react";

const COLORS: [number, number, number][] = [
  [255, 255, 255],   // white
  [180, 210, 255],   // blue-white
  [255, 240, 200],   // warm gold
  [210, 185, 255],   // lavender
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

    let raf: number;
    let stars: Star[] = [];

    const build = () => {
      const count = Math.floor((canvas.width * canvas.height) / 3200);
      const maxR = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2;

      stars = Array.from({ length: count }, () => {
        // gaussian-ish density — denser toward center like a galaxy core
        const dist = Math.min(Math.sqrt(-Math.log(1 - Math.random() * 0.99)) * 0.46, 1.25);
        const size =
          Math.random() < 0.04 ? Math.random() * 1.6 + 1.8  // bright
          : Math.random() < 0.25 ? Math.random() * 0.9 + 0.9  // medium
          : Math.random() * 0.5 + 0.25;                         // tiny

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
          // inner stars orbit slightly faster (visual depth)
          orbitSpeed: (0.008 + (1 - dist) * 0.014 + Math.random() * 0.006),
          isBright: size > 1.8,
        };
      });
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
      // diagonal shorter arms
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ts = t / 1000;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.sqrt(cx ** 2 + cy ** 2);

      // nebula core glow
      const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.65);
      neb.addColorStop(0,   "rgba(90, 50, 150, 0.18)");
      neb.addColorStop(0.3, "rgba(30, 20,  90, 0.10)");
      neb.addColorStop(0.7, "rgba(10, 10,  40, 0.05)");
      neb.addColorStop(1,   "rgba(0,  0,   0,  0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // off-center secondary nebula for depth
      const neb2 = ctx.createRadialGradient(cx * 0.4, cy * 0.6, 0, cx * 0.4, cy * 0.6, maxR * 0.35);
      neb2.addColorStop(0,   "rgba(20, 60, 120, 0.10)");
      neb2.addColorStop(1,   "rgba(0,  0,  0,   0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const theta = s.angle + ts * s.orbitSpeed;
        const d = s.dist * maxR;
        const x = cx + Math.cos(theta) * d;
        const y = cy + Math.sin(theta) * (d * 0.55); // flatten vertically → elliptical galaxy

        if (x < -30 || x > canvas.width + 30 || y < -30 || y > canvas.height + 30) continue;

        const glow = (Math.sin(ts * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        // glitter: occasionally spike to full brightness then drop fast
        const glitter = Math.pow(glow, 2.2);
        const alpha = 0.15 + glitter * 0.85;
        const r = s.size * (0.65 + glitter * 0.7);
        const col = COLORS[s.colorIdx];
        const [cr, cg, cb] = col;

        // outer halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        halo.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.35})`);
        halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();

        // sparkle cross — only on bright stars, only when near peak brightness
        if (s.isBright && glitter > 0.45) {
          drawSparkle(x, y, r, (glitter - 0.45) / 0.55 * alpha * 0.85, col);
        }
      }

      raf = requestAnimationFrame(draw);
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
