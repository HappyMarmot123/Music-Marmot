"use client";

import { useRef } from "react";
import PlayerTrackDetails from "@/features/audio/components/playerTrackDetails";
import PlayerControlsSection from "@/features/audio/components/playerControlsSection";
import useTrackStore from "@/app/store/trackStore";
import AudioPlayer from "@/widgets/audioPlayer";

export default function Player() {
  const { currentTrack, isPlaying, currentTime, duration, seekTo } =
    useTrackStore();

  const seekBarContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-between text-white p-4">
      <div className="flex-1">
        <PlayerTrackDetails
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          currentProgress={(currentTime / duration) * 100}
          seekBarContainerRef={seekBarContainerRef}
          seek={seekTo}
        />
      </div>

      <div className="flex-shrink-0 w-1/3 flex justify-center">
        <PlayerControlsSection currentTrackInfo={currentTrack} />
      </div>

      <div className="flex-1 flex items-center justify-end">
        <AudioPlayer />
      </div>
    </div>
  );
}
