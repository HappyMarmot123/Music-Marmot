import { X } from "lucide-react";
import { shareWithKakao } from "@/shared/lib/kakao";
import Image from "next/image";

export default function ShareModal({
  setShowShareModal,
}: {
  setShowShareModal: (show: boolean) => void;
}) {
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
        title: "EDMM | Playing EDM Music",
        description: "지금 음악을 들어보세요! Made by HappyMarmot123",
        imageUrl:
          "https://res.cloudinary.com/db5yvwr1y/image/upload/v1747570611/2025-05-18_211614_cl3ncz.png",
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
  );
}
