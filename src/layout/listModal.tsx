import { SetStateAction, useEffect, useRef, useState } from "react";
import { Heart, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import useStore from "@/store/cloudinaryStore";
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
import PlayerTrackDetails from "@/component/playerTrackDetails";

export default function ListModal() {
  const data = useStore((state) => state.cloudinaryData);
  const loading = useStore((state) => state.isLoadingCloudinary);

  const {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    currentTrackInfo,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
  } = useAudioPlayer();

  const [trackList, setTrackList] = useState<CloudinaryResource[]>([]);
  const [isCursorHidden, setIsCursorHidden] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState<likeType[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const [seekHoverTime, setSeekHoverTime] = useState<number | null>(null);
  const [seekHoverPosition, setSeekHoverPosition] = useState(0);
  const seekBarContainerRef = useRef<HTMLDivElement>(null);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (data) {
      setTrackList(data);
    }
  }, [data]);

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

  return (
    <div
      className="grid grid-cols-4 fixed inset-0 m-auto w-[90%] h-[90%]  
              bg-[#483544aa] backdrop-blur-[10px] border border-white/50 rounded-2xl text-white z-40 
              shadow-[0_0.5px_0_1px_rgba(255,255,255,0.2)_inset,0_1px_0_0_rgba(255,255,255,0.6)_inset,0_4px_16px_rgba(0,0,0,0.1)]   overflow-hidden"
    >
      {showShareModal && <ShareModal setShowShareModal={setShowShareModal} />}

      <aside className="col-span-2 p-8 flex flex-col items-center border-r border-white/10">
        <section
          aria-label="현재 재생트랙"
          className="w-56 h-56 mt-4 relative mb-12 bg-white/5 rounded-xl"
          style={{
            WebkitBoxReflect:
              "below -5px linear-gradient(transparent, transparent 80%, rgba(0, 0, 0, 0.8))",
          }}
        >
          {isBuffering || !currentTrackInfo?.artworkId ? (
            <div className="grid place-items-center w-full h-full animate-pulse">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative w-full h-full perspective-1000">
              <CldImage
                key={currentTrackInfo.artworkId}
                src={currentTrackInfo.artworkId}
                className="select-none w-full h-full object-cover rounded-xl shadow-[0_-5px_25px_rgba(255,255,255,0.3)]"
                width={256}
                height={256}
                alt={currentTrackInfo.album || "Album Art"}
                priority
                draggable={false}
              />
            </div>
          )}
        </section>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">{currentTrackInfo?.name}</h2>
          <h3 className="text-xl text-gray-300 mb-4">
            {currentTrackInfo?.producer}
          </h3>

          <section aria-label="재생 진행 막대" className="mt-6 mb-2">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              {/* className="h-full bg-white/70 rounded-full" */}
              {/* <PlayerTrackDetails
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                currentProgress={currentProgress}
                seekBarContainerRef={seekBarContainerRef}
                handleSeek={handleSeek}
                handleSeekMouseMove={handleSeekMouseMove}
                handleSeekMouseOut={handleSeekMouseOut}
                seekHoverTime={seekHoverTime}
                seekHoverPosition={seekHoverPosition}
              /> */}
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
            <button
              onClick={prevTrack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <SkipBack width={20} fill="white" />
            </button>
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              {isPlaying ? (
                <Pause width={20} fill="white" />
              ) : (
                <Play width={20} fill="white" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <SkipForward width={20} fill="white" />
            </button>
          </section>

          <section
            aria-label="공유하기"
            className="mt-8 mb-4 flex justify-center space-x-8 w-full"
          >
            <button
              className="flex items-center space-x-1 text-gray-300 hover:text-pink-500 p-2 rounded-xl transition bg-white/10" // 여기에 클래스 추가
              onClick={() =>
                handleOnLike(
                  isLiked,
                  currentTrackInfo?.id as string,
                  setIsLiked
                )
              }
            >
              <span className="relative z-10 flex items-center space-x-1">
                <Heart
                  className={clsx(
                    "w-4 h-4 text-gray-400 hover:text-pink-500 transition-colors",
                    isLiked.find(
                      (item) => item.id === currentTrackInfo?.id && item.isLike
                    ) && "text-pink-500 fill-pink-500/30"
                  )}
                />
                <span>좋아요</span>
                <OnclickEffect
                  play={
                    isLiked.find((item) => item.id === currentTrackInfo?.id)
                      ?.isLike || false
                  }
                  onComplete={() => {
                    console.log("complete");
                  }}
                />
              </span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-300 hover:text-blue-500 p-2 rounded-xl transition bg-white/10"
              onClick={() => setShowShareModal(true)}
            >
              <span className="relative z-10 flex items-center space-x-1">
                <span className="text-xl">↗</span>
                <span>공유하기</span>
              </span>
            </button>
          </section>
        </div>
      </aside>

      <aside className="col-span-2 p-8 overflow-auto">
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
            loading={loading}
            trackList={trackList}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
          />
        </section>
      </aside>
    </div>
  );
}
