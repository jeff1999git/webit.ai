"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { VARIANTS, VIEWPORT } from "@/lib/animation";

interface SlideUpProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * SlideUp — content rises into view from below.
 * Future: replace y offset with clip-path mask reveal for premium effect.
 */
export function SlideUp({ children, delay = 0, className, ...rest }: SlideUpProps) {
  const transition = VARIANTS.slideUp.visible.transition;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={VARIANTS.slideUp}
      transition={{ ...transition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
