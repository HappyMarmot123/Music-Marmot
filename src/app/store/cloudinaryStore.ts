import { create } from "zustand";
import {
  CloudinaryResourceMap,
  CloudinaryStoreState,
} from "@/shared/types/dataType";

const useCloudinaryStore = create<CloudinaryStoreState>((set) => ({
  cloudinaryData: new Map(),
  cloudinaryError: null,
  isLoadingCloudinary: true,
  setCloudinaryData: (data: CloudinaryResourceMap) =>
    set({ cloudinaryData: data, isLoadingCloudinary: false }),
  setCloudinaryError: (error: Error | null) => set({ cloudinaryError: error }),
  // setIsLoadingCloudinary: (isLoading: boolean) =>
  //   set({ isLoadingCloudinary: isLoading }),
}));

export default useCloudinaryStore;
