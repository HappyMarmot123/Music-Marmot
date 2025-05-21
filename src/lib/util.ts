import { CloudinaryResource, likeType } from "@/type/dataType";
import { SetStateAction } from "react";
import { Dispatch, MouseEvent, RefObject } from "react";

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

export function handleOnLike(
  isLiked: likeType[],
  trackAssetId: string,
  setIsLiked: (isLiked: likeType[]) => void
): SetStateAction<unknown> {
  if (isLiked.length === 0) {
    return setIsLiked([{ asset_id: trackAssetId, isLike: true }]);
  }

  const dummy = [...isLiked];
  const clickIdx = dummy.findIndex((item) => item.asset_id === trackAssetId);
  const exist = dummy[clickIdx];

  if (clickIdx !== -1) {
    dummy[clickIdx] = { ...exist, isLike: !exist.isLike };
  } else {
    dummy.push({ asset_id: trackAssetId, isLike: true });
  }
  return setIsLiked(dummy);
}

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
