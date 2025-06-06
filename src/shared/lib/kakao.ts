/*
TODO:
https://developers.kakao.com/docs/latest/ko/javascript/getting-started
- 카카오 공유 기능 사용 헬퍼 함수
- 스크립트는 루트에서 로드합니다
- 윈도우 카카오객체 초기화를 단 한번만 진행합니다
*/

let isInitialized: boolean = false;

interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
  [key: string]: unknown;
}

export const initializeKakao = () => {
  if (
    typeof window !== "undefined" &&
    window.Kakao &&
    window.Kakao.isInitialized() === false &&
    !isInitialized
  ) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY as string);
    isInitialized = true;
  }
};

export const shareWithKakao = (options: KakaoShareOptions) => {
  initializeKakao();

  if (window.Kakao?.Share) {
    window.Kakao.Share.sendDefault(options);
  } else {
    console.error("카카오 공유 SDK를 사용할 수 없습니다.");
  }
};

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
      [key: string]: unknown;
    };
  }
}
