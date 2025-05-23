"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";

const audioUrl = "/BEATPELLAHOUSE_CandyThief.mp3";

export default function WavesurferHookPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  //   container: document.body,
  //   waveColor: 'rgb(200, 0, 200)',
  //   progressColor: 'rgb(100, 0, 100)',
  //   url: '/examples/audio/demo.wav',

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: audioUrl,
    waveColor: "rgb(245, 158, 11)",
    progressColor: "rgb(252, 211, 77)",
    height: 100,
    // barWidth: 2,
    // barGap: 2,
    // barRadius: 2,
    // cursorWidth: 2,
    cursorColor: "rgb(229, 231, 235)",
    autoplay: false,
  });

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (wavesurfer) {
      wavesurfer.setVolume(Number(event.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (wavesurfer) {
      setDuration(wavesurfer.getDuration());
    }
  }, [wavesurfer]);

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-gray-800 text-white rounded-lg shadow-xl min-h-screen flex flex-col justify-center">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-amber-400">
          useWavesurfer Hook Example
        </h1>

        <div
          ref={containerRef}
          className="my-4 p-4 bg-gray-700 rounded-md shadow-inner"
        />

        {isReady ? (
          <div className="flex flex-col items-center space-y-6 mt-8">
            <button
              onClick={onPlayPause}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg text-lg font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <div className="w-full max-w-md">
              <label
                htmlFor="volume-hook"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Volume:
              </label>
              <input
                type="range"
                id="volume-hook"
                name="volume"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.7"
                onChange={handleVolumeChange}
                className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="text-md text-gray-300">
              <span>{formatTime(currentTime)}</span> /{" "}
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-8">Loading waveform...</p>
        )}

        <p className="mt-10 text-xs text-center text-gray-500">
          Audio: BEATPELLAHOUSE_CandyThief.mp3
        </p>
      </div>
    </div>
  );
}
