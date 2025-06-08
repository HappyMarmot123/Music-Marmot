import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AudioPlayerState,
  TrackInfo,
  zustandPersistSet,
} from "@/shared/types/dataType";
import { setTrackFunction } from "@/shared/lib/audioPlayerUtil";
import { CLAMP_VOLUME, mergeFunction } from "@/shared/lib/util";

const partializeFunction = (state: AudioPlayerState) => ({
  volume: state.volume,
  isMuted: state.isMuted,
  currentTrack: state.currentTrack,
});

const useTrackStore = create<AudioPlayerState>()(
  persist(
    (set: zustandPersistSet) => ({
      currentTrack: {
        assetId: null,
        album: "Unknown Album",
        name: "Unknown Track",
        producer: "Unknown Producer",
        artworkId: null,
        url: null,
      },
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isBuffering: false,
      volume: 0.7,
      isMuted: false,

      setTrack: (track: TrackInfo, playImmediately = false) =>
        setTrackFunction(track, playImmediately, set),

      togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),

      setCurrentTime: (time: number) => set({ currentTime: time }),

      setDuration: (duration: number) => set({ duration: duration }),

      setIsBuffering: (buffering: boolean) => set({ isBuffering: buffering }),

      setVolume: (volume: number) =>
        set({ volume: CLAMP_VOLUME(volume), isMuted: volume === 0 }),

      toggleMute: () =>
        set((state) => ({
          isMuted: !state.isMuted,
          volume: state.isMuted ? state.volume || 0.5 : 0,
        })),

      seekTo: (time: number) =>
        set((state) => ({
          currentTime: Math.min(time, state.duration || 0),
        })),
    }),
    {
      name: "track-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: partializeFunction,
      merge: mergeFunction,
    }
  )
);

export default useTrackStore;
