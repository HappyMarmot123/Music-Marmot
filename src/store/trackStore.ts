import { create } from "zustand";

interface AppState {
  currentTrackAssetId: string | null;
  handleOnClickCard: (paramAssetId: string | null) => void;
}

const useStore = create<AppState>((set) => ({
  currentTrackAssetId: null,
  handleOnClickCard: (paramAssetId: string | null) =>
    set({ currentTrackAssetId: paramAssetId }),
}));

export default useStore;
