"use client";

import { EarthProps } from "@/shared/types/dataType";
import useEarth from "@/shared/hooks/useEarth";

export default function Earth({
  width,
  height,
  className,
  baseColor,
  markerColor,
  glowColor,
}: EarthProps) {
  const {
    canvasRef,
    handlePointerDown,
    handlePointerUp,
    handlePointerOut,
    handleMouseMove,
    rootStyle,
    canvasStyle,
  } = useEarth({ width, height, baseColor, markerColor, glowColor });

  return (
    <div
      className={className}
      style={{ ...rootStyle, position: "relative" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onPointerMove={handleMouseMove}
    >
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
}
