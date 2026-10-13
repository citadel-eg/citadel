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
  lockRotationX?: boolean;
  lockRotationY?: boolean;
  snapBackOnRelease?: boolean;
  showGround?: boolean;
  disableGround?: boolean;
  enablePhaseHover?: boolean;
  enablePhaseClick?: boolean;
  spinOnPhase8?: boolean;
  onReady?: (status: { success: boolean; webglAvailable: boolean; error?: Error }) => void;
}

export function Citadel3DPlaceholder({
  label,
  className = "",
  heightClass = "h-[420px] sm:h-[500px]",
  phase = "all",
  showControls = false,
  borderless = false,
  lockRotation = false,
  lockRotationX,
  lockRotationY,
  snapBackOnRelease = false,
  showGround = true,
  disableGround = false,
  enablePhaseHover = false,
  enablePhaseClick = false,
  spinOnPhase8 = true,
  onReady,
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
      lockRotationX={lockRotationX}
      lockRotationY={lockRotationY}
      snapBackOnRelease={snapBackOnRelease}
      showGround={showGround}
      disableGround={disableGround}
      enablePhaseHover={enablePhaseHover}
      enablePhaseClick={enablePhaseClick}
      spinOnPhase8={spinOnPhase8}
      onReady={onReady}
    />
  );
}

export { Citadel3DModel };
