import { create } from "zustand";
import { toast } from "sonner";
import { handleOnLike } from "@/shared/lib/util";

interface FavoriteState {
  favoriteAssetIds: Set<string>;
  setFavorites: (favorites: Set<string>) => void;
  toggleFavorite: (assetId: string, userId: string) => Promise<void>;
}

const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteAssetIds: new Set(),
  setFavorites: (favorites) => set({ favoriteAssetIds: new Set(favorites) }),

  toggleFavorite: async (assetId, userId) => {
    await handleOnLike(assetId, userId, get, set);
  },
}));

export default useFavoriteStore;
