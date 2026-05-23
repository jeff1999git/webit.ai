"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { VARIANTS, VIEWPORT } from "@/lib/animation";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FadeIn — lightweight opacity reveal.
 * Future: add blur, scale, or colour-shift variants.
 */
export function FadeIn({ children, delay = 0, className, ...rest }: FadeInProps) {
  const transition = VARIANTS.fadeIn.visible.transition;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={VARIANTS.fadeIn}
      transition={{ ...transition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
