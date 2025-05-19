import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackInfo } from "@/type/dataType";

interface AudioPlayerState {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  currentTrackAssetId: string | null;

  // Actions
  setTrack: (track: TrackInfo | null, playImmediately?: boolean) => void;
  togglePlayPause: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsBuffering: (buffering: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  handleOnClickCard: (paramAssetId: string | null) => void;
  seekTo: (time: number) => void;
}

const useTrackStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isBuffering: false,
      volume: 1,
      isMuted: false,
      currentTrackAssetId: null,

      setTrack: (track, playImmediately = false) => {
        set({
          currentTrack: track,
          currentTime: 0,
          isPlaying: track ? playImmediately : false,
          isBuffering: track ? true : false,
        });
      },
      togglePlayPause: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },
      setIsPlaying: (playing) => {},
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration: duration }),
      setIsBuffering: (buffering) => set({ isBuffering: buffering }),
      setVolume: (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set({ volume: newVolume, isMuted: newVolume === 0 });
      },
      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },
      handleOnClickCard: (paramAssetId) => {
        set({ currentTrackAssetId: paramAssetId });
      },
      seekTo: (time) => {
        set((state) => {
          const newTime = Math.max(0, Math.min(time, state.duration));
          return { currentTime: newTime };
        });
      },
    }),
    {
      name: "track-store",
    }
  )
);

export default useTrackStore;
