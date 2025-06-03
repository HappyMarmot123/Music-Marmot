"use client"; // 클라이언트 컴포넌트로 명시

import { GoogleAuthStrategy } from "@/hook/useAuthActions";
import { useAuth } from "@/provider/authProvider";

export default function AuthButtons() {
  const { user, isLoadingSession, authActions } = useAuth();
  const { signIn, signOut } = authActions;

  if (isLoadingSession) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email || user.user_metadata?.name || "User"}!</p>
          <button
            onClick={signOut}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn(new GoogleAuthStrategy())}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
