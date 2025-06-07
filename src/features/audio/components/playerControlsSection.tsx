import React from "react";
import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import { PlayerControlsSectionProps } from "@/shared/types/dataType";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useVolumeControl } from "@/features/player/hook/useVolumeControl";

const PlayerControlButton: React.FC<{
  id: string;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ id, onClick, ariaLabel, children }) => {
  return (
    <button
      className="button w-8 h-8 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease] bg-[#ffffff] hover:bg-[#d6d6d6]"
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
}) => {
  const {
    isPlaying,
    volume,
    isMuted,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume,
    setLiveVolume,
    toggleMute,
  } = useAudioPlayer();
  const { localVolume, handleVolumeChange, handleVolumeChangeEnd } =
    useVolumeControl(volume, setVolume, setLiveVolume, isMuted, toggleMute);

  return (
    <div
      id="player-controls"
      className="w-[300px] gap-1 h-full mx-[5px] ml-[113px] float-right overflow-hidden flex flex-col justify-center items-center"
    >
      <section className="flex flex-col w-5/6 overflow-hidden">
        <div
          id="album-name"
          className="text-slate-700 text-sm font-bold w-full transition-colors duration-300  overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {currentTrackInfo?.album || "Album Name"}
        </div>
        <div
          id="track-name"
          className="text-slate-500 text-xs w-full transition-colors duration-300  overflow-hidden whitespace-nowrap text-ellipsis"
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
              className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
              width={20}
              fill="#fd6d94"
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
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
                width={20}
                fill="#fd6d94"
              />
            ) : (
              <Play
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
                width={20}
                fill="#fd6d94"
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
              className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
              width={20}
              fill="#fd6d94"
            />
          </PlayerControlButton>
        </div>
        <div className="control">
          <PlayerControlButton
            id="volume-control"
            onClick={toggleMute}
            ariaLabel="Volume"
          >
            {isMuted ? (
              <VolumeX
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
                width={20}
                fill="#fd6d94"
              />
            ) : (
              <Volume2
                className="block m-auto transition-colors duration-200 ease-[ease] text-[#fd6d94] "
                width={20}
                fill="#fd6d94"
              />
            )}
          </PlayerControlButton>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : localVolume}
          onChange={handleVolumeChange}
          onMouseUp={handleVolumeChangeEnd}
          onTouchEnd={handleVolumeChangeEnd}
          className="no-drag w-1/4 h-1.5 bg-[#ffe8ee] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#fd6d94] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#fd6d94] [&::-moz-range-thumb]:cursor-pointer"
        />
      </section>
    </div>
  );
};

export default PlayerControlsSection;
