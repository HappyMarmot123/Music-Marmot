import React, { useRef, useState, MouseEvent } from "react";
import { formatTime, handleSeekInteraction } from "@/lib/util";

interface ModalPlayerTrackDetailsProps {
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
}

const ModalPlayerTrackDetails: React.FC<ModalPlayerTrackDetailsProps> = ({
  currentTime,
  duration,
  seek,
}) => {
  const seekBarContainerRef = useRef<HTMLDivElement>(null);
  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPosition, setSeekHoverPosition] = useState<number>(0);

  const calculateProgress = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const handleSeekClick = (event: MouseEvent<HTMLDivElement>) => {
    handleSeekInteraction(
      event,
      seekBarContainerRef,
      duration,
      seek,
      setSeekHoverTime,
      setSeekHoverPosition
    );
  };

  const handleSeekMouseOut = () => {
    setSeekHoverTime(null);
    setSeekHoverPosition(0);
  };

  return (
    <section aria-label="재생 진행 막대" className="w-full mt-6 mb-2">
      <div
        ref={seekBarContainerRef}
        className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group relative"
        onClick={handleSeekClick}
        onMouseMove={handleSeekClick}
        onMouseOut={handleSeekMouseOut}
      >
        {seekHoverTime !== null && (
          <div
            className="absolute bottom-full mb-2 text-white text-xs whitespace-nowrap p-1 rounded bg-black/70 transform -translate-x-1/2 pointer-events-none z-20"
            style={{ left: `${seekHoverPosition}px` }}
          >
            {formatTime(seekHoverTime)}
          </div>
        )}
        <div
          className="absolute inset-0 left-0 h-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
          style={{ width: `${seekHoverPosition}px` }}
        ></div>
        <div
          className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </section>
  );
};

export default ModalPlayerTrackDetails;
