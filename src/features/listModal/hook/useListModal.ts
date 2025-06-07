import { type User } from "@supabase/supabase-js";
import { handleOnLike } from "@/shared/lib/util";
import { likeType } from "@/shared/types/dataType";

export function useListModal(
  trackAssetId: string,
  user: User,
  isLiked: likeType[],
  setIsLiked: (updateFn: (prevLiked: likeType[]) => likeType[]) => void,
  setAnimateLikeForAssetId: (assetId: string) => void
) {
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

  return {
    toggleLike,
  };
}
