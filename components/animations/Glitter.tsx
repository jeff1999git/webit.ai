"use client";

import { useEffect, useRef } from "react";

export function Glitter({ count = 70 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.0 + 0.4,
      speed: Math.random() * 0.45 + 0.1,
      angle: Math.random() * Math.PI * 2,
      // slow angular drift — each particle curves gradually in its own direction
      angleSpeed: (Math.random() * 0.018 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      opacity: Math.random(),
      dOpacity: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
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

        // Soft glow halo
        const glow = p.r * 5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        g.addColorStop(0, `rgba(255,252,210,${p.opacity * 0.85})`);
        g.addColorStop(0.35, `rgba(255,248,180,${p.opacity * 0.22})`);
        g.addColorStop(1, "rgba(255,245,150,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}
