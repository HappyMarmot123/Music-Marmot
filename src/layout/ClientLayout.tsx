"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/store/zustandStore";
import type { CloudinaryResource } from "@/type/dataType";
import { fetchCloudinary } from "@/lib/util";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setCloudinaryData, setCloudinaryError, setIsLoadingCloudinary } =
    useStore();

  const { data, error, isLoading } = useQuery<CloudinaryResource[], Error>({
    queryKey: ["cloudinary"],
    queryFn: fetchCloudinary,
    staleTime: 1000 * 60 * 10, // 10분 동안 fresh 상태 유지
  });

  useEffect(() => {
    setIsLoadingCloudinary(isLoading);

    if (data) {
      console.log("Cloudinary data loaded in layout:", data.length);
      setCloudinaryData(data);
    }

    if (error) {
      console.error("Error fetching Cloudinary in layout:", error);
      setCloudinaryError(error);
    }
  }, [
    data,
    error,
    isLoading,
    setCloudinaryData,
    setCloudinaryError,
    setIsLoadingCloudinary,
  ]);

  return <>{children}</>;
};

export default ClientLayout;
