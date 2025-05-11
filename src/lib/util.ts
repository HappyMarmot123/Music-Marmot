import { CloudinaryResource } from "@/type/dataType";

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
