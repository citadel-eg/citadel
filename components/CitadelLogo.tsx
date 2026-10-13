import React from "react";

interface CitadelLogoProps {
  className?: string;
  markOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CitadelMark({ className = "w-6 h-8 text-fg-inverse" }: { className?: string }) {
  return (
    <svg
      data-logo-mark
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Citadel mark"
    >
      <path data-logo-tier="1" d="M23.8125 27.771H0V31.9923H23.8125V27.771Z" fill="currentColor" />
      <path data-logo-tier="2" d="M22.4054 23.9826H1.4071V26.8509H22.4054V23.9826Z" fill="currentColor" />
      <path data-logo-tier="3" d="M21.0524 20.3025H2.76009V23.1167H21.0524V20.3025Z" fill="currentColor" />
      <path data-logo-tier="4" d="M20.0241 16.6221H3.78833V19.4021H20.0241V16.6221Z" fill="currentColor" />
      <path data-logo-tier="5" d="M18.9959 12.9961H4.81665V15.7361H18.9959V12.9961Z" fill="currentColor" />
      <path data-logo-tier="6" d="M17.9134 9.37012H5.89893V12.0701H17.9134V9.37012Z" fill="currentColor" />
      <path data-logo-tier="7" d="M16.8852 5.79883H6.92725V8.39883H16.8852V5.79883Z" fill="currentColor" />
      <path data-logo-tier="8" d="M5.89901 0.00774132H9.84972V2.22663H13.9628V0.00774132H17.9135V4.87848H5.89901V0.00774132Z" fill="currentColor" />
    </svg>
  );
}

export function CitadelLogo({ className = "", markOnly = false }: CitadelLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <CitadelMark className="w-6 h-8 text-white shrink-0" />
      {!markOnly && (
        <div className="flex flex-col text-left">
          <span
            data-logo-text="title"
            className="font-extrabold text-[15px] sm:text-[17px] tracking-[4px] leading-tight text-white uppercase font-sans transition-colors group-hover:text-brand"
          >
            CITADEL
          </span>
          <span
            data-logo-text="sub"
            className="font-semibold text-[8px] sm:text-[9px] tracking-[3px] leading-tight text-white/70 uppercase font-sans mt-0.5 transition-colors group-hover:text-white/90"
          >
            SMART SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
}
