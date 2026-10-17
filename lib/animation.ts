// ─────────────────────────────────────────────
// Global Animation Configuration
// Centralised presets for Framer Motion & CSS.
// ─────────────────────────────────────────────

export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.7,
  cinematic: 1.2,
} as const;

export const EASE = {
  smooth: [0.25, 0.1, 0.25, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  enter: [0.0, 0.0, 0.2, 1] as const,
  exit: [0.4, 0.0, 1, 1] as const,
  cinematic: [0.76, 0, 0.24, 1] as const,
};

// Transition presets — pass directly to Framer Motion `transition` prop
export const TRANSITION = {
  default: { duration: DURATION.normal, ease: EASE.smooth },
  slow: { duration: DURATION.slow, ease: EASE.enter },
};

// Variant presets — compose into Framer Motion `variants` prop
export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITION.default },
  },
  slideUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: TRANSITION.slow },
  },
  slideDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0, transition: TRANSITION.slow },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: TRANSITION.slow },
  },
  slideRight: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0, transition: TRANSITION.slow },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: TRANSITION.default },
  },
};

// Stagger config — for parent containers with staggered children
export const STAGGER = {
  fast: { staggerChildren: 0.06 },
  normal: { staggerChildren: 0.1 },
  slow: { staggerChildren: 0.15 },
};

// Viewport config — for scroll-triggered animations
export const VIEWPORT = {
  once: true,
  amount: 0.15,
} as const;

