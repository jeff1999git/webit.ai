"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projectCategories, type Project, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

interface ProjectsExplorerProps {
  projects: Project[];
  /** Categories offered as filters — pass only those that have projects. */
  categories: ProjectCategory[];
}

/**
 * ProjectsExplorer — category filter + project grid for /projects.
 * Filters are toggle buttons (aria-pressed); the result count is announced
 * through a polite live region. State is local and not synced to the URL.
 */
export function ProjectsExplorer({ projects, categories }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const byCategory = new Map<ProjectCategory, number>();
    for (const category of categories) {
      byCategory.set(category, projects.filter((p) => p.categories.includes(category)).length);
    }
    return byCategory;
  }, [projects, categories]);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [projects, filter]
  );

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: projects.length },
    ...categories.map((category) => ({
      value: category,
      label: projectCategories[category],
      count: counts.get(category) ?? 0,
    })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-2">
        {options.map((option) => {
          const pressed = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(option.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-fast ease-smooth",
                pressed
                  ? "border-white/90 bg-white/90 text-black hover:bg-white"
                  : "border-white/25 bg-white/15 text-foreground/90 backdrop-blur-lg hover:bg-white/25 hover:text-foreground"
              )}
            >
              {option.label}
              <span className={cn("text-xs tabular-nums", pressed ? "text-black/60" : "text-foreground/60")}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {`Showing ${visible.length} ${visible.length === 1 ? "project" : "projects"}`}
      </p>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visible.map((project) => (
            // Keyed by filter so cards fade in again when the selection changes.
            <li key={`${filter}-${project.slug}`} className="h-full">
              <FadeIn className="h-full">
                <ProjectCard project={project} headingLevel="h2" />
              </FadeIn>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface p-8 text-center">
          <p className="text-base text-foreground/60 leading-relaxed">
            There are no projects in this category yet.{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground/80 underline underline-offset-4 transition-colors duration-fast hover:text-foreground"
            >
              Tell us about yours
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
