"use client";

import { CloudinaryResource, TrackObjectFull } from "@/type/dataType";
import Image from "next/image";
import useStore from "@/store/zustandStore";

const Card = ({ card }: { card: TrackObjectFull | CloudinaryResource }) => {
  const { handleOnClickCard } = useStore();
  const isTrack = "album" in card;

  const artistName = isTrack
    ? (card as TrackObjectFull).artists &&
      (card as TrackObjectFull).artists.length > 0
      ? (card as TrackObjectFull).artists[0].name
      : "Unknown Artist"
    : (card as CloudinaryResource).producer || "Unknown Producer";

  const imageUrl = isTrack
    ? (card as TrackObjectFull).album.images &&
      (card as TrackObjectFull).album.images.length > 0
      ? (card as TrackObjectFull).album.images[0].url
      : undefined
    : (card as CloudinaryResource).album_secure_url;

  const itemName = isTrack
    ? (card as TrackObjectFull).name
    : (card as CloudinaryResource).title;

  return (
    <button
      onClick={() => {
        if (!isTrack) {
          handleOnClickCard(card.asset_id);
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
          fill
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
