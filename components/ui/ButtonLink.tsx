import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type Variant = "primary" | "glass" | "text";
type Size = "sm" | "md";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Show a trailing arrow (↗ for external links). */
  arrow?: boolean;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * ButtonLink — link styled with the site's existing pill buttons:
 * primary = Hero's white pill, glass = Navbar pill, text = arrow link.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  external = false,
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 font-semibold transition-all duration-fast ease-smooth",
    variant === "primary" &&
      "rounded-full bg-white/90 text-black hover:bg-white hover:scale-[1.03] active:scale-[0.98]",
    variant === "glass" &&
      "rounded-full bg-white/15 backdrop-blur-lg border border-white/25 text-foreground/90 font-medium hover:bg-white/25 hover:text-foreground",
    variant === "text" && "text-foreground/70 hover:text-foreground font-medium",
    variant !== "text" && size === "sm" && "h-9 px-5 text-xs",
    variant !== "text" && size === "md" && "h-11 px-6 text-sm",
    variant === "text" && (size === "sm" ? "text-xs" : "text-sm"),
    className
  );

  const content = (
    <>
      {children}
      {arrow && (
        <Icon
          name={external ? "arrowUpRight" : "arrowRight"}
          className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5"
        />
      )}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
