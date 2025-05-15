import { useState } from "react";
import { X } from "lucide-react";
import useStore from "@/store/zustandStore";
import { CloudinaryResource } from "@/type/dataType";
import ShareModal from "@/component/shareModal";
import Image from "next/image";
import ModalMusicList from "@/component/modalMusicList";
import Share from "@/component/share";
export default function ListModal() {
  const { cloudinaryData, cloudinaryError, isLoadingCloudinary } = useStore();

  // 더미 데이터 - 현재 재생 중인 음악
  const [currentTrack] = useState({
    id: "1",
    title: "Dreams",
    artist: "플리트우드 맥",
    liked: false,
    progress: 65, // 현재 재생 진행률(%)
  });

  // 더미 데이터 - 재생 가능한 음악 리스트
  const [trackList] = useState<CloudinaryResource[]>(cloudinaryData || []);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="fixed inset-0 m-auto w-[90%] h-[90%] grid grid-cols-5 bg-[#483544aa] backdrop-blur-[10px] border border-white/50 rounded-2xl shadow-[0_0.5px_0_1px_rgba(255,255,255,0.2)_inset,0_1px_0_0_rgba(255,255,255,0.6)_inset,0_4px_16px_rgba(0,0,0,0.1)] z-30 text-white overflow-hidden">
      {showShareModal && <ShareModal setShowShareModal={setShowShareModal} />}

      <aside className="col-span-2 p-8 flex flex-col items-center border-r border-white/10">
        <div
          className="w-64 h-64 mt-4 relative mb-12"
          style={{
            WebkitBoxReflect:
              "below -5px linear-gradient(transparent, transparent 80%, rgba(0, 0, 0, 0.8))",
          }}
        >
          <div className="w-full h-full bg-gray-700/50 animate-pulse rounded-xl"></div>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">{currentTrack.title}</h2>
          <h3 className="text-xl text-gray-300 mb-4">{currentTrack.artist}</h3>

          <section aria-label="재생 진행 막대" className="mt-6 mb-2">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full"
                style={{ width: `${currentTrack.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2:45</span>
              <span>4:17</span>
            </div>
          </section>

          <section
            aria-label="재생 컨트롤"
            className="mt-6 flex items-center justify-center space-x-4"
          >
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <span className="text-xl">◀</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition">
              <span className="text-2xl">▶</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">
              <span className="text-xl">▶</span>
            </button>
          </section>

          <section
            aria-label="공유하기"
            className="mt-8 mb-4 flex justify-center space-x-8 w-full"
          >
            <Share
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              setShowShareModal={setShowShareModal}
            />
          </section>
        </div>
      </aside>

      <aside className="col-span-3 p-8 overflow-auto">
        <section
          aria-label="검색하기"
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-bold">재생 가능한 음악</h2>

          <div className="relative">
            <input
              type="text"
              placeholder="노래 또는 아티스트 검색"
              className="w-64 px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:border-white/40 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </section>

        <section aria-label="음악 리스트" className="space-y-3">
          <ModalMusicList
            isLoadingCloudinary={isLoadingCloudinary}
            trackList={trackList}
          />
        </section>
      </aside>
    </div>
  );
}
