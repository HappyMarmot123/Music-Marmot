/*
  TODO:
    Web Audio API 는 웹에서 오디오에 이펙트를 추가하거나, 파형을 시각화 하는등 다양한 기능을 구현할 수 있도록 도와준다.
    Web Audio API 는 모든 작업을 AudioContext 내에서 처리한다.
    AudioContext 내에서는 각각의 AudioNode 들로 소리를 제어할 수 있다.
    analyser를 이용하여 오디오 신호의 주파수 데이터로 비쥬얼라이저 시각화 처리하였다.
    웹 정책으로 인해 클라이언트가 접근하자마자 오디오를 자동 재생하는 것이 불가능하다.
    따라서 사용자 상호작용으로만 resume() 메서드가 작동한다.
*/

let audioInstance: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;

interface WindowWithWebKitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export const getAudioInstance = (): HTMLAudioElement => {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.crossOrigin = "anonymous";
    audioInstance.src = "";
    audioInstance.loop = false;
    console.log("Global Audio instance created");

    // Browser only
    if (typeof window !== "undefined") {
      const Globalwindow = window as WindowWithWebKitAudioContext;
      audioContext = new (window.AudioContext ||
        Globalwindow.webkitAudioContext)();
      if (audioContext && audioInstance) {
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audioInstance);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 512; // 시각화에 사용할 데이터 크기 설정
      }
    }
  }
  return audioInstance;
};

export const getAudioContext = (): AudioContext | null => {
  return audioContext;
};

export const getAnalyser = (): AnalyserNode | null => {
  return analyser;
};

export const cleanupAudioInstance = () => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.src = "";
    audioInstance = null;

    if (source) {
      source.disconnect();
      source = null;
    }
    if (analyser) {
      analyser.disconnect();
      analyser = null;
    }
    if (audioContext && audioContext.state !== "closed") {
      audioContext
        .close()
        .catch((err) => console.error("Error closing AudioContext:", err));
      audioContext = null;
    }
    console.log("Global Audio instance cleaned up");
  }
};
