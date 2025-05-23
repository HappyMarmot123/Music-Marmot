"use client";

import React, { useEffect } from "react";
import Horizontal from "@/component/horizontal";
import useStore from "@/store/cloudinaryStore";
import useRecentPlayStore from "@/store/recentPlayStore";
import { CloudinaryResource } from "@/type/dataType";

export default function MusicList() {
  const data: CloudinaryResource[] | null = useStore(
    (state) => state.cloudinaryData
  );
  const error = useStore((state) => state.cloudinaryError);
  const loading = useStore((state) => state.isLoadingCloudinary);
  const recentAssetIds: string[] = useRecentPlayStore(
    (state) => state.recentAssetIds
  );

  useEffect(() => {
    if (error) {
      console.error("Error fetching Cloudinary data for recent list:", error);
    }
  }, [error]);

  const recentTracksData = React.useMemo(() => {
    if (!data || !recentAssetIds || recentAssetIds.length === 0) return [];

    const filteredData = data.filter((item) =>
      recentAssetIds.includes(item.asset_id)
    );

    return recentAssetIds
      .map((id) => filteredData.find((item) => item.asset_id === id))
      .filter((item) => item !== undefined);
  }, [data, recentAssetIds]);

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
        {!loading && recentTracksData.length > 0 && (
          <Horizontal data={recentTracksData} swiperId="recent-list-swiper" />
        )}
        {!loading && recentAssetIds.length === 0 && (
          <p className="col-start-2 mt-4">최근 재생한 음악이 없습니다.</p>
        )}
      </div>
    </>
  );
}
