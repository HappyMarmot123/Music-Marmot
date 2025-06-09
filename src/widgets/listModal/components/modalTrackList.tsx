import { Heart, LayoutList, Search, X } from "lucide-react";
import MyTooltip from "@/shared/components/myTooltip";
import { motion } from "framer-motion";
import clsx from "clsx";
import ModalMusicList from "@/features/listModal/components/modalMusicList";
import { useListModal } from "@/features/listModal/hook/useListModal";
import CreateListButton from "@/features/listModal/components/tabButtonFactory";

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
    <div className="p-4 sm:p-8 md:h-full md:overflow-auto md:custom-scrollbar md:col-span-3">
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
            <CreateListButton
              type="heart"
              props={{ user, activeButton, setActiveButton }}
            />
            <CreateListButton
              type="available"
              props={{ user, activeButton, setActiveButton }}
            />
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
