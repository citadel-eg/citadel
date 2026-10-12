"use client";

import React from "react";
import { Citadel3DModel } from "./Citadel3DModel";

export function HeroBillboard() {
  return (
    <section className="relative w-full h-[calc(100dvh-5rem)] min-h-130 max-h-[calc(100dvh-5rem)] px-6 sm:px-10 border-b border-white/10 bg-[#05070a] overflow-hidden flex flex-col items-center justify-between py-6 sm:py-8 lg:py-10">
      <div className="max-w-[1353px] mx-auto w-full h-full flex flex-col items-center justify-between gap-4 sm:gap-6">
        {/* Billboard Header */}
        <div className="shrink-0 text-center pt-2 sm:pt-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-bold text-white uppercase tracking-[1.5px] sm:tracking-[2px] leading-[1.08] max-w-5xl mx-auto">
            SYSTEMS THAT MAKE YOUR BUSINESS STRONGER.
          </h1>
        </div>

        {/* Complete 3D Citadel Fortress dynamically filling screen height */}
        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
          <Citadel3DModel
            phase="all"
            interactive={true}
            lockRotation={false}
            showControls={false}
            borderless={true}
            enablePhaseHover={false}
            enablePhaseClick={false}
            heightClass="h-full w-full max-h-[460px] lg:max-h-[520px]"
          />
        </div>
      </div>
    </section>
  );
}
