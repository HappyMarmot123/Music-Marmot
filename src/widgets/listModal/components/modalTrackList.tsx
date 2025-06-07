import { Heart, LayoutList, Search, X } from "lucide-react";
import MyTooltip from "@/shared/components/myTooltip";
import { motion } from "framer-motion";
import clsx from "clsx";
import ModalMusicList from "@/features/listModal/components/modalMusicList";
import { useListModal } from "@/features/listModal/hook/useListModal";

interface ModalTrackListProps {
  closeToggle: () => void;
}

export default function ModalTrackList({ closeToggle }: ModalTrackListProps) {
  const {
    user,
    isLoading,
    trackList,
    isLiked,
    toggleLike,
    handleSelectTrack,
    searchTerm,
    setSearchTerm,
    listTitleText,
    activeButton,
    setActiveButton,
  } = useListModal();

  return (
    <div className="h-full p-4 sm:p-8 overflow-auto custom-scrollbar md:col-span-2">
      <section
        aria-label="재생 목록 컨트롤"
        className="mb-6 border-b border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="relative flex-grow mr-2">
            <input
              type="text"
              placeholder="Search for Songs or Artists"
              className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:border-white/40 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onClick={closeToggle}
            className="p-2 rounded-full hover:bg-white/20 transition"
            aria-label="닫기"
          >
            <X size={24} />
          </motion.button>
        </div>
        <div className="flex items-center justify-between mt-6 mb-2">
          <h2 className="text-2xl font-bold">{listTitleText}</h2>
          <div className="flex flex-row space-x-4">
            <MyTooltip tooltipText="You need to Login!" showTooltip={!user}>
              <motion.button
                disabled={!user}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                onClick={() => setActiveButton("heart")}
                className={clsx(
                  "px-3 py-1 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none flex items-center justify-center space-x-2 border border-white/20",
                  activeButton === "heart"
                    ? "bg-purple-600/80 hover:bg-purple-700/80 ring-1 ring-purple-500 ring-opacity-50"
                    : "bg-purple-300/50 hover:bg-purple-500/60",
                  !user && "cursor-not-allowed opacity-70"
                )}
              >
                <Heart size={16} />
                <span>Like</span>
              </motion.button>
            </MyTooltip>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={() => setActiveButton("available")}
              className={clsx(
                "px-3 py-1 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none flex items-center justify-center space-x-2 border border-white/20",
                activeButton === "available"
                  ? "bg-emerald-600/80 hover:bg-emerald-700/80 ring-1 ring-emerald-500 ring-opacity-50"
                  : "bg-emerald-300/50 hover:bg-emerald-500/60"
              )}
            >
              <LayoutList size={16} />
              <span>List</span>
            </motion.button>
          </div>
        </div>
      </section>

      <section aria-label="음악 리스트" className="space-y-3">
        <ModalMusicList
          loading={isLoading}
          trackList={trackList}
          isLiked={isLiked}
          toggleLike={toggleLike}
          onTrackSelect={(assetId) => handleSelectTrack(assetId)}
        />
      </section>
    </div>
  );
}
