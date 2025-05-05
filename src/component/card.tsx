"use client";

import { AlbumObjectFull, TrackObjectFull } from "@/type/dataType";

const Card = ({ card }: { card: TrackObjectFull | AlbumObjectFull }) => {
  // 'album' 속성 존재 여부로 타입을 확인합니다.
  const isTrack = "album" in card;

  const artists = card.artists;
  const artistName =
    artists && artists.length > 0 ? artists[0].name : "Unknown Artist";

  // 타입에 따라 이미지 배열을 가져옵니다.
  const images = isTrack ? card.album.images : card.images;
  const imageUrl = images && images.length > 0 ? images[0].url : undefined;

  // 공통 속성들을 가져옵니다.
  const itemName = card.name;
  const spotifyUrl = card.external_urls.spotify;

  return (
    <button
      onClick={() => {
        if (isTrack) {
          window.open(spotifyUrl, "_blank");
        }
      }}
      rel="noopener noreferrer"
      className="group relative h-48 w-48 md:h-64 md:w-64 lg:h-72 lg:w-72 p-3 md:p-4 overflow-hidden bg-neutral-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between flex-shrink-0"
    >
      {/* 앨범 아트 표시 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${itemName} album art`}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center">
          <span className="text-neutral-500 text-sm">No Image</span>
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full pt-2 pb-3 px-1">
        {/* 아이템 이름 */}
        <h1 className="text-base md:text-lg lg:text-xl font-bold text-white uppercase leading-tight tracking-tight line-clamp-2 mb-1">
          {itemName}
        </h1>
        {/* 아티스트 이름 */}
        <p className="text-xs md:text-sm text-neutral-300 font-medium uppercase leading-snug tracking-tight mt-auto line-clamp-1">
          {artistName}
        </p>
      </div>
    </button>
  );
};

export default Card;
