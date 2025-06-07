import WaveSurfer from "wavesurfer.js";

class WaveSurferSingleton {
  private static instance: WaveSurfer | null = null;

  public static getInstance(
    container: HTMLElement,
    media: HTMLAudioElement
  ): WaveSurfer {
    if (typeof window === "undefined") {
      return {
        on: () => {},
        load: () => Promise.resolve(),
        destroy: () => {},
      } as unknown as WaveSurfer;
    }

    if (!WaveSurferSingleton.instance) {
      console.log("Creating new WaveSurfer instance");
      WaveSurferSingleton.instance = WaveSurfer.create({
        container,
        media,
        waveColor: "rgb(200, 200, 200)",
        progressColor: "rgb(100, 100, 100)",
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 30,
        cursorWidth: 0,
      });
    } else {
      console.log("Reusing existing WaveSurfer instance");
      if (WaveSurferSingleton.instance.getWrapper() !== container) {
        WaveSurferSingleton.instance.setOptions({ container });
      }
    }
    return WaveSurferSingleton.instance;
  }

  public static getInstanceWithoutInitialization(): WaveSurfer | null {
    return WaveSurferSingleton.instance;
  }

  public static cleanup(): void {
    if (WaveSurferSingleton.instance) {
      WaveSurferSingleton.instance.destroy();
      WaveSurferSingleton.instance = null;
      console.log("WaveSurfer instance cleaned up.");
    }
  }
}

export default WaveSurferSingleton;
