"use client";

import { TrackObjectFull } from "@/type/dataType";

const Card = ({ card }: { card: TrackObjectFull }) => {
  // 첫 번째 아티스트 이름 가져오기 (아티스트가 없을 경우 대비)
  const artistName =
    card.artists && card.artists.length > 0
      ? card.artists[0].name
      : "Unknown Artist";
  // 첫 번째 앨범 이미지 URL 가져오기 (이미지가 없을 경우 대비)
  const imageUrl =
    card.album.images && card.album.images.length > 0
      ? card.album.images[0].url
      : undefined;

  return (
    <div
      // key prop은 부모 컴포넌트(Horizontal)에서 설정하므로 여기서는 제거합니다.
      className="group relative h-48 w-48 md:h-64 md:w-64 lg:h-72 lg:w-72 p-3 md:p-4 overflow-hidden bg-neutral-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between flex-shrink-0"
    >
      {/* 앨범 아트 표시 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${card.name} album art`}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          // 이미지 로딩 성능 개선
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center">
          <span className="text-neutral-500 text-sm">No Image</span>
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full pt-2 pb-3 px-1">
        {/* 트랙 이름 */}
        <h1 className="text-base md:text-lg lg:text-xl font-bold text-white uppercase leading-tight tracking-tight line-clamp-2 mb-1">
          {card.name}
        </h1>
        {/* 아티스트 이름 */}
        <p className="text-xs md:text-sm text-neutral-300 font-medium uppercase leading-snug tracking-tight mt-auto line-clamp-1">
          {artistName}
        </p>
      </div>
    </div>
  );
};

export default Card;
