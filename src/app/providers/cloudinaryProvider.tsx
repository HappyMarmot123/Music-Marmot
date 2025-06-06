"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/app/store/cloudinaryStore";
import type {
  CloudinaryResource,
  CloudinaryStoreState,
} from "@/shared/types/dataType";
import { fetchCloudinary } from "@/shared/lib/util";

interface CloudinaryContextType {
  data: CloudinaryResource[] | undefined;
  error: Error | null;
  isLoading: boolean;
}

const CloudinaryContext = createContext<CloudinaryContextType | null>(null);

export function CloudinaryProvider({ children }: { children: ReactNode }) {
  const setCloudinaryData = useStore(
    (state: CloudinaryStoreState) => state.setCloudinaryData
  );
  const setCloudinaryError = useStore(
    (state: CloudinaryStoreState) => state.setCloudinaryError
  );
  const setIsLoadingCloudinary = useStore(
    (state: CloudinaryStoreState) => state.setIsLoadingCloudinary
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
      console.log("Cloudinary data loaded via provider:", data.length);
      setCloudinaryData(data);
    }
  }, [data, setCloudinaryData]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Cloudinary via provider:", error);
      setCloudinaryError(error);
    }
  }, [error, setCloudinaryError]);

  return (
    <CloudinaryContext.Provider value={{ data, error, isLoading }}>
      {children}
    </CloudinaryContext.Provider>
  );
}

export function useCloudinary() {
  const context = useContext(CloudinaryContext);
  if (!context) {
    throw new Error("useCloudinary must be used within a CloudinaryProvider");
  }
  return context;
}
