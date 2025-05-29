import { useAuth } from "@/provider/authProvider";
import {
  AudioPlayerState,
  CloudinaryResource,
  likeType,
  TrackInfo,
  zustandPersistSet,
} from "@/type/dataType";
import { SetStateAction } from "react";
import { Dispatch, MouseEvent, RefObject } from "react";
import clsx from "clsx";
import useRecentPlayStore from "@/store/recentPlayStore";

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const minutesStr = String(minutes).padStart(2, "0");
  const secsStr = String(secs).padStart(2, "0");
  return `${minutesStr}:${secsStr}`;
}

export function replaceKeyName(resource: CloudinaryResource) {
  return {
    ...resource,
    title: resource.context?.caption || null,
    producer: resource.context?.alt || null,
  };
}

export const fetchCloudinary = async (): Promise<CloudinaryResource[]> => {
  const response = await fetch("/api/cloudinary");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const handleOnLike = async (
  trackAssetId: string,
  userId: string | undefined,
  currentIsLiked: boolean,
  setIsLiked: (updateFn: (prevLiked: likeType[]) => likeType[]) => void
): Promise<void> => {
  try {
    const response = await fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assetId: trackAssetId,
        userId: userId,
        isLiked: !currentIsLiked,
      }),
    });

    if (response) {
      setIsLiked((prevLiked) => {
        if (currentIsLiked) {
          return prevLiked.filter((item) => item.asset_id !== trackAssetId);
        } else {
          return [...prevLiked, { asset_id: trackAssetId, isLike: true }];
        }
      });
    }
    if (!response.ok) {
      throw new Error("좋아요 처리 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error liking track:", error);
  }
};

export const handleSeek = (
  event: MouseEvent<HTMLDivElement>,
  seekBarContainerRef: RefObject<HTMLDivElement | null>,
  duration: number | undefined,
  seek: (time: number) => void
) => {
  if (!seekBarContainerRef.current || !duration) return;
  const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
  const seekRatio = (event.clientX - seekBarRect.left) / seekBarRect.width;
  const seekTime = duration * seekRatio;
  seek(seekTime);
};

export const handleSeekMouseMove = (
  event: MouseEvent<HTMLDivElement>,
  seekBarContainerRef: RefObject<HTMLDivElement | null>,
  duration: number | undefined,
  setSeekHoverTime: Dispatch<SetStateAction<number | null>>,
  setSeekHoverPosition: Dispatch<SetStateAction<number>>
) => {
  if (!seekBarContainerRef.current || !duration) return;
  const seekBarRect = seekBarContainerRef.current.getBoundingClientRect();
  const hoverRatio = Math.max(
    0,
    Math.min(1, (event.clientX - seekBarRect.left) / seekBarRect.width)
  );
  const hoverTime = duration * hoverRatio;
  const hoverPosition = hoverRatio * seekBarRect.width;
  setSeekHoverTime(hoverTime);
  setSeekHoverPosition(hoverPosition);
};

export const handleSeekMouseOut = (
  setSeekHoverTime: Dispatch<SetStateAction<number | null>>,
  setSeekHoverPosition: Dispatch<SetStateAction<number>>
) => {
  setSeekHoverTime(null);
  setSeekHoverPosition(0);
};

export const handleSeekInteraction = (
  event: MouseEvent<HTMLDivElement>,
  seekBarContainerRef: RefObject<HTMLDivElement | null>,
  duration: number | undefined,
  seek: (time: number) => void,
  setSeekHoverTime: Dispatch<SetStateAction<number | null>>,
  setSeekHoverPosition: Dispatch<SetStateAction<number>>
) => {
  if (!seekBarContainerRef.current || duration === 0) return;

  const rect = seekBarContainerRef.current.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
  const time = percentage * (duration as number);

  const isClick = event.type === "click";
  const isMouseMove = event.type === "mousemove";

  if (isClick) {
    seek(time);
  } else {
    setSeekHoverTime(time);
    setSeekHoverPosition(offsetX);
  }
};

// className
// 	영역, 위치
// 	폰트, 색
// 	박스
//  기타
export const albumArtClassName = (isPlaying: boolean, isBuffering: boolean) => {
  return clsx(
    "absolute w-[92px] h-[92px] top-[-22px] ml-[32px]",
    "bg-gray-300",
    "rounded-full overflow-hidden hover:scale-105 shadow-[0_0_0_10px_#fff]",
    "cursor-pointer transform rotate-0 transition-all duration-300 ease-[ease]",
    isPlaying && [
      "active top-[-32px]",
      "shadow-[0_0_0_4px_#fff7f7,_0_30px_50px_-15px_#afb7c1]",
    ],
    isBuffering && [
      "buffering",
      "[&>img]:opacity-25",
      "[&>img.active]:opacity-80",
      "[&>img.active]:blur-sm",
      "[&_#buffer-box]:opacity-100",
    ]
  );
};

export const listModalRootClassName = () => {
  return clsx(
    "grid grid-cols-4 fixed inset-0 m-auto w-[90%] h-[90%]",
    "bg-[#483544aa] text-white",
    "border border-white/50 rounded-2xl shadow-[0_0.5px_0_1px_rgba(255,255,255,0.2)_inset,0_1px_0_0_rgba(255,255,255,0.6)_inset,0_4px_16px_rgba(0,0,0,0.1)]   overflow-hidden",
    "z-40"
  );
};

export const CLAMP_VOLUME = (volume: number) =>
  Math.max(0, Math.min(1, volume));

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
    currentTrackAssetId: track?.assetId ?? null,
  }));
};

export const partializeFunction = (state: AudioPlayerState) => ({
  volume: state.volume,
  isMuted: state.isMuted,
  currentTrack: state.currentTrack,
  currentTrackAssetId: state.currentTrackAssetId,
});

export const mergeFunction = (
  persistedState: unknown | AudioPlayerState,
  currentState: AudioPlayerState
) => ({
  ...currentState,
  ...(persistedState as object),
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
});
