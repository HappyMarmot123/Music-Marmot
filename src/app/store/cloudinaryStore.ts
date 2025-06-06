import { create } from "zustand";
import {
  CloudinaryStoreState,
  CloudinaryResource,
} from "@/shared/types/dataType";

const useCloudinaryStore = create<CloudinaryStoreState>((set) => ({
  cloudinaryData: [],
  cloudinaryError: null,
  isLoadingCloudinary: true,
  setCloudinaryData: (data: CloudinaryResource[]) =>
    set({ cloudinaryData: data, isLoadingCloudinary: false }),
  setCloudinaryError: (error: Error | null) =>
    set({ cloudinaryError: error, isLoadingCloudinary: false }),
  setIsLoadingCloudinary: (isLoading: boolean) =>
    set({ isLoadingCloudinary: isLoading }),
}));

export default useCloudinaryStore;
