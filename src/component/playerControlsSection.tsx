import React from "react";
import { PlayerControlsSectionProps } from "@/type/dataType";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

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

export default PlayerControlsSection;
