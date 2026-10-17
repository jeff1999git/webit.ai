import { SlideUp } from "@/components/animations/SlideUp";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  /** Heading content — wrap a phrase in <GradientText> for the accent treatment. */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional link/button shown beside the heading on wide screens. */
  action?: React.ReactNode;
  align?: "left" | "center";
  /** Heading level — h2 on the home page, h2/h3 inside pages. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}

/**
 * SectionHeader — the existing section intro pattern:
 * accent mono eyebrow + large bold heading (+ optional intro and action).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-20 flex flex-col gap-6",
        action && "md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <SlideUp>
          <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">{eyebrow}</p>
        </SlideUp>
        <SlideUp delay={0.05}>
          <Heading
            id={id}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
          >
            {title}
          </Heading>
        </SlideUp>
        {description && (
          <SlideUp delay={0.1}>
            <p className="mt-5 text-base text-foreground/60 leading-relaxed">{description}</p>
          </SlideUp>
        )}
      </div>
      {action && (
        <SlideUp delay={0.1} className="shrink-0">
          {action}
        </SlideUp>
      )}
    </div>
  );
}
