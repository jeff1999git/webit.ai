"use client";

export function DaVinciLines() {
  const cx = 500, cy = 500;

  const polyPoints = (r: number, n: number, startDeg = -90) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i * 360) / n + startDeg) * (Math.PI / 180);
      return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
    }).join(" ");

  // 3 rings — outer two extend past viewBox edges to cover the hero
  const radii = [160, 360, 620];

  // 12 radial lines at 30° intervals
  const radialLines = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    return {
      x1: (cx + radii[0] * Math.cos(a)).toFixed(2),
      y1: (cy + radii[0] * Math.sin(a)).toFixed(2),
      x2: (cx + radii[2] * Math.cos(a)).toFixed(2),
      y2: (cy + radii[2] * Math.sin(a)).toFixed(2),
    };
  });

  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      aria-hidden
    >
      <g stroke="white" fill="none" strokeWidth="0.6" opacity="0.18">

        {/* 3 concentric circles */}
        {radii.map(r => <circle key={r} cx={cx} cy={cy} r={r} />)}

        {/* 12 radial lines */}
        {radialLines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}

        {/* Hexagon at middle ring */}
        <polygon points={polyPoints(360, 6, -90)} />

        {/* Square at inner ring */}
        <polygon points={polyPoints(160, 4, -45)} />

        {/* Center cross */}
        <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} strokeWidth="0.8" />
        <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={2.5} fill="white" stroke="none" />

      </g>
    </svg>
  );
}
