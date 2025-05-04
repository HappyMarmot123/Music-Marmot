"use client";

import Earth from "@/component/earth";

export default function GlobePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
      <h1 className="text-3xl font-bold text-white mb-8">
        지구본 인터랙티브 데모
      </h1>

      <div className="max-w-screen-lg w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <Earth width={300} height={300} className="mx-auto" />
          </div>

          <div className="flex-1 p-6 bg-gray-900 rounded-lg text-white">
            <h2 className="text-2xl font-semibold mb-4">
              인터랙티브 3D 지구본
            </h2>
            <p className="mb-4">
              이 지구본은 WebGL을 사용한 cobe 라이브러리로 만들어졌습니다.
              마우스로 드래그하여 지구본을 회전시켜 보세요.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>고품질 3D 렌더링</li>
              <li>부드러운 회전 애니메이션</li>
              <li>상호작용 가능한 인터페이스</li>
              <li>커스터마이징 가능한 설정</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
