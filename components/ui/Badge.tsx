import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        "border border-surface-border bg-surface px-3 py-1",
        "text-xs font-medium text-foreground/70 tracking-wide",
        className
      )}
    >
      {children}
    </span>
  );
}
