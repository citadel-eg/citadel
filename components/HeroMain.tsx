import React from "react";
import Link from "next/link";
import { Citadel3DPlaceholder } from "./Citadel3DPlaceholder";

export function HeroMain() {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column Text & Action */}
        <div className="flex flex-col items-start space-y-6 md:space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/70">
              CITADEL / SMART SOLUTIONS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white uppercase leading-[1.05]">
            STRONG SYSTEMS.
            <br />
            SUSTAINABLE GROWTH.
          </h2>

          <p className="text-base sm:text-xl text-white/60 font-normal leading-relaxed max-w-xl">
            We solve operational problems with systems built for sustainable growth. We understand operations first. Technology second.
          </p>

          <div className="pt-2">
            <Link
              href="#schedule"
              className="inline-flex items-center gap-3 border border-white/80 hover:border-brand hover:text-brand px-7 py-4 text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white transition-all group"
            >
              <span>START A CONVERSATION</span>
              <span className="text-base leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column 3D Artwork */}
        <div>
          <Citadel3DPlaceholder
            label="3D CITADEL TOWER SHOWCASE"
            heightClass="h-[380px] sm:h-[480px] lg:h-[520px]"
          />
        </div>
      </div>
    </section>
  );
}
