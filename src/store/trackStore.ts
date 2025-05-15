import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  currentTrackAssetId: string | null;
  handleOnClickCard: (paramAssetId: string | null) => void;
}

const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentTrackAssetId: null,
      handleOnClickCard: (paramAssetId: string | null) =>
        set({ currentTrackAssetId: paramAssetId }),
    }),
    {
      name: "track-store",
    }
  )
);

export default useStore;
