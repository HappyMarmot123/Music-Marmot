"use client";

import React, { useEffect } from "react";
import { useSearchPopularEdmTracks } from "@/api/spotify";

const SpotifyTestPage = () => {
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
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Spotify EDM Data</h1>

      {/* Popular Tracks Section */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          Popular EDM Tracks (Search)
        </h2>
        {isLoadingTracks && <p>Loading popular tracks...</p>}
        {errorTracks && (
          <p className="text-red-500">
            Error loading tracks: {errorTracks.message}
          </p>
        )}
        {popularTracks && (
          <ul className="space-y-2">
            {popularTracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center rounded border p-3 shadow-sm"
              >
                {/* Album Image */}
                {track.album.images?.[0]?.url && (
                  <img
                    src={track.album.images[0].url}
                    alt={`${track.album.name} Album Art`}
                    className="mr-4 h-16 w-16 rounded object-cover"
                  />
                )}
                {/* Track Info */}
                <div className="flex-grow">
                  <h3 className="font-semibold">{track.name}</h3>
                  <p className="text-sm text-gray-600">
                    {track.artists.map((artist) => artist.name).join(", ")} -
                    {", "}
                    {track.album.name}
                  </p>
                </div>
                {/* Play Button */}
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  className="ml-4 flex-shrink-0 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Play
                </a>
              </li>
            ))}
            {popularTracks.length === 0 && !isLoadingTracks && (
              <p>No popular EDM tracks found.</p>
            )}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SpotifyTestPage;
