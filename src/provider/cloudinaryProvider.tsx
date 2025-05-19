"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/store/cloudinaryStore";
import type { CloudinaryResource } from "@/type/dataType";
import { fetchCloudinary } from "@/lib/util";

export function CloudinaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setCloudinaryData = useStore((state) => state.setCloudinaryData);
  const setCloudinaryError = useStore((state) => state.setCloudinaryError);
  const setIsLoadingCloudinary = useStore(
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
      console.log("Cloudinary data loaded in layout:", data.length);
      setCloudinaryData(data);
    }
  }, [data, setCloudinaryData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Cloudinary in layout:", error);
      setCloudinaryError(error);
    }
  }, [error, setCloudinaryError]);

  return <>{children}</>;
}
