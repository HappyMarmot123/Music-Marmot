import useWaveSurferStore from "@/app/store/wavesurferStore";

/**
 * Loads a new track into the global WaveSurfer instance.
 * @param url The URL of the audio track to load.
 */
export default function loadTrackInWaveSurfer(url: string) {
  // We use getState() here because this is intended to be called from a non-React context
  // or a context where using the hook is not ideal (like deep in a provider's effect).
  const { loadTrack } = useWaveSurferStore.getState();
  loadTrack(url);
}
