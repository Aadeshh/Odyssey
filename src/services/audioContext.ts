let audio: HTMLAudioElement | null = null;
let isInitialized = false;

export const useBackgroundMusic = (shouldPlay: boolean = true) => {
  const initializeAudio = () => {
    if (!isInitialized) {
      audio = new Audio('/assets/soundromeda.odyssey.soundtrack.1.wav');
      audio.loop = true;
      isInitialized = true;
      audio.volume = 0.5;
    }
  };

  const playAudio = () => {
    if (audio && shouldPlay && audio.paused) {
      audio.play().catch(console.error);
    }
  };

  const pauseAudio = () => {
    if (audio && !shouldPlay && !audio.paused) {
      audio.pause();
    }
  };

  if (typeof window !== 'undefined') {
    initializeAudio();
    if (shouldPlay) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  return { isPlaying: audio ? !audio.paused : false };
};