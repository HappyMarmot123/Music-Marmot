"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import type { TrackInfo } from "@/type/dataType";
import useCloudinaryStore from "@/store/cloudinaryStore";
import useTrackStore from "@/store/trackStore";
import {
  cleanupAudioInstance,
  getAudioInstance,
  getAnalyser,
  getAudioContext,
} from "./audioInstance";

export function useAudioPlayer() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const currentTrack = useTrackStore((state) => state.currentTrack);
  const isPlaying = useTrackStore((state) => state.isPlaying);
  const currentTime = useTrackStore((state) => state.currentTime);
  const duration = useTrackStore((state) => state.duration);
  const isBuffering = useTrackStore((state) => state.isBuffering);
  const volume = useTrackStore((state) => state.volume);
  const isMuted = useTrackStore((state) => state.isMuted);
  const currentTrackAssetId = useTrackStore(
    (state) => state.currentTrackAssetId
  );
  const setTrack = useTrackStore((state) => state.setTrack);
  const storeTogglePlayPause = useTrackStore((state) => state.togglePlayPause);
  // const storeSetIsPlaying = useTrackStore((state) => state.setIsPlaying);
  const storeSetCurrentTime = useTrackStore((state) => state.setCurrentTime);
  const storeSetDuration = useTrackStore((state) => state.setDuration);
  const storeSetIsBuffering = useTrackStore((state) => state.setIsBuffering);
  const storeHandleOnClickCard = useTrackStore(
    (state) => state.handleOnClickCard
  );
  const storeSeekTo = useTrackStore((state) => state.seekTo);

  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  // 오디오 인스턴스 및 분석기 생성
  useEffect(() => {
    const audioInstance = getAudioInstance();
    setAudio(audioInstance);
    setAnalyserNode(getAnalyser());

    // return () => {
    //   cleanupAudioInstance();
    // };
  }, []);

  // 오디오 및 플레이타임 업데이트
  useEffect(() => {
    if (audio && currentTrack) {
      if (audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
        storeSetCurrentTime(0);
        storeSetIsBuffering(true);
      }
      audio.volume = isMuted ? 0 : volume;
    } else if (audio && !currentTrack) {
      audio.pause();
      audio.src = "";
      storeSetCurrentTime(0);
      storeSetIsBuffering(false);
    }
  }, [
    audio,
    currentTrack,
    storeSetCurrentTime,
    storeSetIsBuffering,
    volume,
    isMuted,
  ]);

  // 하나의 인스턴스 트랙만 플레이이
  useEffect(() => {
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((e) => {});
    } else {
      audio.pause();
    }
  }, [audio, isPlaying, currentTrack]);

  // 선택된 트랙 변경시 트랙 정보 업데이트
  useEffect(() => {
    if (currentTrack && currentTrack.assetId === currentTrackAssetId) {
      return;
    }

    if (currentTrackAssetId && cloudinaryData && cloudinaryData.length > 0) {
      const trackToLoad = cloudinaryData.find(
        (asset) => asset.asset_id === currentTrackAssetId
      );
      if (trackToLoad) {
        const newTrackInfo: TrackInfo = {
          assetId: trackToLoad.asset_id,
          album: trackToLoad.context?.caption || "Unknown Album",
          name: trackToLoad.title || "Unknown Track",
          artworkId: trackToLoad.album_secure_url,
          url: trackToLoad.secure_url,
          producer: trackToLoad.producer || "Unknown Artist",
        };
        setTrack(newTrackInfo, false);
      } else {
        console.warn(`Track with assetId ${currentTrackAssetId} not found.`);
        setTrack(null);
      }
    }
  }, [currentTrackAssetId, cloudinaryData, setTrack]);

  useEffect(() => {
    if (
      !isLoadingCloudinary &&
      cloudinaryData &&
      cloudinaryData.length > 0 &&
      !currentTrackAssetId &&
      !currentTrack
    ) {
      const firstTrackAssetId = cloudinaryData[0].asset_id;
      if (firstTrackAssetId) {
        storeHandleOnClickCard(firstTrackAssetId);
      }
    }
  }, [
    isLoadingCloudinary,
    cloudinaryData,
    currentTrackAssetId,
    currentTrack,
    storeHandleOnClickCard,
  ]);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => storeSetCurrentTime(audio.currentTime || 0);
    const handleDurationChange = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        storeSetDuration(audio.duration);
        storeSetIsBuffering(false);
      } else {
        storeSetDuration(0);
      }
    };
    const handleEnded = () => {
      const currentIdx = cloudinaryData?.findIndex(
        (track) => track.asset_id === currentTrack?.assetId
      );

      if (
        cloudinaryData &&
        typeof currentIdx === "number" &&
        currentIdx < cloudinaryData.length - 1
      ) {
        const nextTrackData = cloudinaryData[currentIdx + 1];
        const nextTrackInfo: TrackInfo = {
          assetId: nextTrackData.asset_id,
          album: nextTrackData.context?.caption || "Unknown Album",
          name: nextTrackData.title || "Unknown Track",
          artworkId: nextTrackData.album_secure_url,
          url: nextTrackData.secure_url,
          producer: nextTrackData.producer || "Unknown Artist",
        };
        setTrack(nextTrackInfo, true);
      }
    };
    const handleVolumeChange = () => {};
    const handleError = (e: Event) => {
      storeSetIsBuffering(false);
    };
    const handleWaiting = () => {
      storeSetIsBuffering(true);
    };
    const handlePlaying = () => {
      storeSetIsBuffering(false);
    };
    const handleCanPlayThrough = () => {
      storeSetIsBuffering(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);
    audio.addEventListener("error", handleError);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [
    audio,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsBuffering,
    setTrack,
    currentTrack,
    cloudinaryData,
  ]);

  const togglePlayPause = useCallback(async () => {
    const context = getAudioContext();
    if (context && context.state === "suspended") {
      try {
        await context.resume();
        console.log(
          "AudioContext resumed on user interaction in togglePlayPause!"
        );
      } catch (e) {
        console.error("Failed to resume AudioContext in togglePlayPause:", e);
      }
    }
    storeTogglePlayPause();
  }, [storeTogglePlayPause]);

  const seek = useCallback(
    (time: number) => {
      if (audio && currentTrack) {
        const newTime = Math.max(0, Math.min(time, duration || 0));
        audio.currentTime = newTime;
        storeSeekTo(newTime);
      }
    },
    [audio, duration, currentTrack, storeSeekTo]
  );

  const playNextTrack = useCallback(() => {
    if (!cloudinaryData || cloudinaryData.length === 0) return;
    const currentIndex = cloudinaryData.findIndex(
      (track) => track.asset_id === currentTrack?.assetId
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % cloudinaryData.length;
      const nextTrackData = cloudinaryData[nextIndex];

      const nextTrackInfo: TrackInfo = {
        assetId: nextTrackData.asset_id,
        album: nextTrackData.context?.caption || "Unknown Album",
        name: nextTrackData.title || "Unknown Track",
        artworkId: nextTrackData.album_secure_url,
        url: nextTrackData.secure_url,
        producer: nextTrackData.producer || "Unknown Artist",
      };
      setTrack(nextTrackInfo, isPlaying);
    }
  }, [cloudinaryData, currentTrack, setTrack, isPlaying]);

  const playPrevTrack = useCallback(() => {
    if (!cloudinaryData || cloudinaryData.length === 0) return;
    const currentIndex = cloudinaryData.findIndex(
      (track) => track.asset_id === currentTrack?.assetId
    );
    if (currentIndex !== -1) {
      const prevIndex =
        (currentIndex - 1 + cloudinaryData.length) % cloudinaryData.length;
      const prevTrackData = cloudinaryData[prevIndex];

      const prevTrackInfo: TrackInfo = {
        assetId: prevTrackData.asset_id,
        album: prevTrackData.context?.caption || "Unknown Album",
        name: prevTrackData.title || "Unknown Track",
        artworkId: prevTrackData.album_secure_url,
        url: prevTrackData.secure_url,
        producer: prevTrackData.producer || "Unknown Artist",
      };
      setTrack(prevTrackInfo, isPlaying);
    }
  }, [cloudinaryData, currentTrack, setTrack, isPlaying]);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    volume,
    isMuted,
    currentTrackAssetId,
    isLoadingCloudinary,
    togglePlayPause,
    seek,
    nextTrack: playNextTrack,
    prevTrack: playPrevTrack,
    handleSelectTrack: storeHandleOnClickCard,
    setVolume: useTrackStore.getState().setVolume,
    toggleMute: useTrackStore.getState().toggleMute,
    analyserNode,
  };
}
