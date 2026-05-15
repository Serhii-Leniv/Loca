import { useAudioStore } from '../stores/audioStore';

/**
 * Initialize global audio element and sync it with the audio store
 * Call this once in your App component
 */
export function initializeAudioElement(): HTMLAudioElement {
  // Check if element already exists
  let audio = document.getElementById('global-audio-player') as HTMLAudioElement;

  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'global-audio-player';
    document.body.appendChild(audio);
  }

  // Ensure audio element requests CORS-enabled resources so presigned MinIO URLs work.
  audio.crossOrigin = 'anonymous';

  // Set audio element in store
  useAudioStore.setState({ audioElement: audio });

  // Set up event listeners for syncing state
  audio.addEventListener('timeupdate', () => {
    useAudioStore.setState({ currentTime: audio.currentTime });
  });

  audio.addEventListener('durationchange', () => {
    useAudioStore.setState({ duration: audio.duration });
  });

  audio.addEventListener('play', () => {
    useAudioStore.setState({ isPlaying: true });
  });

  audio.addEventListener('pause', () => {
    useAudioStore.setState({ isPlaying: false });
  });

  audio.addEventListener('ended', () => {
    useAudioStore.getState().playNext().catch((error) => {
      console.error('Failed to advance to next track after completion:', error);
      useAudioStore.setState({ isPlaying: false });
    });
  });

  audio.addEventListener('error', (error) => {
    console.error('Audio playback error:', error);
    useAudioStore.setState({ isPlaying: false });
  });

  return audio;
}

export function getAudioElement(): HTMLAudioElement | null {
  return useAudioStore.getState().audioElement;
}

export function cleanupAudioElement(): void {
  const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.remove();
  }
  useAudioStore.setState({ audioElement: null });
}
