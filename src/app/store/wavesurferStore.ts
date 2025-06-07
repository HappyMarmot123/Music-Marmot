import { create } from "zustand";
import WaveSurfer from "wavesurfer.js";

interface WaveSurferStore {
  wavesurfer: WaveSurfer | null;
  isLoading: boolean;
  initialize: (
    container: HTMLElement,
    audio: HTMLAudioElement,
    onSeek: (progress: number) => void
  ) => void;
  loadTrack: (url: string) => void;
  destroy: () => void;
}

const useWaveSurferStore = create<WaveSurferStore>((set, get) => ({
  wavesurfer: null,
  isLoading: false,
  initialize: (container, audio, onSeek) => {
    const { wavesurfer } = get();
    // Re-initialization guard
    if (wavesurfer) {
      if (wavesurfer.getWrapper() !== container) {
        wavesurfer.setOptions({ container });
      }
      return;
    }

    set({ isLoading: true });
    const newWaveSurfer = WaveSurfer.create({
      container,
      media: audio,
      waveColor: "rgb(253, 109, 148)",
      progressColor: "rgb(255, 152, 162)",
      height: 30,
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      cursorWidth: 0,
      interact: true, // Allow user interaction
    });

    newWaveSurfer.on("loading", (percent) => {
      if (percent < 100) {
        set({ isLoading: true });
      }
    });

    newWaveSurfer.on("ready", () => {
      set({ isLoading: false });
    });

    newWaveSurfer.on("error", (err) => {
      console.error("Wavesurfer error:", err);
      set({ isLoading: false });
    });

    // Sync app state on user seek via click
    newWaveSurfer.on("click", onSeek);

    set({ wavesurfer: newWaveSurfer });
  },
  loadTrack: (url) => {
    const { wavesurfer } = get();
    if (wavesurfer) {
      set({ isLoading: true });
      wavesurfer.load(url);
    }
  },
  destroy: () => {
    const { wavesurfer } = get();
    if (wavesurfer) {
      wavesurfer.destroy();
      set({ wavesurfer: null });
    }
  },
}));

export default useWaveSurferStore;
