import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: { absolute: "Webitai Labs — Websites, Apps & Custom Software Development" },
  description:
    "Webitai Labs builds websites, web and mobile apps, e-commerce stores and custom software for small businesses, startups and growing companies. Start a project.",
  alternates: { canonical: "/" },
};

// Navbar, <main> and Footer are rendered by the root layout.
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services />
      <Work />
      <WhyUs />
      <Process />
      <FinalCta />
    </>
  );
}
