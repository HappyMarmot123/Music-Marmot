import { User } from "@/db/userQuery";
import { handleOnLike } from "@/lib/util";
import { likeType } from "@/type/dataType";
import { SetStateAction, useRef, useState } from "react";

export function useListModal(
  trackAssetId: string,
  user: User,
  isLiked: likeType[],
  setIsLiked: (updateFn: (prevLiked: likeType[]) => likeType[]) => void,
  setAnimateLikeForAssetId: (assetId: string) => void,
  volume: number,
  setVolume: (volume: number) => void,
  setShowVolumeSlider: (showVolumeSlider: boolean) => void
) {
  const volumeSliderTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const toggleLike = async () => {
    if (!trackAssetId) throw new Error("asset id is required");
    if (!user) throw new Error("need login");

    const currentTrackLikeInfo = isLiked.find(
      (item) => item.asset_id === trackAssetId
    );
    const currentIsLikedState = !!currentTrackLikeInfo;
    await handleOnLike(
      trackAssetId,
      user.id.toString(),
      currentIsLikedState,
      setIsLiked
    );

    if (!currentIsLikedState) {
      setAnimateLikeForAssetId(trackAssetId);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handleVolumeMouseEnter = () => {
    if (volumeSliderTimeoutId.current) {
      clearTimeout(volumeSliderTimeoutId.current);
      volumeSliderTimeoutId.current = null;
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeMouseLeave = () => {
    volumeSliderTimeoutId.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  return {
    toggleLike,
    handleVolumeChange,
    handleVolumeMouseEnter,
    handleVolumeMouseLeave,
  };
}
