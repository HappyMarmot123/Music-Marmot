import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_RECENT_ASSETS = 10;

interface RecentPlayState {
  recentAssetIds: string[];
  addRecentAssetId: (assetId: string) => void;
}

const useRecentPlayStore = create<RecentPlayState>()(
  persist(
    (set, get) => ({
      recentAssetIds: [],
      addRecentAssetId: (assetId) => {
        set((state) => {
          let newRecentAssetIds = [
            assetId,
            ...state.recentAssetIds.filter((id) => id !== assetId),
          ];

          if (newRecentAssetIds.length > MAX_RECENT_ASSETS) {
            newRecentAssetIds = newRecentAssetIds.slice(0, MAX_RECENT_ASSETS);
          }
          return { recentAssetIds: newRecentAssetIds };
        });
      },
    }),
    {
      name: "recent-play-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentAssetIds: state.recentAssetIds }),
    }
  )
);

export default useRecentPlayStore;
