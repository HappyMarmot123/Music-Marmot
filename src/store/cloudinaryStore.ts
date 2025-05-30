import { A11y } from "swiper/modules";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CloudinaryStoreState } from "@/type/dataType";

/* 
  TODO:
  클라이언트에서 필요한 전역상태 각각을 개별적으로 호출하여 불필요한 렌더링 방지
  ex: const cloudinaryData = useStore((state) => state.cloudinaryData);

  persist 
  서버 스냅샷 해결, 일부 상태만 유지, SSR에서 하이드레이션 건너뜀
*/

const useStore = create<CloudinaryStoreState>()(
  persist(
    (set) => ({
      cloudinaryData: [],
      cloudinaryError: null,
      isLoadingCloudinary: false,

      setCloudinaryData: (data) => set({ cloudinaryData: data }),
      setCloudinaryError: (error) => set({ cloudinaryError: error }),
      setIsLoadingCloudinary: (isLoading) =>
        set({ isLoadingCloudinary: isLoading }),
    }),
    {
      name: "cloudinary-store",
      skipHydration: true,
    }
  )
);

export default useStore;
