import { useState, useEffect, useRef, useCallback } from "react";
import type { TrackInfo } from "@/type/dataType";
import useStore from "@/store/cloudinaryStore";
import useTrackStore from "@/store/trackStore";
import isEmpty from "lodash/isEmpty";

export function useAudioPlayer() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackInfo, setCurrentTrackInfo] = useState<TrackInfo | null>(
    null
  );
  const [isBuffering, setIsBuffering] = useState(false);
  const buffIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const cloudinary = useStore((state) => state.cloudinaryData);
  const cloudinaryError = useStore((state) => state.cloudinaryError);
  const isLoadingCloudinary = useStore((state) => state.isLoadingCloudinary);

  const currentTrackAssetId = useTrackStore(
    (state) => state.currentTrackAssetId
  );
  const handleOnClickCard = useTrackStore((state) => state.handleOnClickCard);
  /* Initialize Audio element */
  useEffect(() => {
    const audioInstance = new Audio();
    audioInstance.loop = false;
    setAudio(audioInstance);

    return () => {
      audioInstance.pause();
      if (buffIntervalRef.current) {
        clearInterval(buffIntervalRef.current);
      }
    };
  }, []);

  /* Cloudinary */
  useEffect(() => {
    if (cloudinary) {
      console.log("Cloudinary from Zustand store:", cloudinary);
    }
    if (cloudinaryError) {
      console.error(
        "Error fetching Cloudinary from Zustand store:",
        cloudinaryError
      );
    }

    if (
      audio &&
      cloudinary &&
      cloudinary.length > 0 &&
      currentTrackIndex >= 0 &&
      currentTrackIndex < cloudinary.length
    ) {
      const currentResource = cloudinary[currentTrackIndex];
      const trackInfo: TrackInfo = {
        album: currentResource.context?.caption || "Unknown Album",
        name: currentResource.title || "Unknown Track",
        artworkId: currentResource.album_secure_url,
        url: currentResource.secure_url,
        producer: currentResource.producer || "Unknown Artist",
      };
      setCurrentTrackInfo(trackInfo);
      if (audio.src !== trackInfo.url) {
        audio.src = trackInfo.url;
        setCurrentTime(0);
        setDuration(0);
      }
    } else if (isEmpty(cloudinary)) {
      setCurrentTrackInfo(null); // 데이터는 로드되었지만 트랙이 없는 경우
    } else if (
      !isLoadingCloudinary &&
      (!cloudinary || cloudinary.length === 0)
    ) {
      // 로딩이 끝났고, 이미지가 없거나 로드에 실패한 경우 (오류는 cloudinaryError로 처리)
      setCurrentTrackInfo(null);
    }
  }, [
    audio,
    currentTrackIndex,
    cloudinary,
    cloudinaryError,
    isLoadingCloudinary,
  ]);

  /* Handle Audio */
  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const now = Date.now();
      if (isPlaying && now - lastUpdateTimeRef.current > 1000) {
        setIsBuffering(true);
      } else {
        setIsBuffering(false);
      }
      lastUpdateTimeRef.current = now;
    };

    const handleDurationChange = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(0);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      lastUpdateTimeRef.current = Date.now();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      if (buffIntervalRef.current) clearInterval(buffIntervalRef.current);
    };

    const handleEnded = () => {
      if (cloudinary && currentTrackIndex < cloudinary.length - 1) {
        setCurrentTrackIndex((prevIndex) => prevIndex + 1);
        handlePlay();
      } else {
        setIsPlaying(false);
        setCurrentTrackIndex(0);
        if (audio) audio.currentTime = 0;
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    // Buffering check interval (more robust) - might be redundant with 'waiting'/'playing'
    // Consider if this specific interval logic is still needed from the original code
    /*
    if (buffIntervalRef.current) clearInterval(buffIntervalRef.current);
    buffIntervalRef.current = setInterval(() => {
        const now = Date.now();
        if (isPlaying && now - lastUpdateTimeRef.current > 1000) {
             setIsBuffering(true);
        } else {
            setIsBuffering(false);
        }
        // bTime logic was removed
    }, 500); // Check every 500ms
    */

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      if (buffIntervalRef.current) clearInterval(buffIntervalRef.current);
    };
  }, [audio, isPlaying, currentTrackIndex, cloudinary]);

  /* Play Audio */
  useEffect(() => {
    if (
      audio &&
      isPlaying &&
      audio.src === currentTrackInfo?.url &&
      audio.paused
    ) {
      audio.play().catch((e) => console.error("Autoplay failed:", e));
    }
  }, [audio, isPlaying, currentTrackInfo]);

  /* handle track by assetId *handleOnClickCard()* function */
  useEffect(() => {
    if (currentTrackAssetId) {
      cloudinary?.forEach((asset, idx) => {
        if (asset.asset_id === currentTrackAssetId) {
          setCurrentTrackIndex(idx);
        }
      });
      handleOnClickCard(null); // reset currentTrackAssetId
    }
  }, [currentTrackAssetId]);

  // --- Control Functions ---
  const play = useCallback(() => {
    if (audio && audio.paused) {
      audio.play().catch((e) => console.error("Error playing audio:", e));
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, [audio]);

  const togglePlayPause = useCallback(() => {
    if (audio) {
      if (audio.paused) {
        play();
      } else {
        pause();
      }
    }
  }, [audio, play, pause]);

  const nextTrack = useCallback(() => {
    if (!cloudinary || cloudinary.length === 0) return;
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % cloudinary.length);
    // 자동 재생 로직은 현재 'ended' 핸들러 및 isPlaying 상태에 의존.
    // 수동으로 다음/이전 트랙 시 재생 상태를 유지하고 싶다면 추가 로직 필요
    // 예: if (isPlaying) audio?.play();
  }, [cloudinary]);

  const prevTrack = useCallback(() => {
    if (!cloudinary || cloudinary.length === 0) return;
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + cloudinary.length) % cloudinary.length
    );
    // 예: if (isPlaying) audio?.play();
  }, [cloudinary]);

  const seek = useCallback(
    (time: number) => {
      if (audio && !isNaN(time) && isFinite(time)) {
        const newTime = Math.max(0, Math.min(time, duration));
        audio.currentTime = newTime;
        setCurrentTime(newTime);
      }
    },
    [audio, duration]
  );

  return {
    audio,
    isPlaying,
    setIsPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    currentTrackInfo,
    isBuffering,
    setIsBuffering,
    togglePlayPause,
    play,
    pause,
    nextTrack,
    prevTrack,
    seek,
    audioElement: audio,
  };
}
