"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { VIEWPORT, VARIANTS } from "@/lib/animation";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface RevealOnScrollProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const directionVariants: Record<Direction, Variants> = {
  up: VARIANTS.slideUp,
  down: VARIANTS.slideDown,
  left: VARIANTS.slideLeft,
  right: VARIANTS.slideRight,
  fade: VARIANTS.fadeIn,
  scale: VARIANTS.scaleIn,
};

/**
 * RevealOnScroll — flexible scroll-triggered reveal in any direction.
 * Future: extend with clip-path, parallax depth, and stagger support.
 */
export function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  className,
  ...rest
}: RevealOnScrollProps) {
  const variants = directionVariants[direction];
  const visibleState = variants.visible;
  const baseTransition =
    visibleState && typeof visibleState === "object" && !Array.isArray(visibleState) && "transition" in visibleState
      ? (visibleState.transition as object)
      : {};

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants}
      transition={{ ...baseTransition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
