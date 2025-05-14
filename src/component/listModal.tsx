import { useState } from "react";
import { shareWithKakao } from "@/lib/kakao";
import Image from "next/image";
import { X } from "lucide-react";

export default function ListModal() {
  // 더미 데이터 - 현재 재생 중인 음악
  const [currentTrack] = useState({
    id: "1",
    title: "Dreams",
    artist: "플리트우드 맥",
    liked: false,
    progress: 65, // 현재 재생 진행률(%)
  });

  // 더미 데이터 - 재생 가능한 음악 리스트
  const [trackList] = useState([
    {
      id: "1",
      title: "Dreams",
      artist: "플리트우드 맥",
      album: "Rumours",
      duration: "4:17",
    },
    {
      id: "2",
      title: "Hotel California",
      artist: "이글스",
      album: "Hotel California",
      duration: "6:30",
    },
    {
      id: "3",
      title: "Bohemian Rhapsody",
      artist: "퀸",
      album: "A Night at the Opera",
      duration: "5:55",
    },
    {
      id: "4",
      title: "Billie Jean",
      artist: "마이클 잭슨",
      album: "Thriller",
      duration: "4:54",
    },
    {
      id: "5",
      title: "Like a Rolling Stone",
      artist: "밥 딜런",
      album: "Highway 61 Revisited",
      duration: "6:13",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // URL 복사 함수
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 클립보드에 복사되었습니다!");
  };

  const shareTwitter = () => {
    const shareUrl =
      "https://x.com/intent/post?url=https%3A%2F%2Fon.soundcloud.com%2FRm8V6tsueACjccGh9&text=%27Latin%27%20by%20Trending%20Music%20is%20on%20%23SoundCloud&related=soundcloud";
    window.open(shareUrl, "_blank", "width=600,height=450");
  };

  const shareKakao = () => {
    shareWithKakao({
      objectType: "feed",
      content: {
        title: "Latin by Trending Music",
        description: "지금 음악을 들어보세요!",
        imageUrl: "앨범_이미지_URL",
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 m-auto w-[90%] h-[90%] grid grid-cols-5 bg-[#483544aa] backdrop-blur-[10px] border border-white/50 rounded-2xl shadow-[0_0.5px_0_1px_rgba(255,255,255,0.2)_inset,0_1px_0_0_rgba(255,255,255,0.6)_inset,0_4px_16px_rgba(0,0,0,0.1)] z-30 text-white overflow-hidden">
      <aside className="col-span-2 p-8 flex flex-col items-center border-r border-white/10">
        <div
          className="w-64 h-64 mt-4 relative"
          style={{
            WebkitBoxReflect:
              "below -5px linear-gradient(transparent, transparent 80%, rgba(0, 0, 0, 0.8))",
          }}
        >
          <div className="w-full h-full bg-gray-700/50 animate-pulse rounded-xl"></div>
        </div>

        <div className="mt-8 mb-4 flex justify-center space-x-8 w-full" />

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
            <button
              className="flex items-center space-x-1 text-gray-300 hover:text-pink-500 p-2 rounded-xl transition bg-white/10"
              onClick={() => setIsLiked(!isLiked)}
            >
              <span className={`text-xl ${isLiked ? "text-pink-500" : ""}`}>
                {isLiked ? "♥" : "♡"}
              </span>
              <span>좋아요</span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-300 hover:text-blue-500 p-2 rounded-xl transition bg-white/10"
              onClick={() => setShowShareModal(true)}
            >
              <span className="text-xl">↗</span>
              <span>공유하기</span>
            </button>
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
          {trackList.map((track) => (
            <div
              key={track.id}
              className="flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-700/50 animate-pulse rounded-md mr-4"></div>

              <div className="flex-1">
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>

              <div className="text-gray-400 text-sm">{track.duration}</div>
            </div>
          ))}
        </section>
      </aside>

      {showShareModal && (
        <div
          aria-label="공유하기 모달"
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="w-[400px] bg-[#483544] backdrop-blur-[10px] border border-white/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">공유하기</h3>
              <button
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all grid place-items-center"
                onClick={() => setShowShareModal(false)}
                title="Close"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <section aria-label="URL 복사" className="flex mb-6">
              <input
                type="text"
                value={window.location.href}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg p-2 text-sm"
              />
              <button
                className="bg-white/20 hover:bg-white/30 px-4 text-sm rounded-r-lg transition"
                onClick={copyUrlToClipboard}
              >
                복사
              </button>
            </section>

            <section aria-label="SNS 공유 버튼">
              <p className="mb-3 text-sm text-gray-300">SNS로 공유하기</p>
              <div className="flex space-x-4">
                <button
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-black hover:opacity-80 transition-opacity shadow-md hover:shadow-lg"
                  onClick={shareTwitter}
                  title="Share on X"
                  aria-label="트위터 공유"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/1200px-X_logo.jpg"
                    alt="X.com logo"
                    fill
                    className="object-cover"
                  />
                </button>
                {window?.Kakao && (
                  <button
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-[#FEE500] hover:opacity-80 transition-opacity shadow-md hover:shadow-lg"
                    onClick={shareKakao}
                    title="Share on KakaoTalk"
                    aria-label="카카오톡 공유"
                  >
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/KakaoTalk_logo.svg/1024px-KakaoTalk_logo.svg.png"
                      alt="카카오톡 로고"
                      fill
                      className="object-cover"
                    />
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
