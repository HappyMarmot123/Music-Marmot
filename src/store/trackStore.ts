import { create, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AudioPlayerState } from "@/type/dataType";
import { CLAMP_VOLUME, mergeFunction } from "@/lib/util";
import { setTrackFunction, partializeFunction } from "@/lib/audioPlayerUtil";

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

// useTrackStore.subscribe((state) => {
//   console.log("상태 변경 감지 currentTrack:", state.currentTrack);
//   console.log("상태 변경 감지 isPlaying:", state.isPlaying);
// });

export default useTrackStore;
