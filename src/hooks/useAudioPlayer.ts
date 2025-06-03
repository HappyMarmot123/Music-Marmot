"use client";

import { useEffect, useCallback, useRef } from "react";
import type { TrackInfo } from "@/type/dataType";
import { isNumber, isEmpty } from "lodash";
import {
  togglePlayPauseLogic,
  seekLogic,
  playNextTrackLogic,
  playPrevTrackLogic,
  useTrackStoreVariables,
  setFindNewTrack,
} from "@/lib/audioPlayerUtil";
import { setupAudioEventListeners } from "@/lib/audioEventManager";

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
    setTrack,
    storeTogglePlayPause,
    storeSetVolume,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsBuffering,
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
    const isTrackChanged = currentTrack && audio.src !== currentTrack.url;
    if (isTrackChanged) {
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
      audio.play().catch((e) => {
        console.error("Error playing audio:", e);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // 첫 접근시 트랙 세팅
  useEffect(() => {
    if (isEmpty(cloudinaryData) || currentTrack) return;
    const firstTrackAssetId = cloudinaryData[0].asset_id;
    setFindNewTrack(cloudinaryData, firstTrackAssetId, setTrack);
  }, [cloudinaryData]);

  // 오디오 이벤트 리스너 설정
  useEffect(() => {
    const actions = {
      storeSetCurrentTime,
      storeSetDuration,
      storeSetIsBuffering,
      setTrack,
    };
    const getCloudinaryData = () => cloudinaryData;
    const getCurrentTrack = () => currentTrack;

    const cleanup = setupAudioEventListeners(
      audio,
      actions,
      getCloudinaryData,
      getCurrentTrack,
      isSeekingRef
    );

    return cleanup;
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!currentTrack && !isPlaying) return;
    if (!currentTrack && isPlaying) {
      storeTogglePlayPause();
      return;
    }
    if (!audioContext) {
      console.warn("AudioContext is not available for togglePlayPause");
      storeTogglePlayPause();
      return;
    }
    await togglePlayPauseLogic({ audioContext, storeTogglePlayPause });
  }, [audioContext, storeTogglePlayPause, currentTrack, isPlaying]);

  const seek = useCallback(
    (time: number) => {
      const currentAudioDuration = audio?.duration || 0;
      if (!currentTrack || !audio) return;
      seekLogic({
        audio,
        currentTrack,
        duration: currentAudioDuration,
        time,
        storeSeekTo,
        isSeekingRef,
      });
    },
    [audio, currentTrack, storeSeekTo, isSeekingRef]
  );

  const playNextTrack = useCallback(() => {
    if (isEmpty(cloudinaryData)) return;
    playNextTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  }, [cloudinaryData, currentTrack, setTrack, isPlaying]);

  const playPrevTrack = useCallback(() => {
    if (isEmpty(cloudinaryData)) return;
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
    isLoadingCloudinary,
    togglePlayPause,
    seek,
    nextTrack: playNextTrack,
    prevTrack: playPrevTrack,
    handleSelectTrack: (assetId: string) => {
      if (isEmpty(cloudinaryData)) return;
      setFindNewTrack(cloudinaryData, assetId, setTrack);
    },
    setVolume: storeSetVolume,
    toggleMute: storeToggleMute,
    analyserNode,
  };
}
