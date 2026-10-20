import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import {
  WorkHero,
  WorkProjectGallery,
  WorkConnectedAreas,
} from "@/components/work/WorkSections";

import { getProjects, mapSanityToCaseStudy } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Selected Work & Case Studies",
  description:
    "Explore Citadel's portfolio: deep architectural case studies including the Galaxy Store multi-channel commerce platform, operational automation, and product engineering.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Selected Work & Case Studies | Citadel Smart Solutions",
    description:
      "Explore the architectural decisions, operational metrics, and scalable platforms built by Citadel.",
    url: "/work",
  },
};

export default async function WorkPage() {
  const sanityProjects = await getProjects();
  const caseStudyProjects = sanityProjects.map(mapSanityToCaseStudy);

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 01 / Work Hero */}
        {/* <WorkHero /> */}

        {/* 02 / Project Gallery */}
        <WorkProjectGallery projects={caseStudyProjects} />

        {/* 03 / Connected Areas of Work */}
        <WorkConnectedAreas />
      </main>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
