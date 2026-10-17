"use client";

import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;        // twinkle phase
  blinkSpeed: number;
  wanderAngle: number;  // current movement heading
  wanderSpeed: number;
}

export function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on mobile
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let inView = false; // set by the IntersectionObserver's first callback
    let flies: Firefly[] = [];
    let last = -1;      // previous frame timestamp; -1 = first frame after (re)start
    let elapsed = 0;    // seconds of animation actually played (excludes pauses)

    const build = () => {
      const count = Math.max(18, Math.floor((canvas.width * canvas.height) / 28000));
      flies = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.4 + 0.8,
        phase: Math.random() * Math.PI * 2,
        blinkSpeed: Math.random() * 0.8 + 0.4,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: Math.random() * 18 + 10, // px/s
      }));
    };

    // Advances the swarm by dt seconds and draws it (dt = 0 → static frame)
    const render = (dt: number) => {
      elapsed += dt;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ts = elapsed;

      for (const f of flies) {
        // gently steer the wander angle (smooth organic drift)
        f.wanderAngle += (Math.random() - 0.5) * 1.8 * dt * Math.PI;
        f.vx = Math.cos(f.wanderAngle) * f.wanderSpeed;
        f.vy = Math.sin(f.wanderAngle) * f.wanderSpeed;

        f.x += f.vx * dt;
        f.y += f.vy * dt;

        // soft wrap at edges
        if (f.x < -10) f.x = canvas.width + 10;
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.y < -10) f.y = canvas.height + 10;
        if (f.y > canvas.height + 10) f.y = -10;

        // blink — power curve so they stay dim most of the time, then flash
        const raw = (Math.sin(ts * f.blinkSpeed + f.phase) + 1) / 2;
        const blink = Math.pow(raw, 2.5);
        const alpha = 0.08 + blink * 0.92;
        const r = f.radius * (0.6 + blink * 0.7);

        // warm yellow-green firefly colour
        const rr = Math.round(180 + blink * 75);
        const gg = Math.round(220 + blink * 35);
        const bb = Math.round(60 + blink * 20);

        // outer soft halo
        const halo = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 9);
        halo.addColorStop(0, `rgba(${rr},${gg},${bb},${alpha * 0.3})`);
        halo.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 9, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // inner mid glow
        const mid = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r * 3);
        mid.addColorStop(0, `rgba(${rr},${gg},${bb},${alpha * 0.7})`);
        mid.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = mid;
        ctx.fill();

        // bright core dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb + 80},${alpha})`;
        ctx.fill();
      }
    };

    const draw = (t: number) => {
      const dt = last < 0 ? 0 : Math.min((t - last) / 1000, 0.05);
      last = t;
      render(dt);
      raf = requestAnimationFrame(draw);
    };

    // Run only while visible on screen and in a visible tab
    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        last = -1; // resume from where we paused — no time jump
        raf = requestAnimationFrame(draw);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!running) render(0); // keep a static frame on screen
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      build();
      if (!running) render(0); // resizing clears the canvas
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
