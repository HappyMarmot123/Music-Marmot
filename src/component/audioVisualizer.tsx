import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  width?: number;
  height?: number;
}

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
        const barHeight = dataArray[i] / 1.5;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 200 * (i / bufferLength) + 50;
        const b = 100 + barHeight / 3;

        ctx.fillStyle = `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(
          255,
          b
        )})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
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
