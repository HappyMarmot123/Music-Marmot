import { SetStateAction, useEffect, useState } from "react";
import {
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
  ListMusic,
  LayoutList,
} from "lucide-react";
import useCloudinaryStore from "@/store/cloudinaryStore";
import { CloudinaryResource } from "@/type/dataType";
import ShareModal from "@/component/shareModal";
import Image from "next/image";
import ModalMusicList from "@/component/modalMusicList";
import { likeType } from "@/type/dataType";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import OnclickEffect from "@/component/onclickEffect";
import { handleOnLike } from "@/lib/util";
import ModalPlayerTrackDetails from "@/component/modalPlayerTrackDetails";
import LoginSection from "@/component/loginSection";
import { useToggle } from "@/store/toggleStore";
import { useAuth } from "@/provider/authProvider";
import { motion } from "framer-motion";
import AudioVisualizer from "@/component/audioVisualizer";
import { useFavorites } from "@/hooks/useFavorites";

export default function ListModal({
  closeToggle,
}: {
  closeToggle: () => void;
}) {
  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    handleSelectTrack,
    analyserNode,
  } = useAudioPlayer();

  const { user } = useAuth();
  const { data: favorites, isLoading, error, refetch } = useFavorites();

  const [trackList, setTrackList] = useState<CloudinaryResource[]>([]);
  const [isCursorHidden, setIsCursorHidden] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState<likeType[]>([]);

  useEffect(() => {
    if (cloudinaryData) {
      setTrackList(cloudinaryData);
    }
  }, [cloudinaryData]);

  useEffect(() => {
    const secondaryCursor = document.querySelector(".secondary-cursor");
    if (secondaryCursor) {
      if (isCursorHidden) {
        secondaryCursor.classList.add("hidden");
      } else {
        secondaryCursor.classList.remove("hidden");
      }
    }
  }, [isCursorHidden]);

  useEffect(() => {
    if (favorites) {
      setIsLiked(
        favorites.map((favorite) => ({
          asset_id: favorite.asset_id,
          isLike: true,
        }))
      );
    }
  }, [favorites]);

  const toggleLike = async (trackAssetId: string | undefined) => {
    if (!trackAssetId) return;
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    const currentTrackLikeInfo = isLiked.find(
      (item) => item.asset_id === trackAssetId
    );
    const currentIsLikedState = currentTrackLikeInfo
      ? currentTrackLikeInfo.isLike
      : false;

    await handleOnLike(trackAssetId, user.id, currentIsLikedState, setIsLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="grid grid-cols-4 fixed inset-0 m-auto w-[90%] h-[90%]  
              bg-[#483544aa] backdrop-blur-[10px] border border-white/50 rounded-2xl text-white z-40 
              shadow-[0_0.5px_0_1px_rgba(255,255,255,0.2)_inset,0_1px_0_0_rgba(255,255,255,0.6)_inset,0_4px_16px_rgba(0,0,0,0.1)]   overflow-hidden"
    >
      <aside className="col-span-2 p-8 flex flex-col items-center border-r border-white/10">
        <div className="flex flex-col items-center flex-grow w-full">
          <section aria-label="현재 재생트랙" className="w-full mb-16">
            <div
              className="relative flex flex-col items-center justify-center pt-8 overflow-hidden"
              style={{
                WebkitBoxReflect:
                  "below -5px linear-gradient(transparent, transparent 80%, rgba(0, 0, 0, 0.8))",
              }}
            >
              {analyserNode && (
                <div className="absolute z-0">
                  <AudioVisualizer
                    analyserNode={analyserNode}
                    isPlaying={isPlaying}
                    width={600}
                    height={300}
                  />
                </div>
              )}
              {(isBuffering || !currentTrack?.artworkId) && (
                <div className="grid place-items-center w-full h-full animate-pulse rounded-xl">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!(isBuffering || !currentTrack?.artworkId) && (
                <>
                  {currentTrack?.artworkId && (
                    <motion.div
                      key={currentTrack.assetId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.75 }}
                      className="w-56 h-56 rounded-xl perspective-1000 z-10 overflow-hidden shadow-[0_-5px_25px_rgba(255,255,255,0.3)]"
                    >
                      <CldImage
                        src={currentTrack.artworkId}
                        className="select-none w-full h-full object-cover"
                        width={224}
                        height={224}
                        alt={currentTrack.album || "Album Art"}
                        priority
                        draggable={false}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </section>

          <div className="w-full max-w-md">
            <motion.h2
              key={`${currentTrack?.assetId}-name`}
              animate={{ y: isPlaying ? [0, -2, 0] : 0 }}
              transition={{
                duration: 1.5,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="text-3xl font-bold mb-2 truncate"
            >
              {currentTrack?.name}
            </motion.h2>
            <motion.h3
              key={`${currentTrack?.assetId}-producer`}
              animate={{ y: isPlaying ? [0, 2, 0] : 0 }}
              transition={{
                duration: 1.5,
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="text-xl text-gray-300 mb-4 truncate"
            >
              {currentTrack?.producer}
            </motion.h3>

            <ModalPlayerTrackDetails
              currentTime={currentTime}
              duration={duration}
              seek={seek}
            />

            <section aria-label="재생 컨트롤" className="mt-6 relative">
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  onClick={prevTrack}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <SkipBack width={20} fill="white" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  onClick={togglePlayPause}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
                >
                  {isPlaying ? (
                    <Pause width={20} fill="white" />
                  ) : (
                    <Play width={20} fill="white" />
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  onClick={nextTrack}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <SkipForward width={20} fill="white" />
                </motion.button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                onClick={() => toggleLike(currentTrack?.assetId)}
                className="absolute top-1 right-0 text-gray-300 hover:text-pink-500 p-2 rounded-xl transition bg-white/10"
                aria-label={
                  isLiked.find(
                    (item) => item.asset_id === currentTrack?.assetId
                  )
                    ? "dislike"
                    : "like"
                }
              >
                <span className="relative z-10 flex items-center space-x-1">
                  <Heart
                    className={clsx(
                      "w-4 h-4 text-gray-400 hover:text-pink-500 transition-colors",
                      isLiked.find(
                        (item) => item.asset_id === currentTrack?.assetId
                      )?.isLike && "text-pink-500 fill-pink-500/30"
                    )}
                  />
                  <span>128</span>
                  <OnclickEffect
                    play={
                      isLiked.find(
                        (item) => item.asset_id === currentTrack?.assetId
                      )
                        ? true
                        : false
                    }
                    onComplete={() => {
                      console.log("complete");
                    }}
                  />
                </span>
              </motion.button>
            </section>
          </div>
        </div>
        <LoginSection />
      </aside>

      <aside className="col-span-2 p-8 overflow-auto custom-scrollbar">
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
                🔍
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
            <h2 className="text-2xl font-bold">Available Now</h2>
            {user && (
              <div className="flex flex-row space-x-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="px-3 py-1 text-sm font-medium text-white bg-purple-600/80 rounded-lg hover:bg-purple-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center space-x-2"
                >
                  <Heart size={16} />
                  {/* <span>Like</span> */}
                </motion.button>
                {/* <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="px-3 py-1 text-sm font-medium text-white bg-sky-600/80 rounded-lg hover:bg-sky-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex items-center justify-center space-x-2"
                >
                  <ListMusic size={16} />
                  <span>List</span>
                </motion.button> */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="px-3 py-1 text-sm font-medium text-white bg-emerald-600/80 rounded-lg hover:bg-emerald-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 flex items-center justify-center space-x-2"
                >
                  <LayoutList size={16} />
                  {/* <span>All</span> */}
                </motion.button>
              </div>
            )}
          </div>
        </section>

        <section aria-label="음악 리스트" className="space-y-3">
          <ModalMusicList
            loading={isLoadingCloudinary}
            trackList={trackList.filter(
              (track) =>
                track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                track.producer?.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            isLiked={isLiked}
            toggleLike={toggleLike}
            onTrackSelect={(assetId) => handleSelectTrack(assetId)}
          />
        </section>
      </aside>
    </motion.div>
  );
}
