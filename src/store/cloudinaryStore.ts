import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CloudinaryResource } from "@/type/dataType";

interface AppState {
  cloudinaryData: CloudinaryResource[] | null;
  cloudinaryError: Error | null;
  isLoadingCloudinary: boolean | null;
  setCloudinaryData: (data: CloudinaryResource[] | null) => void;
  setCloudinaryError: (error: Error | null) => void;
  setIsLoadingCloudinary: (isLoading: boolean | null) => void;
}

// 브라우저 환경에서만 sessionStorage 사용
const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => sessionStorage)
    : undefined;

// persist 미들웨어를 사용하여 서버 스냅샷 문제 해결
const useStore = create<AppState>()(
  persist(
    (set) => ({
      cloudinaryData: null,
      cloudinaryError: null,
      isLoadingCloudinary: null,

      setCloudinaryData: (data) => set({ cloudinaryData: data }),
      setCloudinaryError: (error) => set({ cloudinaryError: error }),
      setIsLoadingCloudinary: (isLoading) =>
        set({ isLoadingCloudinary: isLoading }),
    }),
    {
      name: "cloudinary-store",
      storage,
      skipHydration: true,
    }
  )
);

export default useStore;
