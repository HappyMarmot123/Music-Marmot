import React, { useEffect, useRef } from "react";
import { AudioVisualizerProps } from "@/type/dataType";

/* 
  TODO: mdn doc reference
  https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser
*/

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyserNode,
  isPlaying,
  width = 224,
  height = 224,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying) {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
        return;
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 1.5; // TODO: 펌핑효과

        const r = barHeight + 25 * (i / bufferLength);
        const g = 200 * (i / bufferLength) + 50;
        const b = 100 + barHeight / 3;

        ctx.fillStyle = `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(
          255,
          b
        )})`;

        // analyser.fftSize = 512 사이즈에 맞춰서 스타일 진행

        // 리니어 막대바
        // ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        const segmentVisibleHeight = 6; // 보이는 세그먼트 높이
        const segmentGapHeight = 1; // 가려지는 간격 높이
        const totalSegmentStep = segmentVisibleHeight + segmentGapHeight; // 전체 세그먼트 단위 높이
        const barPixelTop = canvas.height - barHeight; // 막대의 실제 상단 y 좌표

        for (
          let yCurrentSegmentBottom = canvas.height; // 현재 그릴 세그먼트의 하단 y 좌표 (캔버스 바닥에서 시작)
          yCurrentSegmentBottom > barPixelTop; // 세그먼트 하단이 막대 상단보다 위에 있는 동안 반복
          yCurrentSegmentBottom -= totalSegmentStep // 다음 세그먼트 위치로 이동
        ) {
          const yCurrentSegmentTopPotential =
            yCurrentSegmentBottom - segmentVisibleHeight;

          // 실제 그려질 세그먼트의 상단 y 좌표 (막대 높이를 넘지 않도록 조정)
          const drawableSegmentTop = Math.max(
            yCurrentSegmentTopPotential,
            barPixelTop
          );

          // 실제 그려질 세그먼트의 높이
          const drawableSegmentHeight =
            yCurrentSegmentBottom - drawableSegmentTop;

          if (drawableSegmentHeight > 0) {
            ctx.fillRect(
              x,
              drawableSegmentTop,
              barWidth,
              drawableSegmentHeight
            );
          }
        }

        x += barWidth + 3; // 막대 좌우 간격
      }
    };

    draw();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [analyserNode, isPlaying, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg shadow-lg"
    />
  );
};

export default AudioVisualizer;
