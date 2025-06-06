/*
  TODO:
    Web Audio API 는 웹에서 오디오에 이펙트를 추가하거나, 파형을 시각화 하는등 다양한 기능을 구현할 수 있도록 도와준다.
    Web Audio API 는 모든 작업을 AudioContext 내에서 처리한다.
    AudioContext 내에서는 각각의 AudioNode 들로 소리를 제어할 수 있다.
    analyser를 이용하여 오디오 신호의 주파수 데이터로 비쥬얼라이저 시각화 처리하였다.
    웹 정책으로 인해 클라이언트가 접근하자마자 오디오를 자동 재생하는 것이 불가능하다.
    따라서 사용자 상호작용으로만 resume() 메서드가 작동한다.
*/

interface WindowWithWebKitAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

class AudioSingletonInstance {
  private static instance: AudioSingletonInstance | null = null;
  public audio: HTMLAudioElement | null = null;
  public audioContext: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  public source: MediaElementAudioSourceNode | null = null;

  private constructor() {
    // Browser only
    if (typeof window !== "undefined") {
      this.audio = new Audio();
      this.audio.crossOrigin = "anonymous";
      this.audio.src = "";
      this.audio.loop = false;
      console.log("HTMLAudioElement instance created");

      const Globalwindow = window as WindowWithWebKitAudioContext;
      const AudioContextConstructor =
        window.AudioContext || Globalwindow.webkitAudioContext;

      if (AudioContextConstructor) {
        this.audioContext = new AudioContextConstructor();

        if (this.audio) {
          this.analyser = this.audioContext.createAnalyser();
          this.source = this.audioContext.createMediaElementSource(this.audio);
          this.source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
          this.analyser.fftSize = 512;

          console.log("Web Audio API components initialized");
        } else {
          console.error("HTMLAudioElement failed to initialize");
        }
      } else {
        console.error(
          "AudioSingletonInstance: AudioContext not supported in this environment."
        );
      }
    } else {
      console.error("AudioSingletonInstance: not in a browser environment.");
    }
  }

  public static getInstance() {
    if (!AudioSingletonInstance.instance) {
      AudioSingletonInstance.instance = new AudioSingletonInstance();
    }
    return AudioSingletonInstance.instance;
  }

  public static cleanup(): void {
    const instance = AudioSingletonInstance?.instance;

    if (instance) {
      if (instance.audio) {
        instance.audio.pause();
        instance.audio.src = "";
      }
      if (instance.source) {
        instance.source.disconnect();
      }
      if (instance.analyser) {
        instance.analyser.disconnect();
      }
      if (instance.audioContext && instance.audioContext.state !== "closed") {
        instance.audioContext
          .close()
          .then(() =>
            console.log(
              "AudioSingletonInstance: AudioContext closed successfully."
            )
          )
          .catch((err) =>
            console.error(
              "AudioSingletonInstance: Error closing AudioContext:",
              err
            )
          );
      }

      AudioSingletonInstance.instance = null;
      console.log("AudioSingletonInstance: Instance cleaned up and reset.");
    }
  }
}

// 헬퍼 함수
export const getAudioInstance = () => {
  if (typeof window === "undefined") return null;
  const instance = AudioSingletonInstance.getInstance();
  return instance.audio;
};

export const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const instance = AudioSingletonInstance.getInstance();
  return instance.audioContext;
};

export const getAnalyser = () => {
  if (typeof window === "undefined") return null;
  const instance = AudioSingletonInstance.getInstance();
  return instance.analyser;
};

export const cleanupAudioInstance = (): void => {
  AudioSingletonInstance.cleanup();
};
