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
        const existIndex = prevLiked.findIndex(
          (item) => item.asset_id === trackAssetId
        );
        if (existIndex !== -1) {
          const updatedLiked = [...prevLiked];
          updatedLiked[existIndex] = {
            ...updatedLiked[existIndex],
            isLike: !currentIsLiked,
          };
          return updatedLiked;
        } else {
          return [
            ...prevLiked,
            { asset_id: trackAssetId, isLike: !currentIsLiked },
          ];
        }
      });
    }
    if (!response.ok) {
      throw new Error("좋아요 처리 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error liking track:", error);
    alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
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
