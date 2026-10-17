"use client";

import { useEffect, useRef } from "react";

const COLORS: [number, number, number][] = [
  [255, 255, 255],
  [180, 210, 255],
  [255, 240, 200],
  [210, 185, 255],
];

// Each star's halo is pre-rendered once per colour and stamped with drawImage +
// globalAlpha, instead of creating a gradient for every star on every frame;
// the output matches. Sparkle crosses stay vector-drawn: their arms are only
// a few px wide, and a scaled-down sprite would make them flicker.
const HALO_SPRITE_R = 32; // sprite radius (px), drawn scaled to r * 6
const SPARKLE_ARMS = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
const SPARKLE_DIAGONALS = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
const FILL_STYLES = COLORS.map(([r, g, b]) => `rgb(${r},${g},${b})`);

function makeSprite(radius: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = radius * 2;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    ctx.translate(radius, radius);
    paint(ctx);
  }
  return sprite;
}

// Halo at full strength — the per-star alpha is applied with globalAlpha.
function makeHaloSprite([r, g, b]: [number, number, number]) {
  return makeSprite(HALO_SPRITE_R, (ctx) => {
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, HALO_SPRITE_R);
    halo.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
    halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(0, 0, HALO_SPRITE_R, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();
  });
}

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

    // Halos are desktop-only, so phones never build the sprites.
    const haloSprites = mobile ? [] : COLORS.map(makeHaloSprite);

    let raf = 0;
    let running = false;
    let inView = false; // set by the IntersectionObserver's first callback
    let stars: Star[] = [];
    let nebGrad: CanvasGradient | null = null;
    let neb2Grad: CanvasGradient | null = null;
    // Animation clock in ms. It only advances while the loop runs, so the
    // orbit resumes exactly where it paused instead of jumping ahead.
    let elapsed = 0;
    let lastFrame = -1; // previous rAF timestamp; -1 = first frame after (re)start
    let lastDraw = -Infinity;

    const build = () => {
      const w = canvas.width, h = canvas.height;

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

      buildGradients();
    };

    // Cache nebula gradients — recreated on resize, reused every frame
    const buildGradients = () => {
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const maxR = Math.sqrt(cx ** 2 + cy ** 2);

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

    // Four long arms and four short diagonals; alpha is baked into the gradients.
    const drawSparkle = (
      x: number, y: number, size: number,
      alpha: number, [r, g, b]: [number, number, number]
    ) => {
      const ray = (angle: number, len: number, halfWidth: number, rayAlpha: number) => {
        ctx.save();
        ctx.rotate(angle);
        const grad = ctx.createLinearGradient(0, 0, 0, -len);
        grad.addColorStop(0, `rgba(${r},${g},${b},${rayAlpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.moveTo(-halfWidth, 0);
        ctx.lineTo(0, -len);
        ctx.lineTo(halfWidth, 0);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      };

      ctx.save();
      ctx.translate(x, y);
      for (const a of SPARKLE_ARMS) ray(a, size * 7, size * 0.25, alpha * 0.9);
      for (const a of SPARKLE_DIAGONALS) ray(a, size * 4, size * 0.18, alpha * 0.5);
      ctx.restore();
    };

    // Draws the sky at animation time `ts` (seconds)
    const render = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

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

        ctx.globalAlpha = alpha;

        // Soft halo — desktop only
        if (!mobile) {
          const hr = r * 6;
          ctx.drawImage(haloSprites[s.colorIdx], x - hr, y - hr, hr * 2, hr * 2);
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = FILL_STYLES[s.colorIdx];
        ctx.fill();

        // Sparkle cross — desktop only
        if (!mobile && s.isBright && glitter > 0.45) {
          ctx.globalAlpha = 1;
          drawSparkle(x, y, r, ((glitter - 0.45) / 0.55) * alpha * 0.85, COLORS[s.colorIdx]);
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);

      if (lastFrame >= 0) elapsed += t - lastFrame;
      lastFrame = t;

      // Frame throttle on mobile — skip work, keep the loop alive
      if (mobile && elapsed - lastDraw < TARGET_MS) return;
      lastDraw = elapsed;

      render(elapsed / 1000);
    };

    // Run only while visible on screen and in a visible tab
    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        lastFrame = -1;
        raf = requestAnimationFrame(draw);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!running) render(elapsed / 1000); // keep a static frame on screen
    };

    const resize = () => {
      const widthChanged = canvas.width !== canvas.offsetWidth;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Only reshuffle the sky when the width changes. Height-only changes
      // (e.g. a form growing with validation messages) keep the same stars —
      // their positions are relative to the canvas, so they simply re-flow.
      if (widthChanged || stars.length === 0) build();
      else buildGradients();
      if (!running) render(elapsed / 1000); // resizing clears the canvas
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
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
