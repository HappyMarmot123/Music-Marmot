import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CloudinaryResource } from "@/type/dataType";
import {
  getAnalyser,
  getAudioContext,
  getAudioInstance,
  cleanupAudioInstance,
} from "@/lib/audioInstance";

interface AppState {
  audioInstance: HTMLAudioElement | null;
  audioAnalyser: AnalyserNode | null;
  audioContext: AudioContext | null;
  cleanAudioInstance: () => void;
}

const useStore = create<AppState>()(
  persist(
    (set) => ({
      audioInstance: getAudioInstance(),
      audioAnalyser: getAnalyser(),
      audioContext: getAudioContext(),
      cleanAudioInstance: () => cleanupAudioInstance(),
    }),
    {
      name: "audio-instance-store",
    }
  )
);

export default useStore;
