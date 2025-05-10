"use client";

import { useState, useRef, MouseEvent } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";
import clsx from "clsx";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import Image from "next/image";
import {
  AlbumArtworkProps,
  PlayerControlsSectionProps,
  PlayerTrackDetailsProps,
} from "@/type/dataType";
import { formatTime } from "@/lib/util";

// TODO: Open Source = https://codepen.io/singhimalaya/pen/QZKqOX

// Root here
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
  const seekBarContainerRef = useRef<HTMLDivElement | null>(null);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event: MouseEvent<HTMLDivElement>) => {
    if (!seekBarContainerRef.current || !duration) return;
    const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
    const seekRatio = (event.clientX - seekBarRect.left) / seekBarRect.width;
    const seekTime = duration * seekRatio;
    seek(seekTime);
  };

  const handleSeekMouseMove = (event: MouseEvent<HTMLDivElement>) => {
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
      className="absolute top-24 right-0 left-0 w-[344px] h-[80px] mx-auto mt-[-4px]"
    >
      <div id="player" className="relative h-full z-[3]">
        <PlayerTrackDetails
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          currentProgress={currentProgress}
          seekBarContainerRef={seekBarContainerRef}
          handleSeek={handleSeek}
          handleSeekMouseMove={handleSeekMouseMove}
          handleSeekMouseOut={handleSeekMouseOut}
          seekHoverTime={seekHoverTime}
          seekHoverPosition={seekHoverPosition}
        />
        <div
          id="player-content"
          className="relative h-full bg-white shadow-[0_15px_40px_#656565] rounded-[15px] z-[2]"
        >
          <AlbumArtwork
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            currentTrackInfo={currentTrackInfo}
          />
          <PlayerControlsSection
            currentTrackInfo={currentTrackInfo}
            prevTrack={prevTrack}
            togglePlayPause={togglePlayPause}
            nextTrack={nextTrack}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
}

const PlayerTrackDetails: React.FC<PlayerTrackDetailsProps> = ({
  isPlaying,
  currentTime,
  duration,
  currentProgress,
  seekBarContainerRef,
  handleSeek,
  handleSeekMouseMove,
  handleSeekMouseOut,
  seekHoverTime,
  seekHoverPosition,
}) => {
  return (
    <div
      id="player-track"
      className={clsx(
        "absolute right-[15px] left-[15px] pt-[6px] pr-[22px] pb-[16px] pl-[147px] bg-white rounded-t-[15px] transition-all duration-300 ease-[ease] z-[1]",
        isPlaying || currentTime > 0 ? "top-[-45px]" : "top-0"
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
      </section>
    </div>
  );
};

const AlbumArtwork: React.FC<AlbumArtworkProps> = ({
  isPlaying,
  isBuffering,
  currentTrackInfo,
}) => {
  const albumArtBaseUrl =
    "https://singhimalaya.github.io/Codepen/assets/img/album-arts/";
  const artWorks = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

  return (
    <div
      id="album-art"
      className={clsx(
        "absolute w-[92px] h-[92px] ml-[32px] bg-gray-300 transform top-[-32px] rotate-0 transition-all duration-300 ease-[ease] shadow-[0_0_0_10px_#fff] rounded-full overflow-hidden",
        isPlaying &&
          "active shadow-[0_0_0_4px_#fff7f7,_0_30px_50px_-15px_#afb7c1]",
        isBuffering &&
          "buffering [&>img]:opacity-25 [&>img.active]:opacity-80 [&>img.active]:blur-sm [&_#buffer-box]:opacity-100"
      )}
    >
      {artWorks.map((art, index) => (
        <Image
          key={index}
          src={`${albumArtBaseUrl}${art}`}
          className={clsx(
            "block absolute top-0 left-0 w-full h-full opacity-0 z-[-1] transition-opacity duration-100 linear",
            currentTrackInfo?.artworkId === `_${index + 1}` &&
              "active opacity-100 z-[1]",
            isPlaying &&
              currentTrackInfo?.artworkId === `_${index + 1}` &&
              "animate-rotate-album"
          )}
          width={92}
          height={92}
          id={`_${index + 1}`}
          alt="Album Art"
          priority={index === 0}
        />
      ))}
      <div
        id="buffer-box"
        className="absolute top-1/2 right-0 left-0 h-[13px] text-[#1f1f1f] text-[13px] font-['Helvetica'] text-center font-bold leading-none p-[6px] mt-[-12px] mx-auto bg-[rgba(255,255,255,0.19)] opacity-0 z-[2] transition-opacity duration-100 linear pointer-events-none"
      >
        Buffering ...
      </div>
    </div>
  );
};

const PlayerControlButton: React.FC<{
  id: string;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ id, onClick, ariaLabel, children }) => {
  return (
    <button
      className="button w-8 h-8 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease] bg-[#ffffff] hover:bg-[#b3bac2]"
      id={id}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

const PlayerControlsSection: React.FC<PlayerControlsSectionProps> = ({
  currentTrackInfo,
  prevTrack,
  togglePlayPause,
  nextTrack,
  isPlaying,
}) => {
  return (
    <div
      id="player-controls"
      className="w-[200px] gap-1 h-full mx-[5px] ml-[113px] float-right overflow-hidden flex flex-col justify-center items-center"
    >
      <section className="flex flex-col w-5/6 overflow-hidden">
        <div
          id="album-name"
          className="text-slate-700 text-sm font-bold w-full transition-colors duration-300 cursor-default overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {currentTrackInfo?.album || "Album Name"}
        </div>
        <div
          id="track-name"
          className="text-slate-500 text-xs w-full transition-colors duration-300 cursor-default overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {currentTrackInfo?.name || "Track Name"}
        </div>
      </section>
      <section className="flex items-center justify-around w-full">
        <div className="control">
          <PlayerControlButton
            id="play-previous"
            onClick={prevTrack}
            ariaLabel="Previous track"
          >
            <SkipBack
              className="block m-auto transition-colors duration-200 ease-[ease] text-[#b3bac2] group-hover:text-[#ffffff]"
              width={20}
              fill="#b3bac2"
            />
          </PlayerControlButton>
        </div>
        <div className="control">
          <PlayerControlButton
            id="play-pause"
            onClick={togglePlayPause}
            ariaLabel="Play/Pause"
          >
            {isPlaying ? (
              <Pause
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#b3bac2] group-hover:text-[#ffffff]"
                width={20}
                fill="#b3bac2"
              />
            ) : (
              <Play
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#b3bac2] group-hover:text-[#ffffff]"
                width={20}
                fill="#b3bac2"
              />
            )}
          </PlayerControlButton>
        </div>
        <div className="control">
          <PlayerControlButton
            id="play-next"
            onClick={nextTrack}
            ariaLabel="Next track"
          >
            <SkipForward
              className="block m-auto transition-colors duration-200 ease-[ease] text-[#b3bac2] group-hover:text-[#ffffff]"
              width={20}
              fill="#b3bac2"
            />
          </PlayerControlButton>
        </div>
      </section>
    </div>
  );
};
