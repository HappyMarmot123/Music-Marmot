import type {
  TrackInfo,
  TogglePlayPauseLogicParams,
  SeekLogicParams,
  PlayNextTrackLogicParams,
  PlayPrevTrackLogicParams,
  AudioPlayerState,
  zustandPersistSet,
  CloudinaryData,
} from "@/type/dataType";
import useCloudinaryStore from "@/store/cloudinaryStore";
import useTrackStore from "@/store/trackStore";
import useAudioInstanceStore from "@/store/audioInstanceStore";
import { isEmpty } from "lodash";
import useRecentPlayStore from "@/store/recentPlayStore";

export const togglePlayPauseLogic = async ({
  audioContext,
  storeTogglePlayPause,
}: TogglePlayPauseLogicParams) => {
  if (!audioContext || audioContext.state === "suspended") {
    console.error("AudioContext is suspended");
    return;
  }

  try {
    await audioContext.resume();
  } catch (e) {
    console.error("Failed to resume AudioContext", e);
  } finally {
    storeTogglePlayPause();
  }
};

export const seekLogic = ({
  audio,
  currentTrack,
  duration,
  time,
  storeSeekTo,
  isSeekingRef,
}: SeekLogicParams) => {
  if (!audio || !currentTrack) {
    console.error("Audio or currentTrack is null");
    return;
  }

  isSeekingRef.current = true;
  const newTime = Math.max(0, Math.min(time, duration || 0));
  audio.currentTime = newTime;
  storeSeekTo(newTime);
};

export const playNextTrackLogic = ({
  cloudinaryData,
  currentTrack,
  setTrack,
  isPlaying,
}: PlayNextTrackLogicParams) => {
  if (isEmpty(cloudinaryData)) {
    console.error("Cloudinary data is empty");
    return;
  }

  const currentIndex = cloudinaryData.findIndex(
    (track) => track.asset_id === currentTrack?.assetId
  );

  if (currentIndex === -1) {
    console.error("Current track not found");
    return;
  }

  const nextIndex = (currentIndex + 1) % cloudinaryData.length;
  const nextTrackData = cloudinaryData[nextIndex];
  setFindNewTrack(cloudinaryData, nextTrackData.asset_id, setTrack, isPlaying);
};

export const playPrevTrackLogic = ({
  cloudinaryData,
  currentTrack,
  setTrack,
  isPlaying,
}: PlayPrevTrackLogicParams) => {
  if (isEmpty(cloudinaryData)) {
    console.error("Cloudinary data is empty");
    return;
  }

  const currentIndex = cloudinaryData.findIndex(
    (track) => track.asset_id === currentTrack?.assetId
  );

  if (currentIndex === -1) {
    console.error("Current track not found");
    return;
  }

  const prevIndex =
    (currentIndex - 1 + cloudinaryData.length) % cloudinaryData.length;
  const prevTrackData = cloudinaryData[prevIndex];
  setFindNewTrack(cloudinaryData, prevTrackData.asset_id, setTrack, isPlaying);
};

export const setFindNewTrack = (
  cloudinaryData: CloudinaryData[],
  assetId: string,
  setTrack: (track: TrackInfo | null, playImmediately: boolean) => void,
  isPlaying?: boolean
) => {
  if (isEmpty(cloudinaryData)) {
    console.error("Cloudinary data is empty");
    return;
  }

  const findTrackInData = cloudinaryData.find(
    (asset) => asset.asset_id === assetId
  );

  if (!findTrackInData) {
    console.error("Track not found");
    return;
  }

  const newTrackInfo: TrackInfo = {
    assetId: findTrackInData.asset_id,
    album: findTrackInData.context?.caption || "Unknown Album",
    name: findTrackInData.title || "Unknown Track",
    artworkId: findTrackInData.album_secure_url || null,
    url: findTrackInData.secure_url || "",
    producer: findTrackInData.producer || "Unknown Artist",
  };
  setTrack(newTrackInfo, isPlaying || false);
};

export const setTrackFunction = (
  track: TrackInfo | null,
  playImmediately: boolean,
  set: zustandPersistSet
) => {
  if (track && track.assetId) {
    useRecentPlayStore.getState().addRecentAssetId(track.assetId);
  }
  set((state: AudioPlayerState) => ({
    currentTrack: track,
    currentTime: 0,
    isPlaying: !!track && playImmediately,
    isBuffering: !!track,
  }));
};

export const partializeFunction = (state: AudioPlayerState) => ({
  volume: state.volume,
  isMuted: state.isMuted,
  currentTrack: state.currentTrack,
});

export const useTrackStoreVariables = () => {
  const currentTrack = useTrackStore((state) => state.currentTrack);
  const isPlaying = useTrackStore((state) => state.isPlaying);
  console.log("🚀 ~ useTrackStoreVariables ~ isPlaying:", isPlaying);
  const currentTime = useTrackStore((state) => state.currentTime);
  const duration = useTrackStore((state) => state.duration);
  const isBuffering = useTrackStore((state) => state.isBuffering);
  const volume = useTrackStore((state) => state.volume);
  const isMuted = useTrackStore((state) => state.isMuted);
  const setTrack = useTrackStore((state) => state.setTrack);
  const storeTogglePlayPause = useTrackStore((state) => state.togglePlayPause);
  const storeSetVolume = useTrackStore((state) => state.setVolume);
  const storeSetCurrentTime = useTrackStore((state) => state.setCurrentTime);
  const storeSetDuration = useTrackStore((state) => state.setDuration);
  const storeSetIsBuffering = useTrackStore((state) => state.setIsBuffering);
  const storeToggleMute = useTrackStore((state) => state.toggleMute);
  const storeSeekTo = useTrackStore((state) => state.seekTo);

  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  const audio = useAudioInstanceStore(
    (state) => state.audioInstance
  ) as HTMLAudioElement;
  const analyserNode = useAudioInstanceStore((state) => state.audioAnalyser);
  const audioContext = useAudioInstanceStore((state) => state.audioContext);
  const cleanAudioInstance = useAudioInstanceStore(
    (state) => state.cleanAudioInstance
  );

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    volume,
    isMuted,
    setTrack,
    storeTogglePlayPause,
    storeSetVolume,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsBuffering,
    storeToggleMute,
    storeSeekTo,
    cloudinaryData,
    isLoadingCloudinary,
    audio,
    analyserNode,
    audioContext,
    cleanAudioInstance,
  };
};
