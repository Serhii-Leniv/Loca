import { useAudioStore } from '../stores/audioStore';
import { getTrack, getRandomTrack } from './tracks';

/**
 * Initialize global audio element and sync it with the audio store
 * Call this once in your App component
 */
export async function initializeAudioElement(): Promise<HTMLAudioElement> {
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

  // Try to rehydrate persisted audio state from localStorage
<<<<<<< HEAD
  const AUDIO_STORAGE_KEY = 'loca.audioState.v1';
  let finalTrack = null;
  let persistedPlaylist = undefined;
  let persistedIndex = -1;
  let persistedTime = 0;
=======
  const STORAGE_KEY = 'loca.audioState.v1';
  let finalTrack = null;
  let persistedPlaylist = undefined;
  let persistedIndex = -1;
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58
  let persistedShuffle = false;
  let persistedRepeat = false;

  try {
<<<<<<< HEAD
    const raw = localStorage.getItem(AUDIO_STORAGE_KEY);
    console.log('[AudioService] Rehydration: localStorage raw =', raw);
    if (raw) {
      const parsed = JSON.parse(raw) as any;
      console.log('[AudioService] Rehydration: parsed state =', parsed);
      const persistedTrack = parsed.currentTrack as { id?: string } | null;
      persistedPlaylist = parsed.currentPlaylist as any[] | undefined;
      persistedIndex = typeof parsed.currentIndex === 'number' ? parsed.currentIndex : -1;
      persistedTime = typeof parsed.currentTime === 'number' ? parsed.currentTime : 0;
      persistedShuffle = !!parsed.isShuffleEnabled;
      persistedRepeat = !!parsed.isRepeating;
=======
    const raw = localStorage.getItem(STORAGE_KEY);
    console.log('[AudioService] Rehydration: localStorage raw =', raw);
    if (raw) {
      const parsed = JSON.parse(raw) as any;
      console.log('[AudioService] Rehydration: parsed data =', parsed);
      // Zustand persist middleware nests the actual state in a "state" property
      const state = parsed.state || parsed;
      console.log('[AudioService] Rehydration: extracted state =', state);
      const persistedTrack = state.currentTrack as { id?: string } | null;
      persistedPlaylist = state.currentPlaylist as any[] | undefined;
      persistedIndex = typeof state.currentIndex === 'number' ? state.currentIndex : -1;
      persistedShuffle = !!state.isShuffleEnabled;
      persistedRepeat = !!state.isRepeating;
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58

      if (persistedTrack && persistedTrack.id) {
        try {
          console.log('[AudioService] Rehydration: Fetching persisted track ID =', persistedTrack.id);
          const fresh = await getTrack(persistedTrack.id);
          console.log('[AudioService] Rehydration: Fresh track fetched =', fresh);
          finalTrack = fresh;
        } catch (err) {
          console.error('[AudioService] Rehydration: getTrack failed, error =', err);
          console.warn('Failed to fetch persisted track, will try random:', err);
          finalTrack = null;
        }
      }
    } else {
      console.log('[AudioService] Rehydration: No localStorage data found (first load)');
    }
  } catch (e) {
    console.error('[AudioService] Rehydration: Outer try-catch error =', e);
    console.warn('Failed to rehydrate audio state:', e);
  }

  // If no track was found from persistence, fetch a random one
  if (!finalTrack) {
    try {
      console.log('[AudioService] Rehydration: Fetching random track...');
      const random = await getRandomTrack();
      console.log('[AudioService] Rehydration: Random track fetched =', random);
      finalTrack = random;
    } catch (err) {
      console.error('[AudioService] Rehydration: getRandomTrack failed, error =', err);
      console.warn('Failed to fetch random track for fallback:', err);
    }
  }

  console.log('[AudioService] Rehydration: finalTrack after attempts =', finalTrack);
  if (finalTrack && finalTrack.streamUrl) {
    console.log('[AudioService] Rehydration: Setting audio src and store state');
    audio.src = finalTrack.streamUrl;
<<<<<<< HEAD
    // Load the media but do not autoplay to respect browser policies
    // set currentTime if available
    if (persistedTime && persistedTime > 0) {
      audio.currentTime = Math.max(0, Math.min(persistedTime, finalTrack.duration || 0));
    }
=======
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58

    useAudioStore.setState({
      currentTrack: finalTrack,
      currentPlaylist: persistedPlaylist || (finalTrack ? [finalTrack] : []),
      currentIndex: persistedIndex >= 0 ? persistedIndex : 0,
<<<<<<< HEAD
      currentTime: persistedTime || 0,
=======
      currentTime: 0,
>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58
      duration: finalTrack.duration || 0,
      isShuffleEnabled: persistedShuffle,
      isRepeating: persistedRepeat,
      isPlaying: false, // do not auto-play on load
    });
  } else {
    console.warn('[AudioService] Rehydration: finalTrack is invalid or missing streamUrl =', finalTrack);
  }

  // Mark initialization complete so UI can render
  try {
    useAudioStore.setState({ isInitialized: true });
  } catch (e) {
    console.warn('Failed to mark audio initialized:', e);
  }

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
    const state = useAudioStore.getState();
    // If repeat is enabled, restart current track
    if (state.isRepeating) {
      try {
        audio.currentTime = 0;
        void audio.play();
        useAudioStore.setState({ isPlaying: true });
        return;
      } catch (err) {
        console.error('Failed to restart track on repeat:', err);
      }
    }

    // Otherwise advance to next track (playNext handles shuffle if enabled)
    state.playNext().catch((error) => {
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
