"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
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

type AudioPlayerLogicReturnType = ReturnType<typeof useAudioPlayerLogic>;

const AudioPlayerContext = createContext<
  AudioPlayerLogicReturnType | undefined
>(undefined);

function useAudioPlayerLogic() {
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
  }, [currentTrack, audio, storeSetCurrentTime]);

  // 볼륨 설정
  useEffect(() => {
    if (isNumber(volume)) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audio]);

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
    const hasAlreadyTrackInStore = isEmpty(cloudinaryData) || currentTrack;
    if (hasAlreadyTrackInStore) return;

    if (cloudinaryData && cloudinaryData.length > 0) {
      const firstTrackAssetId = cloudinaryData[0].asset_id;
      setFindNewTrack(cloudinaryData, firstTrackAssetId, setTrack);
    }
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
    // if (!currentTrack && isPlaying) {
    //   storeTogglePlayPause();
    //   return;
    // }
    await togglePlayPauseLogic({ audioContext, storeTogglePlayPause });
  }, [currentTrack, isPlaying]);

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
    [currentTrack, isSeekingRef]
  );

  const playNextTrack = useCallback(() => {
    playNextTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  }, [currentTrack, isPlaying]);

  const playPrevTrack = useCallback(() => {
    playPrevTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
  }, [currentTrack, isPlaying]);

  const handleSelectTrack = useCallback((assetId: string) => {
    setFindNewTrack(cloudinaryData, assetId, setTrack);
  }, []);

  // 컴포넌트 언마운트 시 오디오 인스턴스 정리
  useEffect(() => {
    return () => {
      if (cleanAudioInstance) {
        cleanAudioInstance();
      }
    };
  }, [cleanAudioInstance]);

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
    handleSelectTrack,
    setVolume: storeSetVolume,
    toggleMute: storeToggleMute,
    analyserNode,
    audioPlayer: audio,
  };
}

export const AudioPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioPlayerData = useAudioPlayerLogic();
  return (
    <AudioPlayerContext.Provider value={audioPlayerData}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerLogicReturnType => {
  const context = useContext(AudioPlayerContext);
  if (!context)
    throw new Error("useAudioPlayer must be used within a AudioPlayerProvider");
  return context;
};
