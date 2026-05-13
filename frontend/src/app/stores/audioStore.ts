import { create } from 'zustand';
import { Track } from '../types';
import { getRandomTrack, getTrack } from '../services/tracks';

export interface AudioState {
  currentTrack: Track | null;
  currentPlaylist: Track[];
  currentIndex: number;
  isShuffleEnabled: boolean;
  isPlaying: boolean;
  isRepeating: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  audioElement: HTMLAudioElement | null;

  // Actions
  setAudioElement: (element: HTMLAudioElement | null) => void;
  setContextQueue: (tracks: Track[], startIndex: number) => Promise<void>;
  play: (track: Track, streamUrl?: string) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleShuffle: () => void;
  forward: () => Promise<void>;
  backward: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  toggleRepeat: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  stop: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  currentPlaylist: [],
  currentIndex: -1,
  isShuffleEnabled: false,
  isPlaying: false,
  isRepeating: false,
  duration: 0,
  currentTime: 0,
  volume: 1,
  audioElement: null,

  setAudioElement: (element) => set({ audioElement: element }),

  setContextQueue: async (tracks: Track[], startIndex: number) => {
    const state = get();
    const audio = state.audioElement;

    if (!audio) {
      console.warn('Audio element not initialized');
      return;
    }

    // Validate startIndex is within bounds
    if (startIndex < 0 || startIndex >= tracks.length) {
      console.warn('Invalid startIndex:', startIndex);
      return;
    }

    const trackToPlay = tracks[startIndex];
    const streamUrl = (trackToPlay as any).streamUrl;

    // Stop previous track if it's different
    if (state.currentTrack?.id !== trackToPlay.id) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Set up the new audio source
    if (streamUrl && audio.src !== streamUrl) {
      console.log('[AudioStore] setContextQueue: Setting audio source:', streamUrl);
      audio.src = streamUrl;
    }

    // Set current track, playlist context, and start playback
    set({
      currentTrack: trackToPlay,
      currentPlaylist: tracks,
      currentIndex: startIndex,
      isPlaying: true,
      duration: trackToPlay.duration || 0,
      currentTime: 0,
    });

    // Attach error handler
    let refreshAttempted = false;
    const onError = async () => {
      if (refreshAttempted) {
        console.error('[AudioStore] Playback failed after a refresh attempt. Stopping playback for track:', trackToPlay.id);
        audio.pause();
        audio.currentTime = 0;
        set({ isPlaying: false });
        return;
      }

      refreshAttempted = true;

      const errorCode = (audio as any).error?.code;
      const errorMessage = (audio as any).error?.message;
      console.error('[AudioStore] Audio element error - Code:', errorCode, 'Message:', errorMessage);
      console.error('[AudioStore] Audio src:', audio.src);

      // Try to refresh the URL
      console.log('[AudioStore] Attempting to refresh stream URL for track:', trackToPlay.id);
      try {
        const fresh = await getTrack(trackToPlay.id);
        const freshUrl = (fresh as any).streamUrl as string | undefined;
        console.log('[AudioStore] Fresh URL obtained:', freshUrl);

        if (freshUrl && freshUrl !== audio.src) {
          console.log('[AudioStore] Setting refreshed source:', freshUrl);
          audio.src = freshUrl;
          await audio.play();
          set({ isPlaying: true });
        } else {
          console.error('[AudioStore] Fresh URL is same as the failed source or empty. Stopping playback for track:', trackToPlay.id);
          audio.pause();
          audio.currentTime = 0;
          set({ isPlaying: false });
        }
      } catch (err) {
        console.error('[AudioStore] Failed to refresh stream URL. Stopping playback for track:', trackToPlay.id, err);
        audio.pause();
        audio.currentTime = 0;
        set({ isPlaying: false });
      }
    };

    // Remove old listeners and attach new ones
    audio.removeEventListener('error', onError as any);
    audio.addEventListener('error', onError as any);

    try {
      console.log('[AudioStore] setContextQueue: Calling play()...');
      await playAudioSafely(audio);
      console.log('[AudioStore] setContextQueue: Play successful');
    } catch (error) {
      console.error('[AudioStore] setContextQueue: play() threw error:', error);
      set({ isPlaying: false });
      await onError();
    }
  },

  play: async (track: Track, streamUrl?: string) => {
    const state = get();
    const audio = state.audioElement;

    if (!audio) {
      console.warn('Audio element not initialized');
      return;
    }
    // For backwards compatibility, when using play() directly (not via setContextQueue),
    // we build a single-track playlist or append to existing
    const nextPlaylist = state.currentIndex >= 0 && state.currentPlaylist.length > 0
      ? [...state.currentPlaylist.slice(0, Math.max(state.currentIndex + 1, 0)), track]
      : [track];
    const nextIndex = nextPlaylist.length - 1;

    // Stop previous track if it's different
    if (state.currentTrack?.id !== track.id) {
      audio.pause();
      audio.currentTime = 0;
    }

    // If no streamUrl provided, try to use track.streamUrl property
    let urlToUse = streamUrl || (track as any).streamUrl;
    let refreshAttempted = false;

    console.log('[AudioStore] play() called for track:', track.title, 'URL:', urlToUse);

    // Set up the new audio source
    if (urlToUse && audio.src !== urlToUse) {
      console.log('[AudioStore] Setting audio source:', urlToUse);
      audio.src = urlToUse;
    }

    // Set current track and play
    set({
      currentTrack: track,
      currentPlaylist: nextPlaylist,
      currentIndex: nextIndex,
      isPlaying: true,
      duration: track.duration || 0,
      currentTime: 0,
    });

    // Attach comprehensive error handler with detailed diagnostics
    const onError = async () => {
      if (refreshAttempted) {
        console.error('[AudioStore] Playback failed after a refresh attempt. Stopping playback for track:', track.id);
        audio.pause();
        audio.currentTime = 0;
        set({ isPlaying: false });
        return;
      }

      refreshAttempted = true;

      const errorCode = (audio as any).error?.code;
      const errorMessage = (audio as any).error?.message;
      console.error('[AudioStore] Audio element error - Code:', errorCode, 'Message:', errorMessage);
      console.error('[AudioStore] Audio src:', audio.src);
      console.error('[AudioStore] Current track:', track.title);

      // Try to refresh the URL
      console.log('[AudioStore] Attempting to refresh stream URL for track:', track.id);
      try {
        const fresh = await getTrack(track.id);
        const freshUrl = (fresh as any).streamUrl as string | undefined;
        console.log('[AudioStore] Fresh URL obtained:', freshUrl);

        if (freshUrl && freshUrl !== audio.src) {
          console.log('[AudioStore] Setting refreshed source:', freshUrl);
          audio.src = freshUrl;
          await playAudioSafely(audio);
          set({ isPlaying: true });
        } else {
          console.error('[AudioStore] Fresh URL is same as the failed source or empty. Stopping playback for track:', track.id);
          audio.pause();
          audio.currentTime = 0;
          set({ isPlaying: false });
        }
      } catch (err) {
        console.error('[AudioStore] Failed to refresh stream URL. Stopping playback for track:', track.id, err);
        audio.pause();
        audio.currentTime = 0;
        set({ isPlaying: false });
      }
    };

    // Remove old listeners and attach new ones
    audio.removeEventListener('error', onError as any);
    audio.addEventListener('error', onError as any);

    // Also log when the resource is being loaded
    const onLoadStart = () => console.log('[AudioStore] loadstart event fired');
    const onCanPlay = () => console.log('[AudioStore] canplay event fired');
    const onLoadedMetadata = () => console.log('[AudioStore] loadedmetadata event fired, duration:', audio.duration);

    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    try {
      console.log('[AudioStore] Calling play()...');
      await playAudioSafely(audio);
      console.log('[AudioStore] Play successful');
    } catch (error) {
      console.error('[AudioStore] play() threw error:', error);
      set({ isPlaying: false });
      await onError();
    }
  },

  playNext: async () => {
    const state = get();

    if (state.currentPlaylist.length === 0 || state.currentIndex < 0) {
      return;
    }

    if (state.currentIndex < state.currentPlaylist.length - 1) {
      const nextIndex = state.currentIndex + 1;
      const nextTrack = state.currentPlaylist[nextIndex];
      await playTrackFromContext(nextTrack, state.currentPlaylist, nextIndex);
      return;
    }

    // Loop back to start
    await playTrackFromContext(state.currentPlaylist[0], state.currentPlaylist, 0);
  },

  playPrevious: async () => {
    const state = get();

    if (state.currentPlaylist.length === 0 || state.currentIndex < 0) {
      return;
    }

    if (state.currentIndex > 0) {
      const previousIndex = state.currentIndex - 1;
      const previousTrack = state.currentPlaylist[previousIndex];
      await playTrackFromContext(previousTrack, state.currentPlaylist, previousIndex);
      return;
    }

    // Stay at the beginning
    await playTrackFromContext(state.currentPlaylist[0], state.currentPlaylist, 0);
  },

  toggleShuffle: () => {
    const state = get();
    set({ isShuffleEnabled: !state.isShuffleEnabled });
  },

  forward: async () => {
    await get().playNext();
  },

  backward: async () => {
    await get().playPrevious();
  },

  pause: () => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
      set({ isPlaying: false });
    }
  },

  togglePlay: () => {
    const state = get();
    if (state.isPlaying) {
      state.pause?.();
    } else if (state.currentTrack) {
      // Resume playing - we'll need the streamUrl, so this might need adjustment
      // For now, just play the current audio element
      if (state.audioElement) {
        void playAudioSafely(state.audioElement).catch((err) => console.error('Error resuming playback:', err));
        set({ isPlaying: true });
      }
    }
  },

  toggleRepeat: () => {
    const state = get();
    set({ isRepeating: !state.isRepeating });
  },

  seek: (time: number) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.currentTime = Math.max(0, Math.min(time, state.duration));
      set({ currentTime: state.audioElement.currentTime });
    }
  },

  setVolume: (volume: number) => {
    const state = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (state.audioElement) {
      state.audioElement.volume = clampedVolume;
    }
    set({ volume: clampedVolume });
  },

  setCurrentTime: (time: number) => set({ currentTime: time }),

  setDuration: (duration: number) => set({ duration }),

  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),

  stop: () => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
      state.audioElement.currentTime = 0;
    }
    set({
      currentTrack: null,
      currentPlaylist: state.currentPlaylist,
      currentIndex: state.currentIndex,
      isPlaying: false,
      isRepeating: false,
      currentTime: 0,
      duration: 0,
    });
  },
}));

async function playTrackFromContext(track: Track, currentPlaylist: Track[], currentIndex: number): Promise<void> {
  const state = useAudioStore.getState();
  const audio = state.audioElement;

  if (!audio) {
    console.warn('Audio element not initialized');
    return;
  }

  const streamUrl = track.streamUrl;
  let refreshAttempted = false;

  if (state.currentTrack?.id !== track.id) {
    audio.pause();
    audio.currentTime = 0;
  }

  if (streamUrl && audio.src !== streamUrl) {
    audio.src = streamUrl;
  }

  useAudioStore.setState({
    currentTrack: track,
    currentPlaylist,
    currentIndex,
    isPlaying: true,
    duration: track.duration || 0,
    currentTime: 0,
  });

  const onError = async () => {
    if (refreshAttempted) {
      audio.pause();
      audio.currentTime = 0;
      useAudioStore.setState({ isPlaying: false });
      return;
    }

    refreshAttempted = true;

    try {
      const fresh = await getTrack(track.id);
      const freshUrl = fresh.streamUrl;

      if (freshUrl && freshUrl !== audio.src) {
        audio.src = freshUrl;
        await playAudioSafely(audio);
        useAudioStore.setState({ isPlaying: true });
        return;
      }
    } catch (error) {
      console.error('[AudioStore] context refresh failed:', error);
    }

    audio.pause();
    audio.currentTime = 0;
    useAudioStore.setState({ isPlaying: false });
  };

  audio.removeEventListener('error', onError as any);
  audio.addEventListener('error', onError as any);

  try {
    await playAudioSafely(audio);
  } catch (error) {
    console.error('[AudioStore] context playback failed:', error);
    await onError();
  }
}

function isIgnoredPlayError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('abort') && message.includes('user agent');
  }

  return false;
}

async function playAudioSafely(audio: HTMLMediaElement): Promise<void> {
  await audio.play().catch((error: unknown) => {
    if (isIgnoredPlayError(error)) {
      return;
    }

    throw error;
  });
}
