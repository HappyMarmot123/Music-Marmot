import {
  CloudinaryResource,
  ModalMusicListProps,
  likeType,
} from "@/type/dataType";
import { Heart } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { SetStateAction, useState, useCallback } from "react";
import OnclickEffect from "./onclickEffect";
import { handleOnLike } from "@/lib/util";
import useTrackStore from "@/store/trackStore";
import { useAuth } from "@/provider/authProvider";
export default function ModalMusicList({
  loading,
  trackList,
  isLiked,
  toggleLike,
}: ModalMusicListProps) {
  const { handleOnClickCard, currentTrackAssetId: currentId } = useTrackStore();
  const { user } = useAuth();
  const [playingLottieTrackId, setPlayingLottieTrackId] = useState<
    string | null
  >(null);

  const showLoading = useCallback(() => loading !== false, [loading]);
  const showTrackList = useCallback(
    () => loading === false && trackList.length > 0,
    [loading, trackList.length]
  );
  const showEmptyResult = useCallback(
    () => loading === false && trackList.length === 0,
    [loading, trackList.length]
  );

  return (
    <>
      {showLoading() && (
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
      {showTrackList() && (
        <>
          {trackList.map((track) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                handleOnClickCard(track.asset_id);
              }}
              key={track.asset_id}
              className={clsx(
                "flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer",
                currentId === track.asset_id && "bg-white/10"
              )}
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

              <div className="relative flex items-center space-x-2">
                <button
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(track.asset_id);
                    setPlayingLottieTrackId(track.asset_id);
                  }}
                >
                  <Heart
                    className={clsx(
                      "w-4 h-4 text-gray-400 hover:text-pink-500 transition-colors",
                      isLiked.find((item) => item.asset_id === track.asset_id)
                        ?.isLike && "text-pink-500 fill-pink-500/30"
                    )}
                  />
                </button>
                <OnclickEffect
                  play={playingLottieTrackId === track.asset_id}
                  onComplete={() => setPlayingLottieTrackId(null)}
                />
                <span className="text-gray-400 text-sm">128</span>
              </div>
            </div>
          ))}
        </>
      )}
      {showEmptyResult() && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">No results found.</p>
        </div>
      )}
    </>
  );
}
