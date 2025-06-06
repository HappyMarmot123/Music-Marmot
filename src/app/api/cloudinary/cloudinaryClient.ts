import type { CloudinaryResource } from "@/shared/types/dataType";
import axios from "axios";

export default async function cloudinaryClient(): Promise<
  CloudinaryResource[]
> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const { data } = await axios.get(`${baseUrl}/api/cloudinary`);
    return data;
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return [];
  }
}
