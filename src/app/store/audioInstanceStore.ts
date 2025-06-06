import { create } from "zustand";
import {
  getAudioInstance,
  getAudioContext,
  getAnalyser,
  cleanupAudioInstance,
} from "@/shared/lib/audioInstance";

interface AudioInstanceState {
  audioInstance: HTMLAudioElement | null;
  audioContext: AudioContext | null;
  audioAnalyser: AnalyserNode | null;
  cleanAudioInstance: () => void;
}

const useAudioInstanceStore = create<AudioInstanceState>(() => {
  if (typeof window === "undefined") {
    return {
      audioInstance: null,
      audioContext: null,
      audioAnalyser: null,
      cleanAudioInstance: () => {},
    };
  }

  return {
    audioInstance: getAudioInstance(),
    audioContext: getAudioContext(),
    audioAnalyser: getAnalyser(),
    cleanAudioInstance: cleanupAudioInstance,
  };
});

export default useAudioInstanceStore;
