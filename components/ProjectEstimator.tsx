"use client";

import React, { useState } from "react";
import Link from "next/link";

type NeedType = "Business System" | "Automation" | "Digital Product" | "Custom Solution";
type ScopeType = "Small" | "Medium" | "Large";
type HaveType = "Idea Only" | "Existing Process" | "Existing Design" | "Existing System";

const estimateMatrix: Record<
  NeedType,
  Record<ScopeType, { weeks: string; egp: string }>
> = {
  "Business System": {
    Small: { weeks: "3–5", egp: "50K–90K" },
    Medium: { weeks: "4–8", egp: "80K–150K" },
    Large: { weeks: "8–14", egp: "150K–280K" },
  },
  Automation: {
    Small: { weeks: "2–4", egp: "35K–65K" },
    Medium: { weeks: "4–6", egp: "65K–120K" },
    Large: { weeks: "6–10", egp: "120K–200K" },
  },
  "Digital Product": {
    Small: { weeks: "4–6", egp: "70K–110K" },
    Medium: { weeks: "6–10", egp: "110K–190K" },
    Large: { weeks: "10–16", egp: "190K–320K" },
  },
  "Custom Solution": {
    Small: { weeks: "3–6", egp: "60K–100K" },
    Medium: { weeks: "6–12", egp: "100K–220K" },
    Large: { weeks: "12–20", egp: "220K–400K" },
  },
};

export function ProjectEstimator() {
  const [selectedNeed, setSelectedNeed] = useState<NeedType>("Business System");
  const [selectedScope, setSelectedScope] = useState<ScopeType>("Medium");
  const [selectedHave, setSelectedHave] = useState<HaveType>("Existing Process");

  const needsList: NeedType[] = [
    "Business System",
    "Automation",
    "Digital Product",
    "Custom Solution",
  ];

  const scopesList: ScopeType[] = ["Small", "Medium", "Large"];

  const haveList: HaveType[] = [
    "Idea Only",
    "Existing Process",
    "Existing Design",
    "Existing System",
  ];

  const currentEstimate = estimateMatrix[selectedNeed][selectedScope];

  return (
    <section id="estimator" className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            06
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            Project Estimator
          </span>
        </div>

        {/* Section Heading */}
        <div>
          <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white tracking-tight leading-tight">
            Let&apos;s Estimate Your Project.
          </h2>
        </div>

        {/* Interactive Dual Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-white/15 rounded-md overflow-hidden bg-[#070b12]">
          {/* Left Column: Interactive Selector Choices */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-white/15">
            {/* Step 1: Need */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-brand font-semibold">01</span>
                <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                  WHAT DO YOU NEED?
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {needsList.map((need) => {
                  const isSelected = selectedNeed === need;
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => setSelectedNeed(need)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-sm"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span>{need}</span>
                      <span
                        className={`w-2 h-2 rounded-[1px] ${
                          isSelected ? "bg-[#1C2633]" : "border border-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scope */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-brand font-semibold">02</span>
                <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                  PROJECT SCOPE
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {scopesList.map((scope) => {
                  const isSelected = selectedScope === scope;
                  return (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setSelectedScope(scope)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-sm"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span>{scope}</span>
                      <span
                        className={`w-2 h-2 rounded-[1px] ${
                          isSelected ? "bg-[#1C2633]" : "border border-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: What do you already have? */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-brand font-semibold">03</span>
                <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                  WHAT DO YOU ALREADY HAVE?
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {haveList.map((have) => {
                  const isSelected = selectedHave === have;
                  return (
                    <button
                      key={have}
                      type="button"
                      onClick={() => setSelectedHave(have)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-sm"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span>{have}</span>
                      <span
                        className={`w-2 h-2 rounded-[1px] ${
                          isSelected ? "bg-[#1C2633]" : "border border-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-white/40 font-mono tracking-wide">
              Three simple choices. No contact details required.
            </p>
          </div>

          {/* Right Column: Outline Sidebar */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-[#090e17]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="6" y1="12" x2="21" y2="12" />
                    <line x1="9" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="text-xs font-semibold tracking-[2px] uppercase text-white font-mono">
                    YOUR PROJECT OUTLINE
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
                  ILLUSTRATIVE
                </span>
              </div>

              {/* Dynamic Summary Tag */}
              <div className="py-6 border-b border-white/10">
                <span className="text-sm font-medium text-white/80">
                  {selectedNeed} / {selectedScope} scope / {selectedHave}
                </span>
              </div>

              {/* Timeline metric */}
              <div className="py-6 border-b border-white/10 space-y-1">
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                  ESTIMATED TIMELINE
                </span>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-brand font-mono tracking-tight">
                    {currentEstimate.weeks}
                  </span>
                  <span className="text-lg text-white/60 font-medium">Weeks</span>
                </div>
              </div>

              {/* Investment metric */}
              <div className="py-6 border-b border-white/10 space-y-1">
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                  ESTIMATED INVESTMENT
                </span>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-brand font-mono tracking-tight">
                    {currentEstimate.egp}
                  </span>
                  <span className="text-lg text-white/60 font-medium font-mono">EGP</span>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-white/40 font-normal leading-relaxed pt-6">
                Initial estimate only. Final scope, timeline and investment are confirmed after a discovery conversation. Example placeholder values, not a quote or published pricing.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                href="#schedule"
                className="w-full flex items-center justify-center gap-3 bg-brand hover:bg-brand/90 text-[#1C2633] font-semibold text-xs sm:text-sm tracking-[2px] uppercase py-4 rounded-sm transition-colors shadow-sm"
              >
                <span>SCHEDULE CONVERSATION</span>
                <span className="text-base leading-none">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
