"use client";

import React, { useEffect } from "react";
import Horizontal from "@/component/horizontal";
import useStore from "@/store/cloudinaryStore";

export default function MusicList() {
  const data = useStore((state) => state.cloudinaryData);
  const error = useStore((state) => state.cloudinaryError);
  const loading = useStore((state) => state.isLoadingCloudinary);

  useEffect(() => {
    if (error) {
      console.error("Error fetching popular tracks:", error);
    }
  }, [error]);

  return (
    <>
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-bold grid grid-cols-10">
          <span className="col-start-2 w-max">Available Now</span>
        </h2>
        {loading && <p>Loading popular tracks...</p>}
        {error && (
          <p className="text-red-500">Error loading tracks: {error.message}</p>
        )}
        {data && <Horizontal data={data} />}
      </div>
    </>
  );
}
