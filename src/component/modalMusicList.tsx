import {
  CloudinaryResource,
  ModalMusicListProps,
  likeType,
} from "@/type/dataType";
import { Heart } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { SetStateAction } from "react";

export default function ModalMusicList({
  loading,
  trackList,
  isLiked,
  setIsLiked,
}: ModalMusicListProps) {
  function handleOnLike(trackId: string): SetStateAction<unknown> {
    if (isLiked.length === 0) {
      return setIsLiked([{ id: trackId, isLike: true }]);
    }

    const dummy = [...isLiked];
    const clickIdx = dummy.findIndex((item) => item.id === trackId);
    const exist = dummy[clickIdx];

    if (clickIdx !== -1) {
      dummy[clickIdx] = { ...exist, isLike: !exist.isLike };
    } else {
      dummy.push({ id: trackId, isLike: true });
    }
    return setIsLiked(dummy);
  }

  const showLoading = loading !== false;
  const showTrackList = loading === false && trackList.length > 0;
  const showEmptyResult = loading === false && trackList.length === 0;

  return (
    <>
      {showLoading && (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg bg-white/5"
            >
              <div className="w-12 h-12 rounded-md mr-4 bg-white/10"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
              </div>
              <div className="w-16 h-3 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      )}
      {showTrackList && (
        <>
          {trackList.map((track) => (
            <div
              key={track.id}
              className="flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <Image
                src={track.album_secure_url as string}
                alt={track.title as string}
                width={48}
                height={48}
                className="rounded-md mr-4"
              />

              <div className="flex-1">
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.producer}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-1" onClick={() => handleOnLike(track.id)}>
                  <Heart
                    className={clsx(
                      "w-4 h-4 text-gray-400 hover:text-pink-500 transition-colors",
                      isLiked.some(
                        (item) => item.id === track.id && item.isLike
                      ) && "text-pink-500 fill-pink-500/30"
                    )}
                  />
                </button>
                <span className="text-gray-400 text-sm">128</span>
              </div>
            </div>
          ))}
        </>
      )}
      {showEmptyResult && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
        </div>
      )}
    </>
  );
}
