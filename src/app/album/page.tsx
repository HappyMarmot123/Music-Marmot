"use client";

import { useState, useRef } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";
import clsx from "clsx";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import Image from "next/image";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const minutesStr = String(minutes).padStart(2, "0");
  const secsStr = String(secs).padStart(2, "0");
  return `${minutesStr}:${secsStr}`;
}

const iconColor = "#b3bac2";
const iconHoverColor = "white";
const buttonBgColor = "#ffffff";
const buttonHoverBgColor = "#d6d6de";

export default function Album() {
  const {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    currentTrackInfo,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
  } = useAudioPlayer();

  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPosition, setSeekHoverPosition] = useState(0);
  const seekBarContainerRef = useRef<HTMLDivElement>(null);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarContainerRef.current || !duration) return;

    const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
    const seekRatio = (event.clientX - seekBarRect.left) / seekBarRect.width;
    const seekTime = duration * seekRatio;
    seek(seekTime);
  };

  const handleSeekMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarContainerRef.current || !duration) return;
    const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
    const hoverRatio = Math.max(
      0,
      Math.min(1, (event.clientX - seekBarRect.left) / seekBarRect.width)
    );
    const hoverTime = duration * hoverRatio;
    const hoverPosition = hoverRatio * seekBarRect.width;

    setSeekHoverTime(hoverTime);
    setSeekHoverPosition(hoverPosition);
  };

  const handleSeekMouseOut = () => {
    setSeekHoverTime(null);
    setSeekHoverPosition(0);
  };

  return (
    <div
      id="player-container"
      className="absolute top-24 right-0 left-0 w-[430px] h-[100px] mx-auto mt-[-4px]"
    >
      <div id="player" className="relative h-full z-[3]">
        <div
          id="player-track"
          className={clsx(
            "absolute right-[15px] left-[15px] pt-[13px] pr-[22px] pb-[10px] pl-[184px] bg-[#fff7f7] rounded-t-[15px] transition-all duration-300 ease-[ease] z-[1]",
            isPlaying || currentTime > 0 ? "top-[-92px]" : "top-0"
          )}
        >
          <div
            id="album-name"
            className="text-[#54576f] text-[17px] font-bold truncate"
          >
            {currentTrackInfo?.album || "Album Name"}
          </div>
          <div
            id="track-name"
            className="text-[#acaebd] text-[13px] my-[2px] mb-[13px] truncate"
          >
            {currentTrackInfo?.name || "Track Name"}
          </div>
          <div
            id="track-time"
            className={clsx(
              "h-[12px] mb-[3px] overflow-hidden",
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
          </div>
          <div
            id="seek-bar-container"
            ref={seekBarContainerRef}
            className="relative h-[4px] rounded-[4px] bg-[#ffe8ee] cursor-pointer group"
            onClick={handleSeek}
            onMouseMove={handleSeekMouseMove}
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
          </div>
        </div>
        <div
          id="player-content"
          className="relative h-full bg-white shadow-[0_30px_80px_#656565] rounded-[15px] z-[2]"
        >
          <div
            id="album-art"
            className={clsx(
              "absolute w-[115px] h-[115px] ml-[40px] transform rotate-0 transition-all duration-300 ease-[ease] shadow-[0_0_0_10px_#fff] rounded-full overflow-hidden",
              isPlaying
                ? "active top-[-60px] shadow-[0_0_0_4px_#fff7f7,_0_30px_50px_-15px_#afb7c1]"
                : "top-[-40px]",
              isBuffering &&
                "buffering [&>img]:opacity-25 [&>img.active]:opacity-80 [&>img.active]:blur-sm [&_#buffer-box]:opacity-100"
            )}
          >
            <Image
              src="https://singhimalaya.github.io/Codepen/assets/img/album-arts/1.jpg"
              className={clsx(
                "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
                currentTrackInfo?.artworkId === "_1" &&
                  "active opacity-100 z-[1]",
                isPlaying &&
                  currentTrackInfo?.artworkId === "_1" &&
                  "animate-rotate-album"
              )}
              width={115}
              height={115}
              id="_1"
              alt="Album Art"
            />
            <Image
              src="https://singhimalaya.github.io/Codepen/assets/img/album-arts/2.jpg"
              className={clsx(
                "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
                currentTrackInfo?.artworkId === "_2" &&
                  "active opacity-100 z-[1]",
                isPlaying &&
                  currentTrackInfo?.artworkId === "_2" &&
                  "animate-rotate-album"
              )}
              width={115}
              height={115}
              id="_2"
              alt="Album Art"
            />
            <Image
              src="https://singhimalaya.github.io/Codepen/assets/img/album-arts/3.jpg"
              className={clsx(
                "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
                currentTrackInfo?.artworkId === "_3" &&
                  "active opacity-100 z-[1]",
                isPlaying &&
                  currentTrackInfo?.artworkId === "_3" &&
                  "animate-rotate-album"
              )}
              width={115}
              height={115}
              id="_3"
              alt="Album Art"
            />
            <Image
              src="https://singhimalaya.github.io/Codepen/assets/img/album-arts/4.jpg"
              className={clsx(
                "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
                currentTrackInfo?.artworkId === "_4" &&
                  "active opacity-100 z-[1]",
                isPlaying &&
                  currentTrackInfo?.artworkId === "_4" &&
                  "animate-rotate-album"
              )}
              width={115}
              height={115}
              id="_4"
              alt="Album Art"
            />
            <Image
              src="https://singhimalaya.github.io/Codepen/assets/img/album-arts/5.jpg"
              className={clsx(
                "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
                currentTrackInfo?.artworkId === "_5" &&
                  "active opacity-100 z-[1]",
                isPlaying &&
                  currentTrackInfo?.artworkId === "_5" &&
                  "animate-rotate-album"
              )}
              width={115}
              height={115}
              id="_5"
              alt="Album Art"
            />
            <div
              id="buffer-box"
              className="absolute top-1/2 right-0 left-0 h-[13px] text-[#1f1f1f] text-[13px] font-['Helvetica'] text-center font-bold leading-none p-[6px] mt-[-12px] mx-auto bg-[rgba(255,255,255,0.19)] opacity-0 z-[2] transition-opacity duration-100 linear pointer-events-none"
            >
              Buffering ...
            </div>
          </div>
          <div
            id="player-controls"
            className="w-[250px] h-full mx-[5px] ml-[141px] float-right overflow-hidden flex items-center justify-around"
          >
            <div className="control">
              <button
                className={clsx(
                  "button w-12 h-12 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease]",
                  `bg-[${buttonBgColor}] hover:bg-[${buttonHoverBgColor}]`
                )}
                id="play-previous"
                onClick={prevTrack}
                aria-label="Previous track"
              >
                <SkipBack
                  className={clsx(
                    "block m-auto text-[26px] text-center leading-none transition-colors duration-200 ease-[ease]",
                    `text-[${iconColor}] group-hover:text-[${iconHoverColor}]`
                  )}
                  fill={iconColor}
                />
              </button>
            </div>
            <div className="control">
              <button
                className={clsx(
                  "button w-12 h-12 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease]",
                  `bg-[${buttonBgColor}] hover:bg-[${buttonHoverBgColor}]`
                )}
                id="play-pause"
                onClick={togglePlayPause}
                aria-label="Play/Pause"
              >
                {isPlaying ? (
                  <Pause
                    className={clsx(
                      "block m-auto text-[26px] text-center leading-none transition-colors duration-200 ease-[ease]",
                      `text-[${iconColor}] group-hover:text-[${iconHoverColor}]`
                    )}
                    fill={iconColor}
                  />
                ) : (
                  <Play
                    className={clsx(
                      "block m-auto text-[26px] text-center leading-none transition-colors duration-200 ease-[ease]",
                      `text-[${iconColor}] group-hover:text-[${iconHoverColor}]`
                    )}
                    fill={iconColor}
                  />
                )}
              </button>
            </div>
            <div className="control">
              <button
                className={clsx(
                  "button w-12 h-12 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease]",
                  `bg-[${buttonBgColor}] hover:bg-[${buttonHoverBgColor}]`
                )}
                id="play-next"
                onClick={nextTrack}
                aria-label="Next track"
              >
                <SkipForward
                  className={clsx(
                    "block m-auto text-[26px] text-center leading-none transition-colors duration-200 ease-[ease]",
                    `text-[${iconColor}] group-hover:text-[${iconHoverColor}]`
                  )}
                  fill={iconColor}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
