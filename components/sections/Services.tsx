import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Production-grade Next.js, React, and full-stack applications built for performance, scalability, and maintainability.",
    tags: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    number: "02",
    title: "AI Integration",
    description:
      "LLMs, RAG pipelines, and intelligent automation woven into your product to create delightful, smart user experiences.",
    tags: ["OpenAI", "Claude", "LangChain"],
  },
  {
    number: "03",
    title: "Design Systems",
    description:
      "Component libraries and design systems that empower your team to ship consistent, beautiful UI at speed.",
    tags: ["Figma", "Tailwind", "Storybook"],
  },
  {
    number: "04",
    title: "Performance & SEO",
    description:
      "Core Web Vitals optimisation, server-side rendering, and technical SEO to drive organic growth.",
    tags: ["Lighthouse", "Analytics", "Edge"],
  },
  {
    number: "05",
    title: "SaaS Platforms",
    description:
      "End-to-end SaaS architecture — auth, billing, multi-tenancy, dashboards — launched fast and built to scale.",
    tags: ["Stripe", "Auth.js", "Prisma"],
  },
  {
    number: "06",
    title: "API & Backend",
    description:
      "Robust REST and GraphQL APIs, serverless functions, and database architecture for demanding workloads.",
    tags: ["Postgres", "Redis", "tRPC"],
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="mb-12 md:mb-20 max-w-2xl">
          <SlideUp>
            <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
              What we do
            </p>
          </SlideUp>
          <SlideUp delay={0.05}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Services built for{" "}
              <GradientText>modern products</GradientText>
            </h2>
          </SlideUp>
        </div>

        {/* Services grid */}
        <StaggerContainer speed="normal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border">
          {services.map((service) => (
            <RevealOnScroll
              key={service.number}
              direction="up"
              className="group relative bg-background p-6 md:p-8 hover:bg-surface transition-colors duration-normal ease-smooth"
            >
              {/* Future: add hover glow layer here */}
              <div className="flex flex-col h-full gap-4">
                <span className="text-xs font-mono text-foreground/20">
                  {service.number}
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed flex-1">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-surface border border-surface-border text-foreground/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
