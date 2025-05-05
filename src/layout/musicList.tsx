"use client";

import React, { useEffect } from "react";
import { useSearchPopularEdmTracks } from "@/api/spotify";
import Horizontal from "@/component/horizontal";

export default function MusicList({ sectionTitle }: { sectionTitle: string }) {
  const {
    data: popularTracks,
    isLoading: isLoadingTracks,
    error: errorTracks,
  } = useSearchPopularEdmTracks(20);

  useEffect(() => {
    if (errorTracks) {
      console.error("Error fetching popular tracks:", errorTracks);
    }
  }, [errorTracks]);

  return (
    <>
      {isLoadingTracks && <p>Loading popular tracks...</p>}
      {errorTracks && (
        <p className="text-red-500">
          Error loading tracks: {errorTracks.message}
        </p>
      )}
      {popularTracks && (
        <Horizontal sectionTitle={sectionTitle} data={popularTracks} />
      )}
    </>
  );
}
