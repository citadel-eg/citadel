import React from "react";
import { CitadelMark } from "./CitadelLogo";

interface Citadel3DPlaceholderProps {
  label?: string;
  className?: string;
  heightClass?: string;
}

export function Citadel3DPlaceholder({
  label = "3D CITADEL MODEL CANVAS",
  className = "",
  heightClass = "h-[420px] sm:h-[500px]",
}: Citadel3DPlaceholderProps) {
  return (
    <div
      className={`relative w-full ${heightClass} rounded-md border border-white/10 bg-[#080c14]/80 overflow-hidden flex flex-col items-center justify-center p-8 group ${className}`}
    >
      {/* Subtle blueprint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative corner crosshairs */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/30" />

      {/* Center watermark mark */}
      <div className="relative flex flex-col items-center justify-center gap-4 text-center z-10">
        <CitadelMark className="w-16 h-20 text-white/20 transition-transform duration-500 group-hover:scale-105 group-hover:text-white/30" />
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] font-semibold tracking-[2.5px] uppercase text-white/50 font-mono">
            {label}
          </span>
          <span className="text-[10px] tracking-[1.5px] uppercase text-white/30 font-mono">
            [ Interactive 3D Canvas Ready ]
          </span>
        </div>
      </div>
    </div>
  );
}
