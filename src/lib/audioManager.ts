let audioInstance: HTMLAudioElement | null = null;

export const getAudioInstance = (): HTMLAudioElement => {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.src = "";
    audioInstance.loop = false;
    console.log("Global Audio instance created");
  }
  return audioInstance;
};

export const cleanupAudioInstance = () => {
  if (audioInstance) {
    audioInstance.pause();
    // audioInstance.src = "";
    // audioInstance = null;
  }
};
