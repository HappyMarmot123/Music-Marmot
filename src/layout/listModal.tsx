import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
  ListMusic,
  LayoutList,
  Volume2,
  VolumeX,
} from "lucide-react";
import useCloudinaryStore from "@/store/cloudinaryStore";
import { CloudinaryResource } from "@/type/dataType";
import ModalMusicList from "@/component/modalMusicList";
import { likeType } from "@/type/dataType";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import OnclickEffect from "@/component/onclickEffect";
import { handleOnLike } from "@/lib/util";
import ModalPlayerTrackDetails from "@/component/modalPlayerTrackDetails";
import LoginSection from "@/component/loginSection";
import { useAuth } from "@/provider/authProvider";
import { motion } from "framer-motion";
import AudioVisualizer from "@/component/audioVisualizer";
import { useFavorites } from "@/hooks/useFavorites";
import MyTooltip from "@/component/myTooltip";

/*
  TODO:
  tippy.js 툴팁 괜찮은데, react19 에러가 뜨네...
  https://www.npmjs.com/package/tippy.js
*/

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
    volume,
    isMuted,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    handleSelectTrack,
    analyserNode,
  } = useAudioPlayer();

  const { user } = useAuth();
  const { data: favorites, isLoading, error, refetch } = useFavorites();
  const volumeSliderTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const [trackList, setTrackList] = useState<CloudinaryResource[]>([]);
  const [isCursorHidden, setIsCursorHidden] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>("available");
  const [listTitleText, setListTitleText] = useState<string>("Available Now");
  const [displayedTrackList, setDisplayedTrackList] = useState<
    CloudinaryResource[]
  >([]);
  const [animateLikeForAssetId, setAnimateLikeForAssetId] = useState<
    string | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState<likeType[]>([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (cloudinaryData) {
      setTrackList(cloudinaryData);
    }
  }, [cloudinaryData]);

  useEffect(() => {
    if (user) {
      const storedActiveButton = localStorage.getItem("activeButtonKey");
      if (storedActiveButton) {
        setActiveButton(storedActiveButton);
      } else {
        setActiveButton("available");
      }
    }
  }, [user]);

  useEffect(() => {
    if (activeButton && user) {
      setListTitleText(
        activeButton === "heart" ? "Your Liked" : "Available Now"
      );
      localStorage.setItem("activeButtonKey", activeButton);
    }
  }, [activeButton, user]);

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

  useEffect(() => {
    let newDisplayedList: CloudinaryResource[] = [];

    if (activeButton === "heart") {
      const likedAssetIds = new Set(isLiked.map((like) => like.asset_id));
      newDisplayedList = trackList.filter(
        (track) => track.asset_id && likedAssetIds.has(track.asset_id)
      );
    }
    if (activeButton === "available") {
      newDisplayedList = trackList;
    }

    setDisplayedTrackList(newDisplayedList);
  }, [activeButton, trackList, isLiked]);

  const searchedTrackList = useMemo(() => {
    if (searchTerm) {
      return displayedTrackList.filter(
        (track) =>
          track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.producer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return displayedTrackList;
  }, [displayedTrackList, searchTerm]);

  const toggleLike = async (trackAssetId: string | undefined) => {
    if (!trackAssetId) return;
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    const currentTrackLikeInfo = isLiked.find(
      (item) => item.asset_id === trackAssetId
    );
    const currentIsLikedState = !!currentTrackLikeInfo;

    await handleOnLike(trackAssetId, user.id, currentIsLikedState, setIsLiked);

    if (!currentIsLikedState) {
      // This means the track was just liked
      setAnimateLikeForAssetId(trackAssetId);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handleVolumeMouseEnter = () => {
    if (volumeSliderTimeoutId.current) {
      clearTimeout(volumeSliderTimeoutId.current);
      volumeSliderTimeoutId.current = null;
    }
    setShowVolumeSlider(true);
  };

  const handleVolumeMouseLeave = () => {
    volumeSliderTimeoutId.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
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
                <div className="grid place-items-center w-56 h-56 bg-white/10 animate-pulse rounded-xl">
                  <div className="w-8 h-8 border-4  border-white border-t-transparent rounded-full animate-spin" />
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

            <section aria-label="재생 컨트롤" className="mt-6">
              <div className="flex items-center justify-between w-full">
                <MyTooltip tooltipText="You need to Login!" showTooltip={!user}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => toggleLike(currentTrack?.assetId)}
                    disabled={!user}
                    className={clsx(
                      "p-2 rounded-full transition bg-white/10 hover:bg-white/20",
                      user ? "" : "opacity-50 cursor-not-allowed"
                    )}
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
                        size={20}
                        fill={"white"}
                        className={clsx(
                          "!m-0",
                          isLiked.find(
                            (item) => item.asset_id === currentTrack?.assetId
                          ) && "text-pink-500 fill-pink-500/30"
                        )}
                      />
                      <OnclickEffect
                        play={animateLikeForAssetId === currentTrack?.assetId}
                        onComplete={() => {
                          setAnimateLikeForAssetId(null);
                        }}
                      />
                    </span>
                  </motion.button>
                </MyTooltip>

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

                <div
                  className="flex items-center relative"
                  onMouseEnter={handleVolumeMouseEnter}
                  onMouseLeave={handleVolumeMouseLeave}
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={toggleMute}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX size={20} fill="white" />
                    ) : (
                      <Volume2 size={20} fill="white" />
                    )}
                  </motion.button>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center"
                      style={{
                        height: "120px",
                        width: "-webkit-fill-available",
                        padding: "1rem",
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-[80px] h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer origin-center transform -rotate-90 
                                 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/50 [&::-webkit-slider-thumb]:cursor-pointer 
                                 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white/50 [&::-moz-range-thumb]:cursor-pointer"
                        style={{ width: "80px" }} // 실제 슬라이더 길이 (회전 전 너비)
                      />
                    </motion.div>
                  )}
                </div>
              </div>
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
            loading={
              isLoadingCloudinary || (activeButton === "heart" && isLoading)
            }
            trackList={searchedTrackList}
            isLiked={isLiked}
            toggleLike={toggleLike}
            onTrackSelect={(assetId) => handleSelectTrack(assetId)}
          />
        </section>
      </aside>
    </motion.div>
  );
}
