import React from "react";
import { Citadel3DPlaceholder } from "./Citadel3DPlaceholder";

interface StatementItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  artworkPosition: "left" | "right";
}

const statements: StatementItem[] = [
  {
    id: "01",
    tag: "01 — BUSINESS",
    title: "BUSINESS FIRST.",
    description: "The foundation of every Citadel solution.",
    artworkPosition: "left",
  },
  {
    id: "02",
    tag: "02 — UNDERSTANDING",
    title: "UNDERSTAND THE PROBLEM.",
    description: "Start with the real operational problem.",
    artworkPosition: "right",
  },
  {
    id: "03",
    tag: "03 — STRUCTURE",
    title: "STRUCTURE THE PROCESS.",
    description: "Turn complexity into a clear system.",
    artworkPosition: "left",
  },
  {
    id: "04",
    tag: "04 — SOLUTION",
    title: "DESIGN THE RIGHT SYSTEM.",
    description: "Technology follows the business need.",
    artworkPosition: "right",
  },
  {
    id: "05",
    tag: "05 — EXECUTION",
    title: "BUILD WITH PURPOSE.",
    description: "Turn the solution into something that works.",
    artworkPosition: "left",
  },
  {
    id: "06",
    tag: "06 — GROWTH",
    title: "SCALE WHAT WORKS.",
    description: "Build systems that can grow with the business.",
    artworkPosition: "right",
  },
  {
    id: "07",
    tag: "07 — IMPACT",
    title: "CREATE LASTING VALUE.",
    description: "The goal is sustainable growth, not a temporary fix.",
    artworkPosition: "left",
  },
];

export function Statements() {
  return (
    <section className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 space-y-20 md:space-y-28">
      <div className="max-w-[1353px] mx-auto space-y-20 md:space-y-28">
        {statements.map((stmt) => {
          const isArtworkLeft = stmt.artworkPosition === "left";

          return (
            <div
              key={stmt.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 items-center ${
                isArtworkLeft ? "" : "lg:grid-flow-dense"
              }`}
            >
              {/* 3D Artwork Area */}
              <div className={`${isArtworkLeft ? "order-1" : "order-1 lg:order-2"}`}>
                <Citadel3DPlaceholder
                  label={`3D MODEL — ${stmt.id} ${stmt.title.replace(".", "")}`}
                  heightClass="h-[380px] sm:h-[480px] lg:h-[520px]"
                />
              </div>

              {/* Text content */}
              <div
                className={`flex flex-col justify-center space-y-4 md:space-y-6 ${
                  isArtworkLeft ? "order-2" : "order-2 lg:order-1"
                }`}
              >
                <span className="text-xs sm:text-[13px] font-semibold tracking-[2px] uppercase text-brand">
                  {stmt.tag}
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
                  {stmt.title}
                </h2>
                <p className="text-base sm:text-xl text-white/60 font-normal leading-relaxed max-w-xl">
                  {stmt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
