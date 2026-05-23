import { Navbar } from "@/components/layout/Navbar";
import { StarField } from "@/components/animations/StarField";

export const metadata = { title: "About Us — WebitAi" };

export default function AboutUsPage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl pt-32 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2">
          About Us
        </h1>

        <div className="space-y-6 text-foreground/70 leading-relaxed text-sm">
          <p>
            WebitAI Labs is an initiative focused on making AI-powered website creation
            accessible to everyone — even people with zero coding knowledge.
          </p>
          <p>
            We believe technology should not be limited to developers alone. Small business
            owners, students, freelancers, creators, and beginners should also be able to
            build their ideas online without learning complex programming.
          </p>

          <p className="text-foreground/40 text-xs uppercase tracking-widest">Our mission is simple</p>
          <blockquote className="border-l-2 border-accent pl-5 italic text-foreground/80">
            &ldquo;Empower ordinary people to create extraordinary digital experiences using AI.&rdquo;
          </blockquote>

          <p>
            Through our hands-on workshops, we teach participants how to build modern
            websites using AI tools, prompts, and free platforms — without traditional
            coding barriers.
          </p>

          <div>
            <p className="text-foreground/40 text-xs uppercase tracking-widest mb-3">At WebitAI Labs, we focus on</p>
            <ul className="space-y-2">
              {[
                "AI-powered website creation",
                "No-code & prompt-based workflows",
                "Hands-on practical learning",
                "Beginner-friendly teaching",
                "Real-world business use cases",
                "Fast and modern web experiences",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent shrink-0 mt-px">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>
            Whether you want to create a personal portfolio, business website, landing page,
            or startup idea — we help you launch it confidently.
          </p>

          <div>
            <p className="text-foreground/40 text-xs uppercase tracking-widest mb-4">What Makes Us Different?</p>
            <ul className="space-y-2">
              {[
                "Beginner Friendly",
                "Practical Hands-on Sessions",
                "Zero Coding Knowledge Required",
                "Learn by Building Real Projects",
                "Free & Accessible AI Tools",
                "Modern Website Design Approach",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>Our goal is not just to teach tools. We aim to build confidence.</p>

          <p className="text-foreground/50">Because we believe:</p>
          <blockquote className="border-l-2 border-accent pl-5 italic text-foreground/80">
            &ldquo;Anyone can build anything with the power of AI.&rdquo;
          </blockquote>
        </div>
      </div>
    </main>
  );
}
