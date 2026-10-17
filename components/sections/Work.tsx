import Link from "next/link";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Subtle section separator glow */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <SlideUp>
              <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                Selected work
              </p>
            </SlideUp>
            <SlideUp delay={0.05}>
              <h2
                id="work-heading"
                className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight"
              >
                A few things{" "}
                <GradientText>we&apos;ve built</GradientText>
              </h2>
            </SlideUp>
          </div>
          <SlideUp delay={0.1}>
            <Link
              href="/projects"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors duration-fast shrink-0"
            >
              View all projects <span aria-hidden>→</span>
            </Link>
          </SlideUp>
        </div>

        {/* Projects grid */}
        <StaggerContainer
          speed="normal"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <RevealOnScroll key={project.slug} direction="up" className="h-full">
              <ProjectCard project={project} />
            </RevealOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
