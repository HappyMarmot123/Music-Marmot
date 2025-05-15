import { create } from "zustand";
import type { CloudinaryResource } from "@/type/dataType";

interface AppState {
  cloudinaryData: CloudinaryResource[] | null;
  cloudinaryError: Error | null;
  isLoadingCloudinary: boolean | null;
  setCloudinaryData: (data: CloudinaryResource[] | null) => void;
  setCloudinaryError: (error: Error | null) => void;
  setIsLoadingCloudinary: (isLoading: boolean | null) => void;

  currentTrackAssetId: string | null;
  handleOnClickCard: (paramAssetId: string | null) => void;
}

const useStore = create<AppState>((set) => ({
  cloudinaryData: null,
  cloudinaryError: null,
  isLoadingCloudinary: null,

  setCloudinaryData: (data) => set({ cloudinaryData: data }),
  setCloudinaryError: (error) => set({ cloudinaryError: error }),
  setIsLoadingCloudinary: (isLoading) =>
    set({ isLoadingCloudinary: isLoading }),

  currentTrackAssetId: null,
  handleOnClickCard: (paramAssetId: string | null) =>
    set({ currentTrackAssetId: paramAssetId }),
}));

export default useStore;
