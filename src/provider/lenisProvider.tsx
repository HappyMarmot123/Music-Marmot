"use client";

import React, { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const options: LenisOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // 다른 Lenis 옵션들을 여기에 추가할 수 있습니다.
    // 예: smoothTouch: true,
  };

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
