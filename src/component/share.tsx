export default function Share({
  isLiked,
  setIsLiked,
  setShowShareModal,
}: {
  isLiked: boolean;
  setIsLiked: (isLiked: boolean) => void;
  setShowShareModal: (showShareModal: boolean) => void;
}) {
  return (
    <>
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
    </>
  );
}
