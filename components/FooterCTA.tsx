import React from "react";
import Link from "next/link";
import { CitadelLogo, CitadelMark } from "./CitadelLogo";

export function FooterCTA() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#05070a] pt-20 pb-12 border-t border-white/15">
      {/* Giant Watermark Silhouette of Citadel Tower in bottom right */}
      <div className="absolute right-[-60px] md:right-10 bottom-16 pointer-events-none opacity-[0.035] select-none">
        <CitadelMark className="w-[380px] h-[480px] sm:w-[500px] sm:h-[640px] text-white" />
      </div>

      <div className="max-w-[1353px] mx-auto px-6 sm:px-10 relative z-10 flex flex-col justify-between space-y-24">
        {/* Big Centered Headline & Action */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-12 md:py-20">
          <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold text-white tracking-tight uppercase leading-[1.05] max-w-5xl">
            BUILD STRONG SYSTEMS,
            <br />
            GROW SUSTAINABLY.
          </h2>

          <div className="pt-4">
            <Link
              href="#schedule"
              className="inline-flex items-center gap-4 bg-brand hover:bg-brand/90 text-[#1C2633] px-8 py-4 rounded-sm font-semibold text-xs sm:text-sm tracking-[2px] uppercase transition-colors shadow-sm"
            >
              <span>START A CONVERSATION</span>
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <CitadelLogo />
          </Link>

          <p className="text-xs text-white/50 font-normal tracking-wide text-center sm:text-right">
            © 2026 Citadel Smart Solutions. Strong Systems. Sustainable Growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
