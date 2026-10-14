import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import { ProjectEstimator } from "@/components/ProjectEstimator";
import {
  ServicesHero,
  ServicesWhatWeBuild,
  ServicesHowWeWork,
  ServicesGrowthModel,
} from "@/components/services/ServicesSections";

export const metadata: Metadata = {
  title: "Services | Citadel Smart Solutions",
  description:
    "Automation, Operations, and Digital Products. Built around how your business works. Citadel Smart Solutions.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 01 / Services Offerings Hero */}
        <ServicesHero />

        {/* 02 / What We Build */}
        <ServicesWhatWeBuild />

        {/* 03 / How We Work */}
        <ServicesHowWeWork />

        {/* 04 / A Business-First Growth Model */}
        <ServicesGrowthModel />

        {/* 05 / Project Estimator (Reused from home) */}
        <ProjectEstimator />
      </main>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
