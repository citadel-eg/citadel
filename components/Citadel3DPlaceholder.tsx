import React from "react";
import { Citadel3DModel } from "./Citadel3DModel";

interface Citadel3DPlaceholderProps {
  label?: string;
  className?: string;
  heightClass?: string;
  phase?: number | "all";
  showControls?: boolean;
  borderless?: boolean;
  lockRotation?: boolean;
  enablePhaseHover?: boolean;
  enablePhaseClick?: boolean;
  spinOnPhase8?: boolean;
}

export function Citadel3DPlaceholder({
  label,
  className = "",
  heightClass = "h-[420px] sm:h-[500px]",
  phase = "all",
  showControls = false,
  borderless = false,
  lockRotation = false,
  enablePhaseHover = false,
  enablePhaseClick = false,
  spinOnPhase8 = true,
}: Citadel3DPlaceholderProps) {
  return (
    <Citadel3DModel
      label={label}
      className={className}
      heightClass={heightClass}
      phase={phase}
      showControls={showControls}
      borderless={borderless}
      lockRotation={lockRotation}
      enablePhaseHover={enablePhaseHover}
      enablePhaseClick={enablePhaseClick}
      spinOnPhase8={spinOnPhase8}
    />
  );
}

export { Citadel3DModel };
