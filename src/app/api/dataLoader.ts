import cloudinaryClient from "./cloudinary/cloudinaryClient";
import { CloudinaryResource } from "@/shared/types/dataType";

export async function DataLoader(): Promise<CloudinaryResource[]> {
  try {
    const cloudinaryData = await cloudinaryClient();
    return cloudinaryData || [];
  } catch (error) {
    console.error("Error loading Cloudinary data:", error);
    return [];
  }
}
