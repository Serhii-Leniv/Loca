import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Track } from '../types';
import { getTrack } from '../services/tracks';

export interface AudioState {
    currentTrack: Track | null;
    currentPlaylist: Track[];
    currentIndex: number;
    isShuffleEnabled: boolean;
    isPlaying: boolean;
    isInitialized: boolean;
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
    setIsInitialized: (initialized: boolean) => void;
    stop: () => void;
    syncTrackLikeInContext: (trackId: string, isLiked: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            currentTrack: null,
            currentPlaylist: [],
            currentIndex: -1,
            isShuffleEnabled: false,
            isPlaying: false,
            isInitialized: false,
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

                if (startIndex < 0 || startIndex >= tracks.length) {
                    console.warn('Invalid startIndex:', startIndex);
                    return;
                }

                const trackToPlay = tracks[startIndex];
                const streamUrl = (trackToPlay as any).streamUrl;

                if (state.currentTrack?.id !== trackToPlay.id) {
                    audio.pause();
                    audio.currentTime = 0;
                }

                if (streamUrl && audio.src !== streamUrl) {
                    audio.src = streamUrl;
                }

                set({
                    currentTrack: trackToPlay,
                    currentPlaylist: tracks,
                    currentIndex: startIndex,
                    isPlaying: true,
                    duration: trackToPlay.duration || 0,
                    currentTime: 0,
                });

                let refreshAttempted = false;
                const onError = async () => {
                    if (refreshAttempted) {
                        audio.pause();
                        set({ isPlaying: false });
                        return;
                    }
                    refreshAttempted = true;

                    try {
                        const fresh = await getTrack(trackToPlay.id);
                        const freshUrl = (fresh as any).streamUrl as string | undefined;

                        if (freshUrl && freshUrl !== audio.src) {
                            audio.src = freshUrl;
                            await playAudioSafely(audio);
                            set({ isPlaying: true });
                        } else {
                            audio.pause();
                            set({ isPlaying: false });
                        }
                    } catch (err) {
                        audio.pause();
                        set({ isPlaying: false });
                    }
                };

                audio.removeEventListener('error', onError as any);
                audio.addEventListener('error', onError as any);

                try {
                    await playAudioSafely(audio);
                } catch (error) {
                    set({ isPlaying: false });
                    await onError();
                }
            },

            play: async (track: Track, streamUrl?: string) => {
                const state = get();
                const audio = state.audioElement;

                if (!audio) return;

                const nextPlaylist = state.currentIndex >= 0 && state.currentPlaylist.length > 0
                    ? [...state.currentPlaylist.slice(0, Math.max(state.currentIndex + 1, 0)), track]
                    : [track];
                const nextIndex = nextPlaylist.length - 1;

                if (state.currentTrack?.id !== track.id) {
                    audio.pause();
                    audio.currentTime = 0;
                }

                let urlToUse = streamUrl || (track as any).streamUrl;

                if (urlToUse && audio.src !== urlToUse) {
                    audio.src = urlToUse;
                }

                set({
                    currentTrack: track,
                    currentPlaylist: nextPlaylist,
                    currentIndex: nextIndex,
                    isPlaying: true,
                    duration: track.duration || 0,
                    currentTime: 0,
                });

                let refreshAttempted = false;
                const onError = async () => {
                    if (refreshAttempted) {
                        audio.pause();
                        set({ isPlaying: false });
                        return;
                    }
                    refreshAttempted = true;

                    try {
                        const fresh = await getTrack(track.id);
                        const freshUrl = (fresh as any).streamUrl as string | undefined;

                        if (freshUrl && freshUrl !== audio.src) {
                            audio.src = freshUrl;
                            await playAudioSafely(audio);
                            set({ isPlaying: true });
                        } else {
                            audio.pause();
                            set({ isPlaying: false });
                        }
                    } catch (err) {
                        audio.pause();
                        set({ isPlaying: false });
                    }
                };

                audio.removeEventListener('error', onError as any);
                audio.addEventListener('error', onError as any);

                try {
                    await playAudioSafely(audio);
                } catch (error) {
                    set({ isPlaying: false });
                    await onError();
                }
            },

            playNext: async () => {
                const state = get();

                if (state.currentPlaylist.length === 0 || state.currentIndex < 0) {
                    return;
                }

                if (state.isShuffleEnabled) {
                    if (state.currentPlaylist.length === 1) {
                        await playTrackFromContext(state.currentPlaylist[0], state.currentPlaylist, 0);
                        return;
                    }

                    const indices = state.currentPlaylist.map((_, i) => i).filter((i) => i !== state.currentIndex);
                    const rand = indices[Math.floor(Math.random() * indices.length)];
                    const nextTrack = state.currentPlaylist[rand];
                    await playTrackFromContext(nextTrack, state.currentPlaylist, rand);
                    return;
                }

                if (state.currentIndex < state.currentPlaylist.length - 1) {
                    const nextIndex = state.currentIndex + 1;
                    const nextTrack = state.currentPlaylist[nextIndex];
                    await playTrackFromContext(nextTrack, state.currentPlaylist, nextIndex);
                    return;
                }

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

                await playTrackFromContext(state.currentPlaylist[0], state.currentPlaylist, 0);
            },

            toggleShuffle: () => set((state) => ({ isShuffleEnabled: !state.isShuffleEnabled })),
            forward: async () => await get().playNext(),
            backward: async () => await get().playPrevious(),
            pause: () => {
                get().audioElement?.pause();
                set({ isPlaying: false });
            },
            togglePlay: () => {
                const state = get();
                if (state.isPlaying) {
                    state.pause();
                } else {
                    state.audioElement?.play().catch(console.error);
                    set({ isPlaying: true });
                }
            },
            toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),
            seek: (time: number) => {
                const { audioElement } = get();
                if (audioElement) audioElement.currentTime = time;
                set({ currentTime: time });
            },
            setVolume: (volume: number) => {
                const { audioElement } = get();
                if (audioElement) audioElement.volume = volume;
                set({ volume });
            },
            setCurrentTime: (time: number) => set({ currentTime: time }),
            setDuration: (duration: number) => set({ duration }),
            setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
            setIsInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
            stop: () => {
                const state = get();
                if (state.audioElement) {
                    state.audioElement.pause();
                    state.audioElement.currentTime = 0;
                }
                set({ currentTrack: null, isPlaying: false, currentTime: 0 });
            },
            syncTrackLikeInContext: (trackId, isLiked) => set((state) => ({
                currentTrack: state.currentTrack?.id === trackId ? { ...state.currentTrack, isLiked } : state.currentTrack,
                currentPlaylist: state.currentPlaylist.map((t) => (t.id === trackId ? { ...t, isLiked } : t))
            })),
        }),
        {
            name: 'loca.audioState.v1',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentTrack: state.currentTrack,
                currentPlaylist: state.currentPlaylist,
                currentIndex: state.currentIndex,
                currentTime: state.currentTime,
                isShuffleEnabled: state.isShuffleEnabled,
                isRepeating: state.isRepeating,
                volume: state.volume,
            }),
        }
    )
);

// Helper functions
async function playTrackFromContext(track: Track, currentPlaylist: Track[], currentIndex: number): Promise<void> {
    const state = useAudioStore.getState();
    if (!state.audioElement) return;
    state.audioElement.src = (track as any).streamUrl;
    useAudioStore.setState({ currentTrack: track, currentPlaylist, currentIndex, isPlaying: true });
    await playAudioSafely(state.audioElement);
}

async function playAudioSafely(audio: HTMLMediaElement): Promise<void> {
    try {
        await audio.play();
    } catch (err) {
        console.error("Помилка відтворення:", err);
    }
}