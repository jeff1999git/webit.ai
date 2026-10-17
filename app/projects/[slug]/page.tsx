import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { SlideUp } from "@/components/animations/SlideUp";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ProjectCover } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GradientText } from "@/components/ui/GradientText";
import { Icon } from "@/components/ui/Icon";
import { getProject, projectCategories, projects, statusLabels, type Project } from "@/content/projects";
import { getService } from "@/content/services";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

/** Previous/next project in array order, wrapping around at either end. */
function getNeighbours(project: Project) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const count = projects.length;
  return {
    prev: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}

function StatusBadge({ project }: { project: Project }) {
  if (project.status === "prototype") {
    return (
      <span className="inline-flex items-center rounded-full border border-accent/40 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-accent">
        {statusLabels.prototype}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-surface-border bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-foreground/70">
      {statusLabels.live}
    </span>
  );
}

/** Label/value pair in the project details card. */
function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-surface-border pt-5 first:border-t-0 first:pt-0">
      <dt className="mb-3 text-xs font-medium tracking-widest uppercase text-foreground/50">{label}</dt>
      <dd className="text-sm text-foreground/70">{children}</dd>
    </div>
  );
}

function NeighbourLink({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex h-full items-center gap-4 rounded-2xl border border-surface-border bg-surface p-6 hover:border-white/10 transition-all duration-slow ease-smooth",
        !isPrev && "flex-row-reverse text-right"
      )}
    >
      <Icon
        name={isPrev ? "arrowLeft" : "arrowRight"}
        className={cn(
          "h-5 w-5 text-foreground/50 transition-all duration-fast group-hover:text-foreground",
          isPrev ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
        )}
      />
      <span className="min-w-0">
        <span className="block text-xs font-medium tracking-widest uppercase text-foreground/50">
          {isPrev ? "Previous project" : "Next project"}
        </span>
        <span className="mt-1 block text-lg font-semibold text-foreground">{project.title}</span>
      </span>
    </Link>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const categoryLabel = project.categories.map((c) => projectCategories[c]).join(" · ");
  const service = getService(project.relatedService);
  const { prev, next } = getNeighbours(project);
  const hasNeighbours = projects.length > 1;
  // With exactly two projects, prev and next are the same page — show it once.
  const showPrev = hasNeighbours && prev.slug !== next.slug;

  return (
    <div>
      <PageHero
        before={
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-foreground/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/projects" className="transition-colors duration-fast hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground/80">
                {project.title}
              </li>
            </ol>
          </nav>
        }
        eyebrow={categoryLabel}
        title={project.title}
        intro={project.summary}
        actions={
          project.links.length > 0 ? (
            <>
              {project.links.map((link, i) => (
                <span key={link.href} className="inline-flex flex-wrap items-center gap-3">
                  <ButtonLink href={link.href} variant={i === 0 ? "primary" : "glass"} external arrow>
                    {link.label}
                  </ButtonLink>
                  {link.note && <span className="text-xs text-foreground/60">{link.note}</span>}
                </span>
              ))}
            </>
          ) : undefined
        }
      >
        <SlideUp delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-foreground/60">
            <StatusBadge project={project} />
            {project.status === "prototype" && (
              <span className="text-foreground/60">Prototype — not a launched product</span>
            )}
            <p>
              {project.client && <span className="text-foreground/80">Client: {project.client}</span>}
              {project.client && project.clientDescription && <span aria-hidden> · </span>}
              {project.clientDescription}
            </p>
          </div>
        </SlideUp>
      </PageHero>

      {/* Cover */}
      <div className="container mx-auto px-6 max-w-6xl pt-16 md:pt-24">
        <ProjectCover
          project={project}
          className="h-64 md:h-96 rounded-2xl border border-surface-border"
          sizes="(min-width: 1152px) 1104px, calc(100vw - 48px)"
          priority
        />
      </div>

      {/* Details */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SlideUp>
              <section aria-labelledby="overview-heading">
                <h2
                  id="overview-heading"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                >
                  Overview
                </h2>
                <p className="mt-5 text-base text-foreground/70 leading-relaxed">{project.overview}</p>
              </section>
            </SlideUp>

            <SlideUp delay={0.05}>
              <section aria-labelledby="features-heading" className="mt-14">
                <h2
                  id="features-heading"
                  className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                >
                  What we built
                </h2>
                <ul className="mt-6 space-y-3 text-base text-foreground/70 leading-relaxed">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </SlideUp>
          </div>

          <RevealOnScroll direction="up" delay={0.1} className="lg:col-span-4">
            <aside aria-label="Project details" className="rounded-2xl border border-surface-border bg-surface p-6">
              <dl className="space-y-5">
                <DetailItem label="Technology">
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <li
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-background border border-surface-border text-foreground/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </DetailItem>
                <DetailItem label="Category">{categoryLabel}</DetailItem>
                <DetailItem label="Status">
                  {statusLabels[project.status]}
                  {project.status === "prototype" && (
                    <span className="block mt-1 text-xs text-foreground/50">Not a launched product</span>
                  )}
                </DetailItem>
                {project.links.length > 0 && (
                  <DetailItem label="Links">
                    <ul className="space-y-3">
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors duration-fast hover:text-foreground"
                          >
                            {link.label}
                            <Icon
                              name="arrowUpRight"
                              className="h-4 w-4 transition-transform duration-fast group-hover:translate-x-0.5"
                            />
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                          {link.note && (
                            <span className="block mt-0.5 text-xs text-foreground/50">{link.note}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </DetailItem>
                )}
              </dl>
            </aside>
          </RevealOnScroll>
        </div>

        {/* Previous / next */}
        {hasNeighbours && (
          <nav aria-label="More projects" className="pb-16 md:pb-24">
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {showPrev && (
                <li>
                  <NeighbourLink project={prev} direction="prev" />
                </li>
              )}
              <li className={showPrev ? undefined : "md:col-start-2"}>
                <NeighbourLink project={next} direction="next" />
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Enquiry band */}
      <section aria-labelledby="project-cta-heading" className="relative pb-20 md:pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <SlideUp>
            <div className="rounded-2xl border border-surface-border bg-surface p-8 md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                    Your project
                  </p>
                  <h2
                    id="project-cta-heading"
                    className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
                  >
                    Planning something <GradientText>similar?</GradientText>
                  </h2>
                  <p className="mt-5 text-base text-foreground/60 leading-relaxed">
                    {service
                      ? `This project is an example of our ${service.title} work. Tell us what you need and we'll help you scope it.`
                      : "Tell us what you need and we'll help you scope it."}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-6">
                  <ButtonLink href={`/contact?service=${project.relatedService}`} arrow>
                    Discuss your project
                  </ButtonLink>
                  <ButtonLink href={`/services#${project.relatedService}`} variant="text">
                    About this service
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
