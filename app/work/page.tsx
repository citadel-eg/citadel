import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import {
  WorkHero,
  WorkProjectGallery,
  WorkConnectedAreas,
} from "@/components/work/WorkSections";

export const metadata: Metadata = {
  title: "Work | Citadel Smart Solutions",
  description:
    "Explore our work through the problems, decisions, and outcomes behind each project. Citadel Smart Solutions.",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 01 / Work Hero */}
        {/* <WorkHero /> */}

        {/* 02 / Project Gallery */}
        <WorkProjectGallery />

        {/* 03 / Connected Areas of Work */}
        <WorkConnectedAreas />
      </main>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
