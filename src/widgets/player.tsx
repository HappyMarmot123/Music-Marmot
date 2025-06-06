"use client";

import { useEffect, useRef, useState } from "react";
import PlayerTrackDetails from "@/shared/components/playerTrackDetails";
import PlayerControlsSection from "@/shared/components/playerControlsSection";
import useTrackStore from "@/app/store/trackStore";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import {
  playNextTrackLogic,
  playPrevTrackLogic,
} from "@/shared/lib/audioPlayerUtil";
import AudioPlayer from "@/widgets/audioPlayer";

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    setTrack,
  } = useTrackStore();

  const { cloudinaryData } = useCloudinaryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const seekBarContainerRef = useRef<HTMLDivElement | null>(null);

  const nextTrack = () => {
    playNextTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  };

  const prevTrack = () => {
    playPrevTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  };

  if (!currentTrack) {
    return null;
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (seekBarContainerRef.current) {
      const seekBar = seekBarContainerRef.current;
      const clickPosition =
        event.clientX - seekBar.getBoundingClientRect().left;
      const seekBarWidth = seekBar.offsetWidth;
      const seekRatio = clickPosition / seekBarWidth;
      const seekTime = seekRatio * duration;
      seekTo(seekTime);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-between text-white p-4">
      <div className="flex-1">
        <PlayerTrackDetails
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          currentProgress={(currentTime / duration) * 100}
          seekBarContainerRef={seekBarContainerRef}
          handleSeek={handleSeek}
          handleSeekMouseOut={() => {}}
          seekHoverTime={null}
          seekHoverPosition={0}
        />
      </div>

      <div className="flex-shrink-0 w-1/3 flex justify-center">
        <PlayerControlsSection
          currentTrackInfo={currentTrack}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          nextTrack={nextTrack}
          prevTrack={prevTrack}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      </div>

      <div className="flex-1 flex items-center justify-end">
        <AudioPlayer />
      </div>
    </div>
  );
}
