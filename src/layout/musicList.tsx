"use client";

import React, { useEffect } from "react";
import {
  useSearchPopularEdmTracks,
  useSearchSpecificAlbum,
} from "@/api/spotify";
import Horizontal from "@/component/horizontal";

export default function MusicList({ sectionTitle }: { sectionTitle: string }) {
  if (sectionTitle === "Available Now") {
    return <AvailableNow sectionTitle={sectionTitle} />;
  }

  if (sectionTitle === "Spotify Trending") {
    return <SpotifyTrending sectionTitle={sectionTitle} />;
  }
}

export function AvailableNow({ sectionTitle }: { sectionTitle: string }) {
  const {
    data: popularTracks,
    isLoading: isLoadingTracks,
    error: errorTracks,
  } = useSearchSpecificAlbum("4X0tnJQVGMc9uNSGpthvxj");

  useEffect(() => {
    if (errorTracks) {
      console.error("Error fetching popular tracks:", errorTracks);
    }
  }, [errorTracks]);

  return (
    <>
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-bold grid grid-cols-10">
          <span className="col-start-2 w-max">{sectionTitle}</span>
        </h2>
        {isLoadingTracks && <p>Loading popular tracks...</p>}
        {errorTracks && (
          <p className="text-red-500">
            Error loading tracks: {errorTracks.message}
          </p>
        )}
        {popularTracks && <Horizontal data={[popularTracks]} />}
      </div>
    </>
  );
}

export function SpotifyTrending({ sectionTitle }: { sectionTitle: string }) {
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
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-bold grid grid-cols-10">
          <span className="col-start-2 w-max">{sectionTitle}</span>
        </h2>
        {isLoadingTracks && (
          <>
            <h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="min-w-[250px] animate-pulse">
                  <div className="bg-gray-600 h-[250px] rounded-md mb-2"></div>
                  <div className="bg-gray-600 h-5 rounded-md w-3/4 mb-2"></div>
                  <div className="bg-gray-600 h-4 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          </>
        )}
        {errorTracks && (
          <p className="text-red-500">
            Error loading tracks: {errorTracks.message}
          </p>
        )}
        {popularTracks && <Horizontal data={popularTracks} />}
      </div>
    </>
  );
}
