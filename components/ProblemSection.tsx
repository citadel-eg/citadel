import React from "react";

export function ProblemSection() {
  const cards = [
    {
      id: "/ 01",
      title: "MANUAL WORK",
      description: "Repeated tasks consume time and create unnecessary dependency.",
      footerNote: "TIME LOST TO REPETITION",
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="16" y2="12" />
          <line x1="4" y1="17" x2="18" y2="17" />
        </svg>
      ),
    },
    {
      id: "/ 02",
      title: "FRAGMENTED SYSTEMS",
      description: "Information lives across disconnected tools and processes.",
      footerNote: "INFORMATION WITHOUT CONNECTION",
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="6" height="6" />
          <rect x="15" y="3" width="6" height="6" />
          <rect x="9" y="15" width="6" height="6" />
          <path d="M6 9v3h12V9" />
          <path d="M12 12v3" />
        </svg>
      ),
    },
    {
      id: "/ 03",
      title: "UNSTRUCTURED GROWTH",
      description: "The business grows faster than the systems supporting it.",
      footerNote: "GROWTH WITHOUT A FOUNDATION",
      icon: (
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 20h4v-4h4v-4h4v-4h4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10">
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white font-mono">
            02
          </span>
          <span className="w-10 h-[1px] bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            The Real Problem
          </span>
        </div>

        {/* Section Heading & Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white uppercase leading-[1.08] tracking-tight">
              MOST BUSINESS PROBLEMS AREN&apos;T TECHNOLOGY PROBLEMS.
            </h2>
          </div>
          <div className="lg:col-span-4 border-l border-white/30 pl-6 py-2">
            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
              They are operational problems that technology has not solved yet.
            </p>
          </div>
        </div>

        {/* 3 Structured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col justify-between border border-white/15 rounded-md p-8 bg-[#080d16] hover:border-white/30 transition-colors duration-300 min-h-[340px]"
            >
              <div>
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between pb-8">
                  <span className="text-xs sm:text-sm font-mono text-white/60 tracking-wider">
                    {card.id}
                  </span>
                  <div>{card.icon}</div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 font-normal leading-relaxed mt-4">
                  {card.description}
                </p>
              </div>

              {/* Bottom Divider & Tag */}
              <div className="pt-8 border-t border-white/10 mt-8">
                <span className="text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                  {card.footerNote}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Sub-line */}
        <div className="flex justify-end pt-4">
          <span className="text-xs font-semibold tracking-[3px] uppercase text-white/40 font-mono">
            ONE OPERATIONAL SYSTEM, UNSOLVED
          </span>
        </div>
      </div>
    </section>
  );
}
