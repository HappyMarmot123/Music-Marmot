"use client";

import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import type { TrackInfo } from "@/type/dataType";
import { isNumber, isEmpty } from "lodash";
import {
  playNextTrackLogic,
  playPrevTrackLogic,
  seekLogic,
  togglePlayPauseLogic,
  useTrackStoreVariables,
} from "@/lib/audioPlayerUtil";

export function useAudioPlayer() {
  const isSeekingRef = useRef(false);

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
    storeTogglePlayPause,
    storeSetVolume,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsBuffering,
    storeSetCurrentTrackAssetId,
    storeSeekTo,
    storeToggleMute,
    cloudinaryData,
    isLoadingCloudinary,
    audio,
    analyserNode,
    audioContext,
    cleanAudioInstance,
  } = useTrackStoreVariables();

  // 오디오, 현재트랙 정보 업데이트
  useEffect(() => {
    if (!currentTrack) return;
    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      storeSetCurrentTime(0);
    }
  }, [currentTrack]);

  // 볼륨 설정
  useEffect(() => {
    if (isNumber(volume)) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 트랙플레이 컨트롤
  useEffect(() => {
    if (isPlaying) {
      audio.play().catch((e) => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // 첫 접근시시 트랙 세팅
  useEffect(() => {
    if (isEmpty(cloudinaryData) || currentTrackAssetId) return;
    const firstTrackAssetId = cloudinaryData[0].asset_id;
    storeSetCurrentTrackAssetId(firstTrackAssetId);
  }, [cloudinaryData, currentTrackAssetId]);

  // 트랙정보 세팅
  useEffect(() => {
    if (isEmpty(cloudinaryData)) return;

    if (currentTrack?.assetId !== currentTrackAssetId) {
      const findTrackInData = cloudinaryData.find(
        (asset) => asset.asset_id === currentTrackAssetId
      );

      if (!findTrackInData) {
        console.error("Track not found in cloudinaryData");
        setTrack(null);
        return;
      }

      storeSetCurrentTrackAssetId(findTrackInData!.asset_id);
      const newTrackInfo: TrackInfo = {
        assetId: findTrackInData.asset_id,
        album: findTrackInData.context?.caption,
        name: findTrackInData.title,
        artworkId: findTrackInData.album_secure_url,
        url: findTrackInData.secure_url,
        producer: findTrackInData.producer || "Unknown Artist",
      };
      setTrack(newTrackInfo, false);
    }
  }, [cloudinaryData, currentTrackAssetId]);

  useEffect(() => {
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

      if (currentIdx === -1) {
        console.error("Track not found in cloudinaryData");
        setTrack(null);
        return;
      }

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
    };
    const handleError = (e: Event) => {
      storeSetIsBuffering(false);
    };
    const handleWaiting = () => {
      if (!isSeekingRef.current) {
        storeSetIsBuffering(true);
      }
    };
    const handlePlaying = () => {
      if (isSeekingRef.current) {
        isSeekingRef.current = false;
      }
      storeSetIsBuffering(false);
    };
    const handleCanPlayThrough = () => {
      if (isSeekingRef.current) {
        isSeekingRef.current = false;
      }
      storeSetIsBuffering(false);
    };
    // TODO: 오디오 타임 업데이트 트래킹 (자동 로딩 피하기 위함함)
    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("seeked", handleSeeked);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("seeked", handleSeeked);
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
    await togglePlayPauseLogic({ audioContext, storeTogglePlayPause });
  }, [audioContext, storeTogglePlayPause]);

  const seek = useCallback(
    (time: number) => {
      seekLogic({
        audio,
        currentTrack,
        duration,
        time,
        storeSeekTo,
        isSeekingRef,
      });
    },
    [audio, currentTrack, duration, storeSeekTo]
  );

  const playNextTrack = useCallback(() => {
    playNextTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  }, [cloudinaryData, currentTrack, setTrack, isPlaying]);

  const playPrevTrack = useCallback(() => {
    playPrevTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
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
    handleSelectTrack: storeSetCurrentTrackAssetId,
    setVolume: storeSetVolume,
    toggleMute: storeToggleMute,
    analyserNode,
  };
}
