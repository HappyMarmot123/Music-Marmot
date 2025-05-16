import { CloudinaryResource, likeType } from "@/type/dataType";
import { SetStateAction } from "react";

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
    id: resource.asset_id,
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
  trackId: string,
  setIsLiked: (isLiked: likeType[]) => void
): SetStateAction<unknown> {
  if (isLiked.length === 0) {
    return setIsLiked([{ id: trackId, isLike: true }]);
  }

  const dummy = [...isLiked];
  const clickIdx = dummy.findIndex((item) => item.id === trackId);
  const exist = dummy[clickIdx];

  if (clickIdx !== -1) {
    dummy[clickIdx] = { ...exist, isLike: !exist.isLike };
  } else {
    dummy.push({ id: trackId, isLike: true });
  }
  return setIsLiked(dummy);
}
