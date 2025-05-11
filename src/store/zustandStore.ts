import { create } from "zustand";
import type { CloudinaryResource } from "@/type/dataType";

interface AppState {
  count: number;
  increase: () => void;
  decrease: () => void;

  cloudinaryData: CloudinaryResource[] | null;
  cloudinaryError: Error | null;
  isLoadingCloudinary: boolean;
  setCloudinaryData: (data: CloudinaryResource[] | null) => void;
  setCloudinaryError: (error: Error | null) => void;
  setIsLoadingCloudinary: (isLoading: boolean) => void;
}

const useStore = create<AppState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),

  cloudinaryData: null,
  cloudinaryError: null,
  isLoadingCloudinary: false,

  setCloudinaryData: (data) => set({ cloudinaryData: data }),
  setCloudinaryError: (error) => set({ cloudinaryError: error }),
  setIsLoadingCloudinary: (isLoading) =>
    set({ isLoadingCloudinary: isLoading }),
}));

export default useStore;
