import React from "react";
import Image from "next/image";

export function CaseStudy() {
  return (
    <section id="work" className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            07
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            CASE STUDIES
          </span>
        </div>

        {/* Section Heading */}
        <div>
          <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white tracking-tight leading-none uppercase">
            PROBLEM → SYSTEM → RESULT.
          </h2>
        </div>

        {/* Case Study Feature Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Mockup Showcase */}
          <div className="lg:col-span-6 relative rounded-md border border-white/15 overflow-hidden bg-[#070b12] group">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden">
              <Image
                src="/galaxy-store.png"
                alt="Galaxy Store Case Study - Dashboard and website preview"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            {/* Badge overlay top left */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-sm">
              <span className="text-[10px] sm:text-xs font-semibold text-white tracking-wider">
                01 — Galaxy Store / Dashboard &amp; web site
              </span>
            </div>

            {/* Bottom bar caption */}
            <div className="p-4 bg-[#080d16] border-t border-white/10 flex items-center justify-between text-xs text-white/50">
              <span className="font-mono">↗ Original customer website · Arabic RTL</span>
              <span className="text-brand font-medium">Logistics &amp; Distribution</span>
            </div>
          </div>

          {/* Right Column: Breakdown */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6">
            <h3 className="text-2xl sm:text-4xl font-bold text-white leading-tight capitalize">
              A Storefront . An Operation , A Human Connection
            </h3>

            {/* Stepped breakdown rows */}
            <div className="space-y-6 pt-4">
              {/* 01 / PROBLEM */}
              <div className="border-t border-white/20 pt-4 space-y-1.5">
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
                  01 / PROBLEM
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Dispatch ran through 14 shared spreadsheets and phone calls.
                </p>
              </div>

              {/* 02 / SYSTEM */}
              <div className="border-t border-white/20 pt-4 pl-6 sm:pl-10 space-y-1.5">
                <span className="text-xs font-semibold tracking-[2px] uppercase text-brand font-mono">
                  02 / SYSTEM
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Customer website + internal dashboard with automated inventory synchronization.
                </p>
              </div>

              {/* 03 / RESULT */}
              <div className="border-t border-white/20 pt-4 pl-12 sm:pl-20 space-y-1.5">
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono">
                  03 / RESULT
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Course-commerce &amp; operations unified into one single source of operational truth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
