"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { STAGGER, VIEWPORT } from "@/lib/animation";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  speed?: keyof typeof STAGGER;
  delay?: number;
  className?: string;
}

/**
 * StaggerContainer — parent that staggers its children's animations.
 * Children must use any animation variant (FadeIn, SlideUp, etc).
 * Future: orchestrate complex multi-layer reveal sequences here.
 */
export function StaggerContainer({
  children,
  speed = "normal",
  delay = 0,
  className,
  ...rest
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            ...STAGGER[speed],
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
