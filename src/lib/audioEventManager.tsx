import type {
  CloudinaryResource,
  AudioStoreActions,
  TrackInfo,
} from "@/type/dataType";
import { isEmpty } from "lodash";
import { playNextTrackLogic, useTrackStoreVariables } from "./audioPlayerUtil";
import useTrackStore from "@/store/trackStore";
import useStore from "@/store/cloudinaryStore";

export const setupAudioEventListeners = (
  audio: HTMLAudioElement,
  actions: AudioStoreActions,
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
    const { currentTrack, setTrack, isPlaying } = useTrackStore.getState();
    const { cloudinaryData } = useStore.getState();
    playNextTrackLogic({ cloudinaryData, currentTrack, setTrack, isPlaying });
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

  //   const handleCanPlayThrough = () => {
  //     if (isSeekingRef.current) {
  //       isSeekingRef.current = false;
  //     }
  //     actions.storeSetIsBuffering(false);
  //   };

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
  //   audio.addEventListener("canplaythrough", handleCanPlayThrough);
  audio.addEventListener("seeked", handleSeeked);

  return () => {
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("durationchange", handleDurationChange);
    audio.removeEventListener("loadedmetadata", handleDurationChange);
    audio.removeEventListener("ended", handleEnded);
    audio.removeEventListener("error", handleError);
    audio.removeEventListener("waiting", handleWaiting);
    audio.removeEventListener("playing", handlePlaying);
    // audio.removeEventListener("canplaythrough", handleCanPlayThrough);
    audio.removeEventListener("seeked", handleSeeked);
  };
};
