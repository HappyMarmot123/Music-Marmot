import type {
  CloudinaryData,
  AudioStoreActions,
  TrackInfo,
} from "@/type/dataType";
import { isEmpty } from "lodash";

export const setupAudioEventListeners = (
  audio: HTMLAudioElement,
  actions: AudioStoreActions,
  getCloudinaryData: () => CloudinaryData[],
  getCurrentTrack: () => TrackInfo | null,
  isSeekingRef: React.MutableRefObject<boolean>
) => {
  const handleTimeUpdate = () =>
    actions.storeSetCurrentTime(audio.currentTime || 0);
  const handleDurationChange = () => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
      actions.storeSetDuration(audio.duration);
      actions.storeSetIsBuffering(false);
    } else {
      actions.storeSetDuration(0);
    }
  };

  const handleEnded = () => {
    const cloudinaryData = getCloudinaryData();
    const currentTrack = getCurrentTrack();
    if (isEmpty(cloudinaryData) || !currentTrack) {
      actions.setTrack(null);
      return;
    }

    const currentIdx = cloudinaryData.findIndex(
      (track) => track.asset_id === currentTrack.assetId
    );

    if (currentIdx === -1) {
      console.error("Track not found in cloudinaryData on ended");
      actions.setTrack(null);
      return;
    }

    const nextTrackIndex = (currentIdx + 1) % cloudinaryData.length;
    const nextTrackData = cloudinaryData[nextTrackIndex];

    if (!nextTrackData) {
      console.error("Next track data not found");
      actions.setTrack(null);
      return;
    }

    const nextTrackInfo: TrackInfo = {
      assetId: nextTrackData.asset_id,
      album: nextTrackData.context?.caption || "Unknown Album",
      name: nextTrackData.title || "Unknown Track",
      artworkId: nextTrackData.album_secure_url || null,
      url: nextTrackData.secure_url || "",
      producer: nextTrackData.producer || "Unknown Artist",
    };
    actions.setTrack(nextTrackInfo, true);
  };

  const handleError = (e: Event) => {
    console.error("Audio Error:", e);
    actions.storeSetIsBuffering(false);
  };

  const handleWaiting = () => {
    if (!isSeekingRef.current) {
      actions.storeSetIsBuffering(true);
    }
  };

  const handlePlaying = () => {
    if (isSeekingRef.current) {
      isSeekingRef.current = false;
    }
    actions.storeSetIsBuffering(false);
  };

  const handleCanPlayThrough = () => {
    if (isSeekingRef.current) {
      isSeekingRef.current = false;
    }
    actions.storeSetIsBuffering(false);
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
  };

  audio.addEventListener("timeupdate", handleTimeUpdate);
  audio.addEventListener("durationchange", handleDurationChange);
  audio.addEventListener("loadedmetadata", handleDurationChange);
  audio.addEventListener("ended", handleEnded);
  audio.addEventListener("error", handleError);
  audio.addEventListener("waiting", handleWaiting);
  audio.addEventListener("playing", handlePlaying);
  audio.addEventListener("canplaythrough", handleCanPlayThrough);
  audio.addEventListener("seeked", handleSeeked);

  return () => {
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("durationchange", handleDurationChange);
    audio.removeEventListener("loadedmetadata", handleDurationChange);
    audio.removeEventListener("ended", handleEnded);
    audio.removeEventListener("error", handleError);
    audio.removeEventListener("waiting", handleWaiting);
    audio.removeEventListener("playing", handlePlaying);
    audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    audio.removeEventListener("seeked", handleSeeked);
  };
};
