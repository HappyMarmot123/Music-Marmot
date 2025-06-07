"use client";

import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import React, { useRef, useEffect, useCallback } from "react";
import useWaveSurferStore from "@/app/store/wavesurferStore";

const Waveform = () => {
  const { audioPlayer, isBuffering, seek, currentTime } = useAudioPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const programmaticSeekRef = useRef(false);

  const { initialize, isLoading, wavesurfer } = useWaveSurferStore();

  const handleSeek = useCallback(
    (progress: number) => {
      if (programmaticSeekRef.current) {
        programmaticSeekRef.current = false;
        return;
      }

      if (audioPlayer?.duration) {
        const seekTime = audioPlayer.duration * progress;
        seek(seekTime);
      }
    },
    [audioPlayer]
  );

  useEffect(() => {
    if (containerRef.current && audioPlayer) {
      initialize(containerRef.current, audioPlayer, handleSeek);
    }
  }, [audioPlayer]);

  useEffect(() => {
    if (!wavesurfer || !audioPlayer?.duration) return;
    const wavesurferTime = wavesurfer.getCurrentTime();

    if (Math.abs(wavesurferTime - currentTime) > 0.1) {
      programmaticSeekRef.current = true;
      const progress = currentTime / audioPlayer.duration;
      wavesurfer.seekTo(progress);
    }
  }, [currentTime, audioPlayer, wavesurfer]);

  return (
    <div className="relative w-full h-[30px]">
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default Waveform;
