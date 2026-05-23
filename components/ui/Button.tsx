import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base — transform-safe layout for future animation
        "relative inline-flex items-center justify-center font-medium rounded-full",
        "transition-all duration-normal ease-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        "disabled:pointer-events-none disabled:opacity-50",
        // Variants
        variant === "primary" && [
          "bg-white text-black",
          "hover:bg-white/90 hover:scale-[1.02]",
          "active:scale-[0.98]",
        ],
        variant === "outline" && [
          "border border-surface-border text-foreground",
          "hover:border-white/40 hover:bg-white/5",
          "hover:scale-[1.02] active:scale-[0.98]",
        ],
        variant === "ghost" && [
          "text-foreground/70",
          "hover:text-foreground hover:bg-white/5",
        ],
        // Sizes
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-13 px-8 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
