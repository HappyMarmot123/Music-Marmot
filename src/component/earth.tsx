"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useSpring } from "framer-motion";

interface EarthProps {
  width?: number;
  height?: number;
  className?: string;
  baseColor?: [number, number, number];
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
}

export default function Earth({
  width = 400,
  height = 400,
  className,
  baseColor = [1, 0.6, 0.64], // #ff98a2에 가까운 RGB 값
  markerColor = [1, 0.55, 0.6], // 약간 더 진한 #ff98a2 색상
  glowColor = [1, 0.65, 0.68], // 약간 더 밝은 #ff98a2 색상
}: EarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const rotation = useSpring(0, {
    damping: 50,
    stiffness: 400,
  });

  useEffect(() => {
    let phi = 0;
    let globe: ReturnType<typeof createGlobe>;

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2, // 디바이스 픽셀 비율 - 고해상도 디스플레이에서 선명도 향상을 위해 사용
        width: width, // 지구본 캔버스의 너비
        height: height, // 지구본 캔버스의 높이
        phi: 0, // 수평 회전 값 (경도) - 지구본의 초기 X축 회전 위치
        theta: 0.3, // 수직 회전 값 (위도) - 지구본의 초기 Y축 회전 위치 (0은 적도, π/2는 북극)
        dark: 1, // 어두운 면의 강도 - 0(밝음)에서 1(어두움) 사이의 값
        diffuse: 1.2, // 표면 조명의 확산 정도 - 값이 클수록 빛이 더 많이 분산됨
        mapSamples: 16000, // 지구본 표면 맵의 샘플링 포인트 수 - 값이 클수록 해상도가 높아짐
        mapBrightness: 6, // 지구본 표면의 밝기 - 값이 클수록 더 밝게 보임
        baseColor: baseColor, // 지구본 기본 색상 [R, G, B] - RGB 값은 0~1 사이
        markerColor: markerColor, // 마커 색상 [R, G, B] - 지구본 위 마커의 색상
        glowColor: glowColor, // 지구본 주변 글로우 효과 색상 [R, G, B]
        markers: [], // 지구본 위에 표시할 마커 배열 - [{lng: 경도, lat: 위도}] 형식
        scale: 2.0, // 지구본 사이즈
        offset: [250, -250], // 지구본 위치 오프셋 [x, y] - [0, 0]은 캔버스 중앙
        onRender: (state) => {
          phi += 0.005; // 자동 회전 속도 조절 - 값이 클수록 빠르게 회전

          // 현재 회전 상태 업데이트 (자동 회전 + 사용자 인터랙션)
          state.phi = phi + rotation.get();
          state.width = width;
          state.height = height;
        },
      });
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, [width, height, rotation, baseColor, markerColor, glowColor]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    canvasRef.current?.style.setProperty("cursor", "grabbing");
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    canvasRef.current?.style.setProperty("cursor", "grab");
  };

  const handlePointerOut = () => {
    pointerInteracting.current = null;
    canvasRef.current?.style.setProperty("cursor", "grab");
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      rotation.set(delta / 100);
    }
  };

  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        cursor: "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onPointerMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          display: "block",
          touchAction: "none",
        }}
      />
    </div>
  );
}
