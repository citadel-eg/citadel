import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FooterCTA } from "@/components/FooterCTA";
import { BusinessFirst } from "@/components/BusinessFirst";
import {
  CompanyWhoWeAre,
  CompanyMissionVision,
  CompanyValues,
  CompanyWhyCitadel,
  CompanyModel,
} from "@/components/company/CompanySections";

export const metadata: Metadata = {
  title: "Company | Citadel Smart Solutions",
  description:
    "We understand the business first, then build technology around how it really works. Citadel Smart Solutions.",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-brand selection:text-[#1C2633]">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* 01 / Overview & Stepped Cascade Hero */}
        <BusinessFirst sectionNumber="01" id="company-hero" className="pt-12 pb-20 md:pt-16 md:pb-24" />

        {/* 02 / Who We Are */}
        <CompanyWhoWeAre />

        {/* 03 / Mission & Vision */}
        <CompanyMissionVision />

        {/* 04 / Our Values */}
        <CompanyValues />

        {/* 05 / Why Citadel — Six Rules */}
        <CompanyWhyCitadel />

        {/* 06 / The Citadel Model */}
        <CompanyModel />
      </main>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
