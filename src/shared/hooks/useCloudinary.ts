"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import type { CloudinaryResource } from "@/shared/types/dataType";
import { fetchCloudinary } from "@/shared/lib/util";

export function useCloudinary() {
  const setCloudinaryData = useCloudinaryStore(
    (state) => state.setCloudinaryData
  );
  const setCloudinaryError = useCloudinaryStore(
    (state) => state.setCloudinaryError
  );
  const setIsLoadingCloudinary = useCloudinaryStore(
    (state) => state.setIsLoadingCloudinary
  );
  const { data, error, isLoading } = useQuery<CloudinaryResource[], Error>({
    queryKey: ["cloudinary"],
    queryFn: fetchCloudinary,
    staleTime: 1000 * 60 * 10, // 10분 동안 fresh 상태 유지
  });

  useEffect(() => {
    setIsLoadingCloudinary(isLoading);
  }, [isLoading, setIsLoadingCloudinary]);

  useEffect(() => {
    if (data) {
      console.log("Cloudinary data loaded via hook:", data.length);
      setCloudinaryData(data);
    }
  }, [data, setCloudinaryData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Cloudinary via hook:", error);
      setCloudinaryError(error);
    }
  }, [error, setCloudinaryError]);

  return { data, error, isLoading };
}
