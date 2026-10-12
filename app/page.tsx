import { Header } from "@/components/Header";
import { HeroBillboard } from "@/components/HeroBillboard";
import { Statements } from "@/components/Statements";
import { BusinessFirst } from "@/components/BusinessFirst";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatWeBuild } from "@/components/WhatWeBuild";
import { ApproachSection } from "@/components/ApproachSection";
import { ProjectEstimator } from "@/components/ProjectEstimator";
import { CaseStudy } from "@/components/CaseStudy";
import { ScheduleConversation } from "@/components/ScheduleConversation";
import { FooterCTA } from "@/components/FooterCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      {/* Top Navigation */}
      <Header />

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col">
        {/* Billboard Hero: "SYSTEMS THAT MAKE YOUR BUSINESS STRONGER." */}
        <HeroBillboard />

        {/* 01-08 Pinned Interactive 3D Architecture Journey (ends with STRONG SYSTEMS. SUSTAINABLE GROWTH.) */}
        <Statements />

        {/* 02 — Business First Staircase Architecture */}
        <BusinessFirst />

        {/* 02 — The Real Problem 3-Card Operational Review */}
        <ProblemSection />

        {/* 04 — What We Build (Automation, Operations, Products) */}
        <WhatWeBuild />

        {/* 05 — Our Approach (5 Ascending Layers) */}
        <ApproachSection />

        {/* 06 — Interactive Project Scope & Investment Estimator */}
        <ProjectEstimator />

        {/* 07 — Case Studies (Galaxy Store Platform Feature) */}
        <CaseStudy />

        {/* 08 — Interactive Conversation Scheduler & Booking Form */}
        <ScheduleConversation />
      </main>

      {/* Grand CTA & Watermark Footer */}
      <FooterCTA />
    </div>
  );
}
