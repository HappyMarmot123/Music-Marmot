"use client";

import { useEffect, useCallback, useState } from "react";
import type { TrackInfo } from "@/type/dataType";
import useCloudinaryStore from "@/store/cloudinaryStore";
import useTrackStore from "@/store/trackStore";
import { cleanupAudioInstance, getAudioInstance } from "./audioManager";

export function useAudioPlayer() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    volume,
    isMuted,
    currentTrackAssetId,
    setTrack,
    togglePlayPause: storeTogglePlayPause,
    setIsPlaying: storeSetIsPlaying,
    setCurrentTime: storeSetCurrentTime,
    setDuration: storeSetDuration,
    setIsBuffering: storeSetIsBuffering,
    handleOnClickCard: storeHandleOnClickCard,
    seekTo: storeSeekTo,
  } = useTrackStore();

  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  useEffect(() => {
    const audioInstance = getAudioInstance();
    setAudio(audioInstance);

    return () => {
      cleanupAudioInstance();
    };
  }, []);

  useEffect(() => {
    if (audio && currentTrack) {
      if (audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
        storeSetCurrentTime(0);
        storeSetDuration(0);
        storeSetIsBuffering(true);
      }
      audio.volume = isMuted ? 0 : volume;
    } else if (audio && !currentTrack) {
      audio.pause();
      audio.src = "";
      storeSetCurrentTime(0);
      storeSetDuration(0);
      storeSetIsPlaying(false);
      storeSetIsBuffering(false);
    }
  }, [
    audio,
    currentTrack,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsPlaying,
    storeSetIsBuffering,
    volume,
    isMuted,
  ]);

  useEffect(() => {
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error("Error playing audio:", e);
        storeSetIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audio, isPlaying, currentTrack, storeSetIsPlaying]);

  useEffect(() => {
    if (currentTrackAssetId && cloudinaryData && cloudinaryData.length > 0) {
      const trackToLoad = cloudinaryData.find(
        (asset) => asset.asset_id === currentTrackAssetId
      );
      if (trackToLoad) {
        const newTrackInfo: TrackInfo = {
          id: trackToLoad.id,
          album: trackToLoad.context?.caption || "Unknown Album",
          name: trackToLoad.title || "Unknown Track",
          artworkId: trackToLoad.album_secure_url,
          url: trackToLoad.secure_url,
          producer: trackToLoad.producer || "Unknown Artist",
        };
        setTrack(newTrackInfo, useTrackStore.getState().isPlaying);
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
    const handlePlay = () => {
      storeSetIsPlaying(true);
      storeSetIsBuffering(false);
    };
    const handlePause = () => {
      storeSetIsPlaying(false);
    };
    const handleEnded = () => {
      storeSetIsPlaying(false);
      const currentIdx = cloudinaryData?.findIndex(
        (track) => track.id === currentTrack?.id
      );

      if (
        cloudinaryData &&
        typeof currentIdx === "number" &&
        currentIdx < cloudinaryData.length - 1
      ) {
        const nextTrackData = cloudinaryData[currentIdx + 1];
        const nextTrackInfo: TrackInfo = {
          id: nextTrackData.id,
          album: nextTrackData.context?.caption || "Unknown Album",
          name: nextTrackData.title || "Unknown Track",
          artworkId: nextTrackData.album_secure_url,
          url: nextTrackData.secure_url,
          producer: nextTrackData.producer || "Unknown Artist",
        };
        setTrack(nextTrackInfo, true);
      } else {
        storeSetIsPlaying(false);
      }
    };
    const handleVolumeChange = () => {
      // Zustand 스토어의 volume/isMuted와 audio.volume/muted를 동기화할 필요가 있다면 여기에 로직 추가
      // 예: useTrackStore.getState().setVolume(audio.volume);
      // 예: useTrackStore.getState().toggleMute(audio.muted);
      // 현재는 setVolume, toggleMute 액션이 스토어 상태만 변경하고, 그 상태가 audio.volume/muted에 반영됨.
    };
    const handleError = (e: Event) => {
      console.error("Audio Error:", audio.error, e);
      storeSetIsPlaying(false);
      storeSetIsBuffering(false);
      // 필요시 사용자에게 오류 메시지 표시
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("volumechange", handleVolumeChange);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("volumechange", handleVolumeChange);
      audio.removeEventListener("error", handleError);
    };
  }, [
    audio,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsPlaying,
    storeSetIsBuffering,
    setTrack,
    currentTrack,
    cloudinaryData,
  ]);

  const togglePlayPause = useCallback(() => {
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
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % cloudinaryData.length;
      const nextTrackData = cloudinaryData[nextIndex];
      const nextTrackInfo: TrackInfo = {
        id: nextTrackData.id,
        album: nextTrackData.context?.caption || "Unknown Album",
        name: nextTrackData.title || "Unknown Track",
        artworkId: nextTrackData.album_secure_url,
        url: nextTrackData.secure_url,
        producer: nextTrackData.producer || "Unknown Artist",
      };
      setTrack(nextTrackInfo, true);
    }
    // else if (cloudinaryData.length > 0) {
    //   const firstTrackData = cloudinaryData[0];
    //   const firstTrackInfo: TrackInfo = {
    //     id: firstTrackData.id,
    //     album: firstTrackData.context?.caption || "Unknown Album",
    //     name: firstTrackData.title || "Unknown Track",
    //     artworkId: firstTrackData.album_secure_url,
    //     url: firstTrackData.secure_url,
    //     producer: firstTrackData.producer || "Unknown Artist",
    //   };
    //   setTrack(firstTrackInfo, true);
    // }
  }, [cloudinaryData, currentTrack, setTrack]);

  const playPrevTrack = useCallback(() => {
    if (!cloudinaryData || cloudinaryData.length === 0) return;
    const currentIndex = cloudinaryData.findIndex(
      (track) => track.id === currentTrack?.id
    );
    if (currentIndex !== -1) {
      const prevIndex =
        (currentIndex - 1 + cloudinaryData.length) % cloudinaryData.length;
      const prevTrackData = cloudinaryData[prevIndex];
      const prevTrackInfo: TrackInfo = {
        id: prevTrackData.id,
        album: prevTrackData.context?.caption || "Unknown Album",
        name: prevTrackData.title || "Unknown Track",
        artworkId: prevTrackData.album_secure_url,
        url: prevTrackData.secure_url,
        producer: prevTrackData.producer || "Unknown Artist",
      };
      setTrack(prevTrackInfo, true);
    }
    // else if (cloudinaryData.length > 0) {
    //   const lastTrackData = cloudinaryData[cloudinaryData.length - 1];
    //   const lastTrackInfo: TrackInfo = {
    //     id: lastTrackData.id,
    //     album: lastTrackData.context?.caption || "Unknown Album",
    //     name: lastTrackData.title || "Unknown Track",
    //     artworkId: lastTrackData.album_secure_url,
    //     url: lastTrackData.secure_url,
    //     producer: lastTrackData.producer || "Unknown Artist",
    //   };
    //   setTrack(lastTrackInfo, true);
    // }
  }, [cloudinaryData, currentTrack, setTrack]);

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
  };
}
