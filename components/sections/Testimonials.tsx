import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { SlideUp } from "@/components/animations/SlideUp";
import { GradientText } from "@/components/ui/GradientText";

const testimonials = [
  {
    quote:
      "webapp.ai shipped our MVP in 6 weeks. The quality was production-grade from day one — not 'we'll clean it up later' quality.",
    author: "Sarah Chen",
    role: "Founder, Pulse Analytics",
    avatar: "SC",
  },
  {
    quote:
      "I've worked with large agencies and offshore teams. Nothing comes close to the speed and craft we got from this team.",
    author: "Marcus Reid",
    role: "CTO, Cortex AI",
    avatar: "MR",
  },
  {
    quote:
      "The AI integration work they did saved us 3 months of development. They just get it — the tech and the product thinking.",
    author: "Priya Nair",
    role: "Product Lead, Beacon Finance",
    avatar: "PN",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-border to-transparent"
      />

      <div className="container mx-auto px-6">
        <div className="mb-20 text-center max-w-xl mx-auto">
          <SlideUp>
            <p className="text-xs font-medium tracking-widest uppercase text-accent mb-4">
              Testimonials
            </p>
          </SlideUp>
          <SlideUp delay={0.05}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Clients who{" "}
              <GradientText>love the work</GradientText>
            </h2>
          </SlideUp>
        </div>

        <StaggerContainer
          speed="normal"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <RevealOnScroll
              key={t.author}
              direction="up"
              className="flex flex-col gap-6 rounded-2xl border border-surface-border bg-surface p-8"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-violet-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-foreground/70 leading-relaxed text-sm flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30 border border-surface-border flex items-center justify-center text-xs font-semibold text-foreground/60">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.author}</p>
                  <p className="text-xs text-foreground/40">{t.role}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
