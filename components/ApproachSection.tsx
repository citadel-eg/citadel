import React from "react";

interface LayerItem {
  id: string;
  name: string;
  description: string;
  minHeightClass: string;
  activeSteps: number; // 1 to 5 for the mini indicator bar
}

const layers: LayerItem[] = [
  {
    id: "01",
    name: "DISCOVER",
    description: "Understand the operational problem.",
    minHeightClass: "min-h-[380px] lg:mt-[340px]",
    activeSteps: 1,
  },
  {
    id: "02",
    name: "ARCHITECT",
    description: "Design the system structure.",
    minHeightClass: "min-h-[460px] lg:mt-[255px]",
    activeSteps: 2,
  },
  {
    id: "03",
    name: "BUILD",
    description: "Develop and test the solution.",
    minHeightClass: "min-h-[550px] lg:mt-[170px]",
    activeSteps: 3,
  },
  {
    id: "04",
    name: "DEPLOY",
    description: "Implement and transfer ownership.",
    minHeightClass: "min-h-[630px] lg:mt-[85px]",
    activeSteps: 4,
  },
  {
    id: "05",
    name: "SUPPORT",
    description: "Long-term partnership and evolution.",
    minHeightClass: "min-h-[720px] lg:mt-0",
    activeSteps: 5,
  },
];

export function ApproachSection() {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            05
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            OUR APPROACH
          </span>
        </div>

        {/* Section Title and Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white uppercase leading-[1.08] tracking-tight">
              FIVE LAYERS. EACH ONE EARNS THE NEXT.
            </h2>
          </div>
          <div className="lg:col-span-4 border-l border-white/30 pl-6 py-2">
            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
              A disciplined sequence. No layer is built until the one beneath it can carry the weight.
            </p>
          </div>
        </div>

        {/* 5 Ascending Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:items-end">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`flex flex-col justify-between p-7 border border-white/15 bg-[#080d16] hover:border-brand/40 transition-colors duration-300 ${layer.minHeightClass}`}
            >
              {/* Top: Number & Stair Icon */}
              <div className="flex items-start justify-between">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {layer.id}
                </span>
                <svg
                  className="w-5 h-5 text-white/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 20h4v-4h4v-4h4v-4h4" />
                </svg>
              </div>

              {/* Bottom: Progress bars + Title + Description */}
              <div className="flex flex-col space-y-4 pt-10">
                {/* 5 Step Indicator segments */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((stepIdx) => (
                    <span
                      key={stepIdx}
                      className={`h-[3px] flex-1 rounded-sm ${
                        stepIdx <= layer.activeSteps ? "bg-brand" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  {layer.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-normal leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
