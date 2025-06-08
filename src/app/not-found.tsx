import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-8">
        페이지를 찾을 수 없습니다.
      </h2>
      <p className="text-neutral-400 mb-8">
        요청하신 페이지가 존재하지 않거나, 현재 사용할 수 없습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
