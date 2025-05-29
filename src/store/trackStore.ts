import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AudioPlayerState } from "@/type/dataType";
import {
  CLAMP_VOLUME,
  mergeFunction,
  partializeFunction,
  setTrackFunction,
} from "@/lib/util";

const useTrackStore = create<AudioPlayerState>()(
  persist(
    (set, _get) => ({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isBuffering: false,
      volume: 1,
      isMuted: false,
      currentTrackAssetId: null,

      setTrack: (track, playImmediately = false) => {
        setTrackFunction(track, playImmediately, set);
      },
      togglePlayPause: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration: duration }),
      setIsBuffering: (buffering) => set({ isBuffering: buffering }),
      setVolume: (volume) => {
        set(() => {
          const newVolume = CLAMP_VOLUME(volume);
          return { volume: newVolume, isMuted: newVolume === 0 };
        });
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => partializeFunction(state),
      merge: (persistedState, currentState) => {
        return mergeFunction(persistedState, currentState);
      },
    }
  )
);

export default useTrackStore;
