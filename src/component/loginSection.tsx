import { useAuth } from "@/provider/authProvider";
import { useState } from "react";
import LoginModal from "./loginModal";
import ShareModal from "./shareModal";

export default function LoginSection() {
  const { user, isLoading, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
      {showShareModal && <ShareModal setShowShareModal={setShowShareModal} />}
      <section
        aria-label="사용자 인증"
        className="w-full flex items-center justify-center z-10 min-h-[40px] mb-8"
      >
        {isLoading ? (
          <div className="px-3 py-1.5 text-sm text-gray-300 bg-white/10 rounded-lg">
            로딩 중...
          </div>
        ) : user ? (
          <div className="w-full flex items-center justify-between p-1.5 bg-white/10 rounded-lg">
            <div>
              <span title={user.email || undefined}>
                {user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email ||
                  "사용자"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm text-gray-300 hover:text-blue-400 bg-white/10 p-2 rounded-md transition-colors"
                onClick={() => setShowShareModal(true)}
              >
                <span className="relative z-10 flex items-center space-x-1">
                  <span>↗</span>
                  <span>공유하기</span>
                </span>
              </button>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (error) {
                    console.error("Sign out failed", error);
                  }
                }}
                className="px-3 py-1 text-sm bg-primary/50 hover:bg-primary rounded-md transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
          >
            로그인
          </button>
        )}
      </section>
    </>
  );
}
