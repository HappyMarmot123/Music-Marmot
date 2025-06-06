"use client";

import { useCloudinary } from "@/shared/hooks/useCloudinary";

export function DataLoader() {
  try {
    useCloudinary();
    return null;
  } catch (error) {
    console.error("Error loading Cloudinary data:", error);
  }
}
