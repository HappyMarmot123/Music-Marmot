"use client";

import React, { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string; // MP3 파일의 public URL
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration);

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", setAudioTime);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error("Audio play failed:", error)); // 자동 재생 정책 등 에러 처리
    }
    setIsPlaying(!isPlaying);
  };

  // 시간 포맷 함수 (예: 0:00)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-4 bg-neutral-700 rounded-lg shadow-inner flex items-center space-x-4">
      <audio ref={audioRef} src={src} preload="metadata"></audio>
      <button
        onClick={togglePlayPause}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="text-sm text-neutral-300">
        <span>{formatTime(currentTime)}</span> /{" "}
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
