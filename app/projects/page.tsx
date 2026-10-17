import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { SlideUp } from "@/components/animations/SlideUp";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GradientText } from "@/components/ui/GradientText";
import { activeCategories, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected websites, web applications and business software built by Webitai Labs, with what each project actually delivered.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Projects"
        title="Selected work"
        intro="A selection of websites, web applications and business software we've built. Each project lists what was actually delivered."
      />

      <section aria-label="Project list" className="container mx-auto px-6 max-w-6xl py-16 md:py-24">
        <ProjectsExplorer projects={projects} categories={activeCategories()} />
      </section>

      {/* Enquiry band */}
      <section aria-labelledby="projects-cta-heading" className="relative pb-20 md:pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <SlideUp>
            <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                    Your project
                  </p>
                  <h2
                    id="projects-cta-heading"
                    className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                  >
                    Have a similar project <GradientText>in mind?</GradientText>
                  </h2>
                  <p className="mt-5 text-base text-foreground/60 leading-relaxed">
                    Tell us what you&apos;re planning and we&apos;ll help you scope it.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-6">
                  <ButtonLink href="/contact" arrow>
                    Start a Project
                  </ButtonLink>
                </div>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>
    </div>
  );
}
