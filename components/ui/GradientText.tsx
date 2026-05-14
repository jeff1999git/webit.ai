import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  // Future: allow different gradient directions/stops
  variant?: "purple" | "blue" | "warm";
}

const gradients = {
  purple: "from-violet-400 via-purple-400 to-indigo-400",
  blue: "from-blue-400 via-cyan-400 to-sky-400",
  warm: "from-amber-400 via-orange-400 to-rose-400",
};

/**
 * GradientText — animated gradient shimmer on text.
 * Future: animate backgroundPosition for shimmer sweep effect.
 */
export function GradientText({
  children,
  className,
  variant = "purple",
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradients[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
