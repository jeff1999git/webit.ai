import { Navbar } from "@/components/layout/Navbar";
import { StarField } from "@/components/animations/StarField";

export const metadata = { title: "About Us — WebitAi" };

export default function AboutUsPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <Navbar />
      <StarField />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl py-24">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          About Us
        </h1>

        <div className="space-y-5 text-foreground/60 leading-relaxed text-sm">
          <p>
            We are a next-generation web studio that fuses artificial intelligence with
            human creativity to build digital experiences that matter. Founded by a team
            of designers, engineers, and strategists, our mission is to help ambitious
            brands move faster, look better, and scale further.
          </p>
          <p>
            From pixel-perfect interfaces to robust full-stack platforms, every product
            we ship is engineered for performance and built to last. We don&apos;t believe
            in templates — we believe in bespoke solutions tailored to your specific goals.
          </p>
          <p>
            Our process is collaborative, transparent, and outcome-focused. We start
            with strategy, move through design, and deliver with engineering precision —
            keeping you in the loop at every step.
          </p>
          <p>
            Whether you&apos;re a startup looking to launch your MVP or an established
            company seeking a digital transformation, we have the expertise and
            passion to get you there.
          </p>
        </div>
      </div>
    </main>
  );
}
