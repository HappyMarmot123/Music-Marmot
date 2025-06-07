import React from "react";
import { PlayerTrackDetailsProps } from "@/shared/types/dataType";
import clsx from "clsx";
import { formatTime, handleMouseMove, handleMouseOut } from "@/shared/lib/util";

const PlayerTrackDetails: React.FC<PlayerTrackDetailsProps> = ({
  isPlaying,
  currentTime,
  duration,
  currentProgress,
  seekBarContainerRef,
  seek,
}) => {
  const seekTimeTooltipRef = React.useRef<HTMLDivElement>(null);

  const handleSeekInteraction = (event: React.MouseEvent<HTMLElement>) => {
    if (!seekBarContainerRef.current || !duration) return;

    const rect = seekBarContainerRef.current.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const seekFraction = clickPosition / rect.width;
    const seekTime = seekFraction * duration;
    seek(seekTime);
  };

  return (
    <div
      id="player-track"
      className={clsx(
        "absolute right-[15px] left-[15px] pt-[6px] pr-[22px] pb-[16px] pl-[147px] bg-white rounded-t-[15px] transition-all duration-300 ease-[ease] z-[1]",
        isPlaying ? "top-[-40px]" : "top-0"
      )}
    >
      <section
        id="track-time"
        className={clsx(
          "flex items-center w-full py-2",
          (isPlaying || currentTime > 0) &&
            "active [&>div]:text-[#f86d92] [&>div]:bg-transparent"
        )}
      >
        <div
          id="current-time"
          className="text-transparent text-[11px] bg-[#ffe8ee] rounded-[10px] transition-all duration-300 ease-[ease] px-1"
        >
          {formatTime(currentTime)}
        </div>
        <section
          id="seek-bar-container"
          ref={seekBarContainerRef}
          className="no-drag relative h-[8px] rounded-[4px] bg-[#ffe8ee] cursor-pointer group mx-2 flex-grow"
          onClick={handleSeekInteraction}
          onMouseMove={(e) =>
            handleMouseMove(
              e,
              seekBarContainerRef,
              seekTimeTooltipRef,
              duration
            )
          }
          onMouseOut={() =>
            handleMouseOut(seekTimeTooltipRef, seekBarContainerRef)
          }
        >
          <div
            id="seek-time"
            ref={seekTimeTooltipRef}
            className="absolute bottom-[10px] text-white text-[12px] whitespace-pre p-[5px] rounded-[4px] bg-[#3b3d50] transform -translate-x-1/2 z-10 pointer-events-none opacity-0 transition-opacity"
          ></div>
          <div
            id="seek-bar"
            className="absolute inset-0 left-0 h-full w-0 bg-[#fd6d94] rounded-[4px] transition-width duration-200 ease-[ease] z-[1] pointer-events-none"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </section>
        <div
          id="track-length"
          className="text-transparent text-[11px] bg-[#ffe8ee] rounded-[10px] transition-all duration-300 ease-[ease] px-1"
        >
          {formatTime(duration)}
        </div>
      </section>
    </div>
  );
};

export default PlayerTrackDetails;
