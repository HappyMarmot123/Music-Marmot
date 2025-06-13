import { CloudinaryResource } from "@/shared/types/dataType";
import Image from "next/image";
import clsx from "clsx";
import React, { useCallback } from "react";
import useTrackStore from "@/app/store/trackStore";
import { useAuth } from "@/app/providers/authProvider";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import { setFindNewTrack } from "@/shared/lib/audioPlayerUtil";
import { useListModal } from "../hook/useListModal";
import LoadingView from "./loadingView";
import EmptyView from "./emptyView";
import { LikeButton } from "@/shared/components/likeButton";

const ModalMusicList = () => {
  const { isLoading, trackList, favoriteAssetIds, toggleFavorite } =
    useListModal();
  const { user } = useAuth();
  const { setTrack, currentTrack } = useTrackStore();
  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);

  const handleOnClickCard = useCallback(
    (paramAssetId: string) => {
      setFindNewTrack(cloudinaryData, paramAssetId, setTrack);
    },
    [cloudinaryData]
  );

  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, track: CloudinaryResource) => {
      e.preventDefault();
      handleOnClickCard(track.asset_id);
    },
    [trackList]
  );

  const isCurrentTrackStyle = (track: CloudinaryResource) => {
    return currentTrack?.assetId === track.asset_id ? "bg-white/10" : "";
  };

  const initFavorite = (track: CloudinaryResource) => {
    return favoriteAssetIds.has(track.asset_id);
  };

  return (
    <>
      {isLoading && <LoadingView />}
      {trackList.size === 0 && <EmptyView />}
      {Array.from(trackList.values()).map((track) => (
        <div
          key={track.asset_id}
          onClick={(e) => handleOnClick(e, track)}
          className={clsx(
            isCurrentTrackStyle(track),
            "flex items-center p-3 rounded-lg ",
            "hover:bg-white/10 transition cursor-pointer"
          )}
        >
          <Image
            src={track?.album_secure_url}
            alt={track.title}
            width={48}
            height={48}
            className="rounded-md mr-4"
          />

          <div className="flex-1">
            <h3 className="font-medium">{track.title}</h3>
            <p className="text-sm text-gray-400">{track.producer}</p>
          </div>

          <div className="relative flex items-center space-x-2">
            <LikeButton
              track={track}
              user={user}
              isFavorite={initFavorite(track)}
              toggleFavorite={toggleFavorite}
            />
            <span className="text-gray-400 text-sm">128</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(ModalMusicList);
