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
        if (audioContext.state === "suspended") {
          console.log("🚀 ~ audioContext was suspended", audioContext.state);
          audioContext
            .resume()
            .catch((err) => console.error("Error resuming AudioContext:", err));
        }
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audioInstance);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256; // 시각화에 사용할 데이터 크기 설정
      }
    }
  }
  return audioInstance;
};

export const getAudioContext = (): AudioContext | null => {
  if (audioContext && audioContext.state === "suspended") {
    audioContext
      .resume()
      .catch((err) =>
        console.error("Error resuming AudioContext from getAudioContext:", err)
      );
  }
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
    // source와 analyser도 연결 해제 및 null 처리 고려
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
