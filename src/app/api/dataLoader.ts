import {
  CloudinaryResource,
  CloudinaryResourceMap,
} from "@/shared/types/dataType";
import cloudinaryClient from "./cloudinary/cloudinaryClient";

export async function DataLoader(): Promise<CloudinaryResourceMap> {
  try {
    const cloudinaryData = await cloudinaryClient();

    return new Map(
      cloudinaryData.map((resource) => [resource.asset_id, resource])
    );
  } catch (error) {
    console.error("Error in DataLoader:", error);
    return new Map();
  }
}
