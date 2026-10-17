"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 70;
const GLOW_SPRITE_R = 16; // drawn scaled to r * 5

// The glow is pre-rendered once at full strength and stamped with globalAlpha,
// instead of building a gradient for every particle on every frame.
function makeGlowSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = GLOW_SPRITE_R * 2;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const R = GLOW_SPRITE_R;
    const g = ctx.createRadialGradient(R, R, 0, R, R, R);
    g.addColorStop(0, "rgba(255,252,210,0.85)");
    g.addColorStop(0.35, "rgba(255,248,180,0.22)");
    g.addColorStop(1, "rgba(255,245,150,0)");
    ctx.beginPath();
    ctx.arc(R, R, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  return sprite;
}

export function Glitter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on mobile
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = false;
    let inView = false; // set by the IntersectionObserver's first callback

    const glowSprite = makeGlowSprite();

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 1.0 + 0.4,
      speed: Math.random() * 0.45 + 0.1,
      angle: Math.random() * Math.PI * 2,
      // slow angular drift — each particle curves gradually in its own direction
      angleSpeed: (Math.random() * 0.018 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      opacity: Math.random(),
      dOpacity: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // Draws the current state; `advance` steps the simulation one frame first
    const render = (advance: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        if (advance) {
          // Gradually steer — makes paths curve and loop organically
          p.angle += p.angleSpeed;
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;

          // Wrap around all edges seamlessly
          if (p.x < -6) p.x = canvas.width + 6;
          if (p.x > canvas.width + 6) p.x = -6;
          if (p.y < -6) p.y = canvas.height + 6;
          if (p.y > canvas.height + 6) p.y = -6;

          // Twinkle
          p.opacity += p.dOpacity;
          if (p.opacity >= 1) { p.opacity = 1; p.dOpacity = -Math.abs(p.dOpacity); }
          if (p.opacity <= 0) { p.opacity = 0; p.dOpacity = Math.abs(p.dOpacity); }
        }

        ctx.globalAlpha = p.opacity;

        // Soft glow halo
        const glow = p.r * 5;
        ctx.drawImage(glowSprite, p.x - glow, p.y - glow, glow * 2, glow * 2);

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      render(true);
      frameRef.current = requestAnimationFrame(tick);
    };

    // Run only while visible on screen and in a visible tab
    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        frameRef.current = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameRef.current);
      }
      if (!running) render(false); // keep a static frame on screen
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (!running) render(false); // resizing clears the canvas
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}
