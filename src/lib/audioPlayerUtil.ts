import type {
  TrackInfo,
  TogglePlayPauseLogicParams,
  SeekLogicParams,
  PlayNextTrackLogicParams,
  PlayPrevTrackLogicParams,
} from "@/type/dataType";
import useCloudinaryStore from "@/store/cloudinaryStore";
import useTrackStore from "@/store/trackStore";
import useAudioInstanceStore from "@/store/audioInstanceStore";
import { isEmpty } from "lodash";

export const togglePlayPauseLogic = async ({
  audioContext,
  storeTogglePlayPause,
}: TogglePlayPauseLogicParams) => {
  if (!audioContext || audioContext.state === "suspended") {
    throw new Error("AudioContext is suspended");
  }

  try {
    await audioContext.resume();
  } catch (e) {
    throw new Error("Failed to resume AudioContext");
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
  if (!audio || !currentTrack) throw new Error("Audio or currentTrack is null");

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
  if (isEmpty(cloudinaryData)) throw new Error("Cloudinary data is empty");

  const currentIndex = cloudinaryData.findIndex(
    (track) => track.asset_id === currentTrack?.assetId
  );

  if (currentIndex === -1) throw new Error("Current track not found");

  const nextIndex = (currentIndex + 1) % cloudinaryData.length;
  const nextTrackData = cloudinaryData[nextIndex];

  const nextTrackInfo: TrackInfo = {
    assetId: nextTrackData.asset_id,
    album: nextTrackData.context?.caption || "Unknown Album",
    name: nextTrackData.title || "Unknown Track",
    artworkId: nextTrackData.album_secure_url,
    url: nextTrackData.secure_url,
    producer: nextTrackData.producer || "Unknown Artist",
  };
  setTrack(nextTrackInfo, isPlaying);
};

export const playPrevTrackLogic = ({
  cloudinaryData,
  currentTrack,
  setTrack,
  isPlaying,
}: PlayPrevTrackLogicParams) => {
  if (isEmpty(cloudinaryData)) throw new Error("Cloudinary data is empty");

  const currentIndex = cloudinaryData.findIndex(
    (track) => track.asset_id === currentTrack?.assetId
  );

  if (currentIndex === -1) throw new Error("Current track not found");

  const prevIndex =
    (currentIndex - 1 + cloudinaryData.length) % cloudinaryData.length;
  const prevTrackData = cloudinaryData[prevIndex];

  const prevTrackInfo: TrackInfo = {
    assetId: prevTrackData.asset_id,
    album: prevTrackData.context?.caption || "Unknown Album",
    name: prevTrackData.title || "Unknown Track",
    artworkId: prevTrackData.album_secure_url,
    url: prevTrackData.secure_url,
    producer: prevTrackData.producer || "Unknown Artist",
  };
  setTrack(prevTrackInfo, isPlaying);
};

export const useTrackStoreVariables = () => {
  const currentTrack = useTrackStore((state) => state.currentTrack);
  const isPlaying = useTrackStore((state) => state.isPlaying);
  const currentTime = useTrackStore((state) => state.currentTime);
  const duration = useTrackStore((state) => state.duration);
  const isBuffering = useTrackStore((state) => state.isBuffering);
  const volume = useTrackStore((state) => state.volume);
  const isMuted = useTrackStore((state) => state.isMuted);
  const currentTrackAssetId = useTrackStore(
    (state) => state.currentTrackAssetId
  );
  const setTrack = useTrackStore((state) => state.setTrack);
  const storeTogglePlayPause = useTrackStore((state) => state.togglePlayPause);
  const storeSetVolume = useTrackStore((state) => state.setVolume);
  const storeSetCurrentTime = useTrackStore((state) => state.setCurrentTime);
  const storeSetDuration = useTrackStore((state) => state.setDuration);
  const storeSetIsBuffering = useTrackStore((state) => state.setIsBuffering);
  const storeHandleOnClickCard = useTrackStore(
    (state) => state.handleOnClickCard
  );
  const storeToggleMute = useTrackStore((state) => state.toggleMute);
  const storeSeekTo = useTrackStore((state) => state.seekTo);

  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  const audio = useAudioInstanceStore((state) => state.audioInstance);
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
    currentTrackAssetId,
    setTrack,
    storeTogglePlayPause,
    storeSetVolume,
    storeSetCurrentTime,
    storeSetDuration,
    storeSetIsBuffering,
    storeHandleOnClickCard,
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
