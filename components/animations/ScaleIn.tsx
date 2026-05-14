"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { VARIANTS, VIEWPORT } from "@/lib/animation";

interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * ScaleIn — element scales up from slightly smaller.
 * Future: pair with blur filter for cinematic focus-in effect.
 */
export function ScaleIn({ children, delay = 0, className, ...rest }: ScaleInProps) {
  const transition = VARIANTS.scaleIn.visible.transition;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={VARIANTS.scaleIn}
      transition={{ ...transition, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
