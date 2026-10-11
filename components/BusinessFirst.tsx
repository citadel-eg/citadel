import React from "react";

interface StepItem {
  id: string;
  name: string;
  isDashed?: boolean;
}

const steps: StepItem[] = [
  { id: "01", name: "BUSINESS" },
  { id: "02", name: "OPERATIONS" },
  { id: "03", name: "PROBLEM" },
  { id: "04", name: "SYSTEM" },
  { id: "05", name: "TECHNOLOGY", isDashed: true },
  { id: "06", name: "GROWTH" },
];

export function BusinessFirst() {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            02
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            BUSINESS FIRST
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Mission statement */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-white uppercase leading-[1.08] tracking-tight">
              WE UNDERSTAND HOW A BUSINESS WORKS BEFORE WE WRITE A SINGLE LINE OF CODE.
            </h2>
            <p className="text-base sm:text-lg text-white/60 font-normal leading-relaxed max-w-xl">
              The best technology starts with better questions. How do your people work? Where does value get lost? What is holding the next stage back?
            </p>
          </div>

          {/* Right Column: Cascading Stepped Structure */}
          <div className="w-full flex flex-col space-y-2 overflow-x-auto pb-4 pt-2">
            {steps.map((step, index) => {
              // Indentation steps progressively to the right
              const indentRem = index * 1.5; // Progressive indent

              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Stepped Box */}
                  <div
                    style={{ marginLeft: `${indentRem}rem` }}
                    className={`flex items-center justify-between px-6 py-4.5 rounded-sm transition-all duration-300 bg-[#080d16] hover:bg-[#0c1422] ${
                      step.isDashed
                        ? "border border-dashed border-white/40 text-brand"
                        : "border border-white/20 text-white"
                    }`}
                  >
                    <span className="text-sm sm:text-base font-semibold tracking-[2px] uppercase">
                      {step.name}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-white/50 tracking-wider">
                      {step.id}
                    </span>
                  </div>

                  {/* Down Arrow connector between steps */}
                  {index < steps.length - 1 && (
                    <div
                      style={{ marginLeft: `${indentRem + 1.25}rem` }}
                      className="py-1 text-white/40 text-xs font-mono"
                    >
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
