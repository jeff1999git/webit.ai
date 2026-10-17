// ─────────────────────────────────────────────
// Company content — values, reasons to choose us and the delivery process.
// Statements here are commitments about how we work, not claims about
// results. Do not add numbers, awards or client counts.
// ─────────────────────────────────────────────

import type { IconName } from "@/components/ui/Icon";

export interface Pillar {
  title: string;
  text: string;
}

export interface Reason {
  icon: IconName;
  title: string;
  text: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  text: string;
}

/** Short trust/value band under the hero. */
export const trustPillars: Pillar[] = [
  { title: "Quality first", text: "Careful, tested work — not shortcuts we fix later." },
  { title: "Thoughtful engineering", text: "Technology chosen for your needs, not for trends." },
  { title: "Responsive design", text: "Built to work on phones, tablets and desktops." },
  { title: "Ready to scale", text: "Foundations that can grow with your users and features." },
  { title: "Reliable communication", text: "Regular updates and straight answers throughout." },
];

/** "Why Webitai Labs" section. */
export const reasons: Reason[] = [
  {
    icon: "target",
    title: "Tailored to your business",
    text: "We start from your requirements and build what your business actually needs — not a template stretched to fit.",
  },
  {
    icon: "layers",
    title: "Modern, maintainable technology",
    text: "Proven frameworks and clean, documented code that other developers can pick up and extend.",
  },
  {
    icon: "mobile",
    title: "Mobile-first and responsive",
    text: "Interfaces designed for the small screen first, so they work well wherever your customers are.",
  },
  {
    icon: "milestone",
    title: "Clear communication and milestones",
    text: "Agreed scope, visible milestones and regular check-ins, so you always know where the project stands.",
  },
  {
    icon: "shield",
    title: "Performance, security and scalability",
    text: "Speed, data protection and room to grow are considered from the first decision, not bolted on at the end.",
  },
  {
    icon: "support",
    title: "Support after launch",
    text: "Fixes, updates and improvements are available when you need them — launch is not where we disappear.",
  },
];

/** Four-step delivery process. */
export const processSteps: ProcessStep[] = [
  { number: "01", title: "Discover", text: "Understand the business and requirements." },
  { number: "02", title: "Plan", text: "Define scope, functionality, and milestones." },
  { number: "03", title: "Build", text: "Design, develop, test, and refine." },
  { number: "04", title: "Launch", text: "Deploy, hand over, and support the product." },
];
