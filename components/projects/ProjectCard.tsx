import Image from "next/image";
import Link from "next/link";
import { projectCategories, statusLabels, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  project: Project;
  className?: string;
  /** next/image `sizes` for screenshot covers. */
  sizes?: string;
  priority?: boolean;
}

/** Cover area of the existing Work card: gradient + large faint initial, or a screenshot when provided. */
export function ProjectCover({ project, className, sizes, priority }: ProjectCoverProps) {
  const { gradient, image } = project.cover;
  return (
    <div
      className={cn(
        "relative h-56 bg-gradient-to-br flex items-center justify-center overflow-hidden",
        gradient,
        className
      )}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
          priority={priority}
          className="object-cover object-top"
        />
      ) : (
        <span aria-hidden className="text-4xl font-black text-foreground/5 select-none">
          {project.title[0]}
        </span>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  /** Heading level for the card title (h3 inside a section with an h2). */
  headingLevel?: "h2" | "h3";
  className?: string;
}

/**
 * ProjectCard — the existing Work card design, now linking to the project page.
 * Shared by the home "Selected work" section and /projects.
 */
export function ProjectCard({ project, headingLevel = "h3", className }: ProjectCardProps) {
  const Heading = headingLevel;
  const categoryLabel = project.categories.map((c) => projectCategories[c]).join(" · ");

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-surface-border bg-surface overflow-hidden hover:border-white/10 transition-all duration-slow ease-smooth",
        className
      )}
    >
      <ProjectCover project={project} />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs text-foreground/50 font-medium tracking-wide uppercase">{categoryLabel}</p>
          {project.status === "prototype" && (
            <span className="text-[10px] font-semibold tracking-widest uppercase rounded-full border border-accent/40 text-accent px-2 py-0.5">
              {statusLabels.prototype}
            </span>
          )}
        </div>
        <Heading className="text-xl font-semibold text-foreground mb-2">{project.title}</Heading>
        <p className="text-sm text-foreground/60 leading-relaxed mb-4">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-background border border-surface-border text-foreground/50"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-fast">
          View project
          <span aria-hidden className="transition-transform duration-fast group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
