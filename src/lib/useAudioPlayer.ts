import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

const albums = [
  "Me & You",
  "Dawn",
  "Electro Boy",
  "Home",
  "Proxy (Original Mix)",
];
const trackNames = [
  "Alex Skrindo - Me & You",
  "Skylike - Dawn",
  "Kaaze - Electro Boy",
  "Jordan Schor - Home",
  "Martin Garrix - Proxy",
];
const albumArtworks = ["_1", "_2", "_3", "_4", "_5"];
const trackUrl = [
  "https://singhimalaya.github.io/Codepen/assets/music/1.mp3",
  "https://singhimalaya.github.io/Codepen/assets/music/2.mp3",
  "https://singhimalaya.github.io/Codepen/assets/music/3.mp3",
  "https://singhimalaya.github.io/Codepen/assets/music/4.mp3",
  "https://singhimalaya.github.io/Codepen/assets/music/5.mp3",
];

interface TrackInfo {
  album: string;
  name: string;
  artworkId: string;
  url: string;
}

const fetchCloudinaryImages = async () => {
  const response = await fetch("/api/cloudinary-images");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useAudioPlayer() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Start with the first track
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackInfo, setCurrentTrackInfo] = useState<TrackInfo | null>(
    null
  );
  const [isBuffering, setIsBuffering] = useState(false);
  const buffIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const {
    data: cloudinaryImages,
    error: cloudinaryError,
    isLoading: isLoadingCloudinaryImages,
  } = useQuery({
    queryKey: ["cloudinaryImages"],
    queryFn: fetchCloudinaryImages,
  });

  // 예시: 가져온 이미지 데이터 사용
  useEffect(() => {
    if (cloudinaryImages) {
      console.log("Cloudinary Images:", cloudinaryImages);
    }
    if (cloudinaryError) {
      console.error("Error fetching Cloudinary images:", cloudinaryError);
    }
  }, [cloudinaryImages, cloudinaryError]);

  // Initialize Audio element
  useEffect(() => {
    const audioInstance = new Audio();
    audioInstance.loop = false;
    setAudio(audioInstance);

    return () => {
      audioInstance.pause(); // Stop playback
      if (buffIntervalRef.current) {
        clearInterval(buffIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audio && currentTrackIndex >= 0 && currentTrackIndex < albums.length) {
      const trackInfo: TrackInfo = {
        album: albums[currentTrackIndex],
        name: trackNames[currentTrackIndex],
        artworkId: albumArtworks[currentTrackIndex],
        url: trackUrl[currentTrackIndex],
      };
      setCurrentTrackInfo(trackInfo);
      if (audio.src !== trackInfo.url) {
        audio.src = trackInfo.url;
        // Reset time/duration for new track
        setCurrentTime(0);
        setDuration(0);
        // Decide if it should autoplay when track changes (e.g., after 'next')
        // For now, it requires explicit play
      }
    } else {
      setCurrentTrackInfo(null); // Index out of bounds
    }
  }, [audio, currentTrackIndex, cloudinaryImages]); // cloudinaryImages를 의존성 배열에 추가

  // Audio Event Listeners Setup
  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Basic buffering check
      const now = Date.now();
      if (isPlaying && now - lastUpdateTimeRef.current > 1000) {
        setIsBuffering(true);
      } else {
        setIsBuffering(false);
      }
      lastUpdateTimeRef.current = now;
    };

    const handleDurationChange = () => {
      // Duration might be NaN initially or Infinity for streams
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(0); // Reset or handle invalid duration
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false); // Assume not buffering when play starts
      lastUpdateTimeRef.current = Date.now(); // Reset buffering check timer
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      if (buffIntervalRef.current) clearInterval(buffIntervalRef.current); // Clear interval on pause
    };

    const handleEnded = () => {
      // Simple auto-play next track
      if (currentTrackIndex < albums.length - 1) {
        setCurrentTrackIndex((prevIndex) => prevIndex + 1);
        // Need to explicitly call play for the next track after state update
        // This might require another useEffect or adjustment
      } else {
        setIsPlaying(false); // Stop at the end of the playlist
        setCurrentTrackIndex(0); // Optionally loop back to start or stay
        audio.currentTime = 0; // Reset time
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
    audio.addEventListener("loadedmetadata", handleDurationChange); // Also useful
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting); // Buffering started
    audio.addEventListener("playing", handlePlaying); // Buffering ended

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

    // Cleanup listeners when audio object changes or component unmounts
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
  }, [audio, isPlaying, currentTrackIndex]); // Dependencies

  // Auto-play next track after state update (triggered by 'ended' handler)
  useEffect(() => {
    if (
      audio &&
      isPlaying &&
      audio.src === currentTrackInfo?.url &&
      audio.paused
    ) {
      // If state isPlaying=true but audio paused (e.g., after track change from 'ended')
      audio.play().catch((e) => console.error("Autoplay failed:", e));
    }
  }, [audio, isPlaying, currentTrackInfo]);

  // --- Control Functions ---

  const play = useCallback(() => {
    if (audio && audio.paused) {
      audio.play().catch((e) => console.error("Error playing audio:", e));
      // State update (isPlaying, isBuffering) is handled by event listeners
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio && !audio.paused) {
      audio.pause();
      // State update (isPlaying) is handled by event listeners
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
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % albums.length); // Loop back
    // Should it auto-play? If yes, need to handle async state update and play()
    // Current setup: state update triggers useEffect -> changes src -> needs explicit play()
    // We might need to set a flag or call play() conditionally after index change.
    // For now, rely on the 'ended' handler's logic or require manual play.
    // Or, ensure play() is called if it was playing before.
    // For manual next/prev, let's reset to paused unless we add explicit logic
    // pause(); // Pause when manually changing track
  }, [isPlaying /*pause*/]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + albums.length) % albums.length
    ); // Loop back
    // Similar auto-play consideration as nextTrack
    // if (isPlaying) {
    //    pause();
    // }
  }, [isPlaying /*pause*/]);

  const seek = useCallback(
    (time: number) => {
      if (audio && !isNaN(time) && isFinite(time)) {
        // Ensure seek time is within bounds
        const newTime = Math.max(0, Math.min(time, duration));
        audio.currentTime = newTime;
        setCurrentTime(newTime); // Optimistically update state
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
    play, // Expose individual controls if needed
    pause,
    nextTrack,
    prevTrack,
    seek,
    // Expose refs if the component needs direct access (less ideal)
    // playerTrackRef,
    // albumArtRef,
    // seekBarRef,
    audioElement: audio, // Expose audio element itself (use carefully)
  };
}
