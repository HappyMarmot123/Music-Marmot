import React from "react";
import { PlayerTrackDetailsProps } from "@/type/dataType";
import clsx from "clsx";
import { formatTime } from "@/lib/util";

const PlayerTrackDetails: React.FC<PlayerTrackDetailsProps> = ({
  isPlaying,
  currentTime,
  duration,
  currentProgress,
  seekBarContainerRef,
  handleSeek,
  handleSeekMouseOut,
  seekHoverTime,
  seekHoverPosition,
}) => {
  return (
    <div
      id="player-track"
      className={clsx(
        "absolute right-[15px] left-[15px] pt-[6px] pr-[22px] pb-[16px] pl-[147px] bg-white rounded-t-[15px] transition-all duration-300 ease-[ease] z-[1]",
        isPlaying ? "top-[-45px]" : "top-0"
      )}
    >
      <section
        id="track-time"
        className={clsx(
          "mb-1 overflow-hidden",
          (isPlaying || currentTime > 0) &&
            "active [&>div]:text-[#f86d92] [&>div]:bg-transparent"
        )}
      >
        <div
          id="current-time"
          className="float-left text-transparent text-[11px] bg-[#ffe8ee] rounded-[10px] transition-all duration-300 ease-[ease] px-1"
        >
          {formatTime(currentTime)}
        </div>
        <div
          id="track-length"
          className="float-right text-transparent text-[11px] bg-[#ffe8ee] rounded-[10px] transition-all duration-300 ease-[ease] px-1"
        >
          {formatTime(duration)}
        </div>
      </section>
      <section
        id="seek-bar-container"
        ref={seekBarContainerRef}
        className="relative h-[6px] rounded-[4px] bg-[#ffe8ee] cursor-pointer group"
        onClick={handleSeek}
        onMouseMove={handleSeek}
        onMouseOut={handleSeekMouseOut}
      >
        {seekHoverTime !== null && (
          <div
            id="seek-time"
            className="absolute bottom-[10px] text-white text-[12px] whitespace-pre p-[5px] rounded-[4px] bg-[#3b3d50] transform -translate-x-1/2 z-10 pointer-events-none"
            style={{ left: `${seekHoverPosition}px` }}
          >
            {formatTime(seekHoverTime)}
          </div>
        )}
        <div
          id="s-hover"
          className="absolute inset-0 left-0 h-full opacity-20 z-[2] bg-[#3b3d50] pointer-events-none"
          style={{ width: `${seekHoverPosition}px` }}
        ></div>
        <div
          id="seek-bar"
          className="absolute inset-0 left-0 h-full w-0 bg-[#fd6d94] rounded-[4px] transition-width duration-200 ease-[ease] z-[1] pointer-events-none"
          style={{ width: `${currentProgress}%` }}
        ></div>
      </section>
    </div>
  );
};

export default PlayerTrackDetails;
