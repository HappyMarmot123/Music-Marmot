"use client";

import React, { useEffect } from "react";
import Horizontal from "@/shared/components/horizontal";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import useRecentPlayStore from "@/app/store/recentPlayStore";
import { CloudinaryResource } from "@/shared/types/dataType";

export default function MusicList() {
  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const error = useCloudinaryStore((state) => state.cloudinaryError);
  const loading = useCloudinaryStore((state) => state.isLoadingCloudinary);
  const recentAssetIds = useRecentPlayStore((state) => state.recentAssetIds);

  useEffect(() => {
    if (error) {
      console.error("Error fetching Cloudinary data for recent list:", error);
    }
  }, [error]);

  const recentTracks = recentAssetIds
    .map((assetId) =>
      cloudinaryData.find((track) => track.asset_id === assetId)
    )
    .filter((track): track is CloudinaryResource => track !== undefined);

  return (
    <>
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-bold grid grid-cols-10">
          <span className="col-start-2 w-max">Recently Played</span>
        </h2>
        {loading && <p>Loading recently played tracks...</p>}
        {error && (
          <p className="text-red-500">
            Error loading recently played tracks: {error.message}
          </p>
        )}
        {!loading && recentTracks.length > 0 && (
          <Horizontal data={recentTracks} swiperId="recent-list" />
        )}
        {!loading && recentAssetIds.length === 0 && (
          <p className="col-start-2 mt-4">최근 재생한 음악이 없습니다.</p>
        )}
      </div>
    </>
  );
}
