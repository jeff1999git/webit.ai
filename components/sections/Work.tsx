import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";

const projects = [
  {
    title: "Pulse Analytics",
    category: "SaaS Dashboard",
    description: "Real-time analytics platform for e-commerce brands — built on Next.js with live WebSocket data streams.",
    tags: ["Next.js", "WebSockets", "Postgres"],
    accentColor: "from-violet-500/10 to-purple-500/5",
  },
  {
    title: "Cortex AI",
    category: "AI Product",
    description: "Conversational AI assistant with RAG pipeline, document ingestion, and enterprise SSO.",
    tags: ["Claude API", "Pinecone", "Auth.js"],
    accentColor: "from-indigo-500/10 to-blue-500/5",
  },
  {
    title: "Founders Club",
    category: "Community Platform",
    description: "Membership platform with gated content, live events, and payments — 0 to 5k users in 3 months.",
    tags: ["Next.js", "Stripe", "Sanity"],
    accentColor: "from-sky-500/10 to-cyan-500/5",
  },
  {
    title: "Beacon Finance",
    category: "Fintech App",
    description: "Personal finance dashboard with bank integrations, ML-powered insights, and a native mobile app.",
    tags: ["React Native", "Plaid", "Python"],
    accentColor: "from-emerald-500/10 to-green-500/5",
  },
];

export function Work() {
  return (
    <section
      id="work"
      className="relative py-32 overflow-hidden"
    >
      {/* Subtle section separator glow */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <SlideUp>
              <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
                Selected work
              </p>
            </SlideUp>
            <SlideUp delay={0.05}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Products we&apos;re{" "}
                <GradientText>proud of</GradientText>
              </h2>
            </SlideUp>
          </div>
          <SlideUp delay={0.1}>
            <a
              href="#contact"
              className="text-sm text-foreground/40 hover:text-foreground transition-colors duration-fast shrink-0"
            >
              All case studies →
            </a>
          </SlideUp>
        </div>

        {/* Projects grid */}
        <StaggerContainer
          speed="normal"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <RevealOnScroll
              key={project.title}
              direction="up"
              className="group relative rounded-2xl border border-surface-border bg-surface overflow-hidden cursor-pointer hover:border-white/10 transition-all duration-slow ease-smooth"
            >
              {/* Project card visual area */}
              {/* Future: replace with animated project preview/video */}
              <div
                className={`h-56 bg-gradient-to-br ${project.accentColor} flex items-center justify-center`}
              >
                <span className="text-4xl font-black text-foreground/5 select-none">
                  {project.title[0]}
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs text-foreground/30 font-medium tracking-wide uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-background border border-surface-border text-foreground/30"
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
