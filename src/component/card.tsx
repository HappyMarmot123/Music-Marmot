"use client";

import { CloudinaryResource } from "@/type/dataType";
import Image from "next/image";
import useTrackStore from "@/store/trackStore";
import { useToggle } from "@/store/toggleStore";
import useCloudinaryStore from "@/store/cloudinaryStore";
import { TrackInfo } from "@/type/dataType";

const Card = ({ card }: { card: CloudinaryResource }) => {
  const { openToggle } = useToggle();
  const setTrack = useTrackStore((state) => state.setTrack);
  const currentTrack = useTrackStore((state) => state.currentTrack);
  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);

  const artistName = card.producer || "Unknown Producer";

  const imageUrl = card.album_secure_url;

  const itemName = card.title;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        const newAssetId = card.asset_id;
        if (newAssetId === currentTrack?.assetId) {
          openToggle();
        } else {
          const findTrackInData = cloudinaryData.find(
            (asset) => asset.asset_id === newAssetId
          );
          if (findTrackInData) {
            const newTrackInfo: TrackInfo = {
              assetId: findTrackInData.asset_id,
              album: findTrackInData.context?.caption || "Unknown Album",
              name: findTrackInData.title || "Unknown Track",
              artworkId: findTrackInData.album_secure_url,
              url: findTrackInData.secure_url,
              producer: findTrackInData.producer || "Unknown Artist",
            };
            setTrack(newTrackInfo, true);
          }
          openToggle();
        }
      }}
      rel="noopener noreferrer"
      className="group relative h-48 w-48 md:h-64 md:w-64 lg:h-72 lg:w-72 p-3 md:p-4 overflow-hidden bg-neutral-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between flex-shrink-0"
    >
      {/* 앨범 아트 표시 */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${itemName} album art`}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          loading="lazy"
          width={256}
          height={256}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center">
          <span className="text-neutral-500 text-sm">No Image</span>
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full pt-2 pb-3 px-1">
        <h1 className="text-base md:text-lg lg:text-xl font-bold text-white uppercase leading-tight tracking-tight line-clamp-2 mb-1">
          {itemName}
        </h1>
        <p className="text-xs md:text-sm text-neutral-300 font-medium uppercase leading-snug tracking-tight mt-auto line-clamp-1">
          {artistName}
        </p>
      </div>
    </button>
  );
};

export default Card;
