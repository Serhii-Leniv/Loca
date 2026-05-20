import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useInRouterContext, useLocation } from 'react-router';
import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ChevronsDown, Heart, Cloud, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from './stores/audioStore';
import { useAuth } from './context/AuthContext';
import { toggleTrackLike } from './services/tracks';
import { createMemory, getAllMemories, getMyMemory, type MemoryResponseDto } from './services/memories';

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function NowPlaying() {
  const inRouter = useInRouterContext();
  const location = useLocation();
  const isFullScreen = location.pathname === '/now-playing';

  const {
    currentTrack,
    isPlaying,
    isRepeating,
    isShuffleEnabled,
    currentTime,
    duration,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
    seek,
    setVolume,
    volume,
    playPrevious,
    playNext,
    syncTrackLikeInContext,
    isInitialized,
  } = useAudioStore();

  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const [memories, setMemories] = useState<MemoryResponseDto[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const cycleRef = useRef<number | null>(null);
  const [loadingMemories, setLoadingMemories] = useState(false);

  const [showMemoryInput, setShowMemoryInput] = useState(false);
  const [memoryDraft, setMemoryDraft] = useState('');
  const [myMemoryExists, setMyMemoryExists] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Array<{ id: string; name: string; createdAt: string; trackCount: number; coverImageUrls: string[]; containsTrack?: boolean | null }>>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistOpBusy, setPlaylistOpBusy] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsLiked(Boolean(currentTrack?.isLiked));
  }, [currentTrack?.id, currentTrack?.isLiked]);

  useEffect(() => {
    // close popover when track changes
    setShowSavePopover(false);
    setUserPlaylists([]);
  }, [currentTrack?.id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!currentTrack?.id) {
        setMemories([]);
        setVisibleIndex(0);
        setMyMemoryExists(false);
        if (cycleRef.current) window.clearInterval(cycleRef.current);
        cycleRef.current = null;
        return;
      }

      setLoadingMemories(true);
      try {
        const all = await getAllMemories(currentTrack.id);
        if (cancelled) return;
        setMemories(all || []);

        const my = await getMyMemory(currentTrack.id).catch(() => null);
        setMyMemoryExists(Boolean(my && my.content));

        if (all && all.length > 1) {
          // start cycling
          if (cycleRef.current) window.clearInterval(cycleRef.current);
          const initial = Math.floor(Math.random() * all.length);
          setVisibleIndex(initial);
          cycleRef.current = window.setInterval(() => {
            setVisibleIndex((prev) => {
              const choices = all.map((_, i) => i).filter((i) => i !== prev);
              return choices[Math.floor(Math.random() * choices.length)];
            });
          }, 10000);
        } else {
          if (cycleRef.current) window.clearInterval(cycleRef.current);
          cycleRef.current = null;
          setVisibleIndex(0);
        }
      } catch (err) {
        console.error('Failed to load memories', err);
        setMemories([]);
        if (cycleRef.current) window.clearInterval(cycleRef.current);
        cycleRef.current = null;
      } finally {
        if (!cancelled) setLoadingMemories(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (cycleRef.current) {
        window.clearInterval(cycleRef.current);
        cycleRef.current = null;
      }
    };
  }, [currentTrack?.id]);

  const handleToggleLike = useCallback(async () => {
    if (!currentTrack?.id || !isAuthenticated || likeBusy) return;
    setLikeBusy(true);
    try {
      const { isLiked: next } = await toggleTrackLike(currentTrack.id);
      setIsLiked(next);
      syncTrackLikeInContext(currentTrack.id, next);
    } catch (err) {
      console.error('toggle like failed', err);
    } finally {
      setLikeBusy(false);
    }
  }, [currentTrack?.id, isAuthenticated, likeBusy, syncTrackLikeInContext]);

  const loadUserPlaylists = useCallback(async (trackId?: string) => {
    if (!isAuthenticated) return;
    try {
      setLoadingPlaylists(true);
      const res = await import('./services/playlists').then((m) => m.getPlaylists(trackId));
      setUserPlaylists(res);
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setLoadingPlaylists(false);
    }
  }, [isAuthenticated]);

  const handleCreatePlaylist = useCallback(async () => {
    if (!newPlaylistName.trim()) return;
    try {
      setLoadingPlaylists(true);
      const created = await import('./services/playlists').then((m) => m.createPlaylist(newPlaylistName.trim()));
      setNewPlaylistName('');
      // reload playlists including contains flag for current track
      await loadUserPlaylists(currentTrack?.id);
    } catch (err) {
      console.error('create playlist failed', err);
    } finally {
      setLoadingPlaylists(false);
    }
  }, [newPlaylistName, loadUserPlaylists, currentTrack?.id]);

  const toggleTrackInPlaylist = useCallback(async (playlistId: string, contains?: boolean | null) => {
    if (!currentTrack?.id) return;
    setPlaylistOpBusy((s) => ({ ...s, [playlistId]: true }));
    try {
      if (contains) {
        await import('./services/playlists').then((m) => m.removeTrackFromPlaylist(playlistId, currentTrack.id));
      } else {
        await import('./services/playlists').then((m) => m.addTrackToPlaylist(playlistId, currentTrack.id));
      }
      // optimistic update in UI
      setUserPlaylists((list) => list.map((p) => (p.id === playlistId ? { ...p, containsTrack: !contains } : p)));
    } catch (err) {
      console.error('toggle track in playlist failed', err);
    } finally {
      setPlaylistOpBusy((s) => ({ ...s, [playlistId]: false }));
    }
  }, [currentTrack?.id]);

  const handleSubmitMemory = useCallback(async () => {
    if (!currentTrack?.id || !memoryDraft.trim() || myMemoryExists || submitting) return;
    setSubmitting(true);
    try {
      const created = await createMemory(currentTrack.id, memoryDraft.trim());
      setMemoryDraft('');
      setShowMemoryInput(false);
      setMyMemoryExists(true);
      // reload memories
      const all = await getAllMemories(currentTrack.id);
      setMemories(all || []);
    } catch (err) {
      console.error('submit memory failed', err);
    } finally {
      setSubmitting(false);
    }
  }, [currentTrack?.id, memoryDraft, myMemoryExists, submitting]);

  const trackTitle = currentTrack?.title ?? 'Unknown track';
  const trackArtist = currentTrack?.artistName ?? 'Unknown artist';
  const cover = currentTrack?.coverImageUrl ?? '';
  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const renderMemoryComposer = (positionClassName: string, panelWidthClassName: string) => (
    <div className={`absolute ${positionClassName} ${panelWidthClassName} z-50 pointer-events-none`}>
      <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#121212]/98 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <textarea
          value={memoryDraft}
          onChange={(e) => setMemoryDraft(e.target.value)}
          placeholder={myMemoryExists ? 'You already left a memory for this track' : 'Share your memory about this track'}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-purple-500/50"
          rows={4}
          disabled={myMemoryExists || submitting}
        />
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={() => { setShowMemoryInput(false); setMemoryDraft(''); }} className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10" disabled={submitting}>Cancel</button>
          <button onClick={handleSubmitMemory} className="rounded-full bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || myMemoryExists || !memoryDraft.trim()}>{submitting ? 'Submitting...' : myMemoryExists ? 'Saved' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );

  // Fullscreen layout
  if (!inRouter) return null;
  if (!isInitialized) return null;
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 h-[100dvh] overflow-hidden bg-black text-white">
        <div className="relative flex h-full flex-col px-4 py-6">
          <Link to="/home" className="absolute left-4 top-6 rounded-full bg-black/40 p-2">
            <ChevronsDown className="h-5 w-5 text-white" />
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden pb-8 pt-14">
            <img src={cover} alt={`${trackTitle} cover`} className="h-72 w-72 rounded-3xl object-cover shadow-2xl shadow-black/40" />

            <div className="w-full max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight">{trackTitle}</h2>
              <p className="mt-1 text-lg text-gray-300">{trackArtist}</p>

              <div className="relative mt-4 min-h-8">
                <AnimatePresence mode="wait">
                  {loadingMemories ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-400">
                      Loading memories...
                    </motion.div>
                  ) : memories.length > 1 ? (
                    <motion.div key={memories[visibleIndex]?.id ?? visibleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="text-sm text-gray-300">
                      “{memories[visibleIndex]?.content}”
                    </motion.div>
                  ) : memories.length === 1 ? (
                    <motion.div key={memories[0].id} initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="text-sm text-gray-300">
                      “{memories[0].content}”
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500">
                      Share your memory!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-5xl pb-2">
            <div className="relative mb-4 min-h-8 text-center">
              {showMemoryInput ? renderMemoryComposer('left-1/2 bottom-full mb-4 -translate-x-1/2', 'w-[min(92vw,34rem)]') : null}

              <AnimatePresence mode="wait">
                {loadingMemories ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-400">
                    Loading memories...
                  </motion.div>
                ) : memories.length > 1 ? (
                  <motion.div key={memories[visibleIndex]?.id ?? visibleIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="text-sm text-gray-300">
                    “{memories[visibleIndex]?.content}”
                  </motion.div>
                ) : memories.length === 1 ? (
                  <motion.div key={memories[0].id} initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="text-sm text-gray-300">
                    “{memories[0].content}”
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500">
                    Share your memory!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
              <div className="w-14 text-right">{formatTime(currentTime)}</div>

              <input
                type="range"
                min={0}
                max={duration > 0 ? duration : 0}
                step={0.1}
                value={duration > 0 ? currentTime : 0}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full max-w-2xl"
              />

              <div className="w-14 text-left">{formatTime(duration)}</div>
            </div>

            <div className="relative mt-6 flex items-center">
              <div className="flex-1 flex justify-end items-center gap-4">
                <button onClick={() => setShowMemoryInput((s) => !s)} className={`p-2 rounded-full ${showMemoryInput ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`} title="Add memory"><Cloud className="h-6 w-6" /></button>
                <button onClick={toggleShuffle} className={`p-2 rounded-full ${isShuffleEnabled ? 'bg-white/10 text-purple-300' : 'text-white'}`}><Shuffle className="h-6 w-6" /></button>
                <button onClick={playPrevious} className="p-2 rounded-full text-white"><SkipBack className="h-8 w-8" /></button>
              </div>

              <div className="mx-6 flex items-center justify-center">
                <button onClick={togglePlay} className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-black/30">{isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</button>
              </div>

              <div className="flex-1 flex justify-start items-center gap-4">
                <button onClick={playNext} className="p-2 rounded-full text-white"><SkipForward className="h-8 w-8" /></button>
                <button onClick={handleToggleLike} disabled={likeBusy} className={`p-2 rounded-full ${isAuthenticated ? (isLiked ? 'bg-white/10 text-purple-300' : 'text-white') : 'text-white/30'}`}><Heart className="h-6 w-6" /></button>
                <button onClick={toggleRepeat} className={`p-2 rounded-full ${isRepeating ? 'bg-white/10 text-purple-300' : 'text-white'}`}><Repeat className="h-6 w-6" /></button>
                <div className="relative">
                  <button onClick={async () => { setShowSavePopover((s) => !s); if (!showSavePopover) await loadUserPlaylists(currentTrack?.id); }} className="p-2 rounded-full text-white" title="Save to playlist">
                    <span className="relative inline-flex h-6 w-6 items-center justify-center">
                      <Cloud className="h-6 w-6" />
                      <Plus className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-black/80 p-0.5 text-white" />
                    </span>
                  </button>
                  <AnimatePresence>
                    {showSavePopover && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0b0b0b] border border-white/10 shadow-2xl p-3 z-50">
                        <div className="mb-2 flex items-center gap-2">
                          <input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Нова назва плейлиста" className="flex-1 rounded-lg bg-white/5 border border-white/10 p-2 text-sm text-white outline-none" />
                          <button onClick={handleCreatePlaylist} className="rounded-full bg-purple-600 px-3 py-1 text-sm text-white">Create</button>
                        </div>
                        <div className="max-h-56 overflow-auto">
                          {loadingPlaylists ? <div className="text-sm text-gray-400">Завантаження…</div> : userPlaylists.length === 0 ? <div className="text-sm text-gray-400">Немає плейлистів</div> : userPlaylists.map((p) => (
                            <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10">
                                  <img src={p.coverImageUrls?.[0] ?? ''} alt="cover" className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div>
                                  <div className="text-sm text-white">{p.name}</div>
                                  <div className="text-xs text-gray-400">{p.trackCount} треків</div>
                                </div>
                              </div>
                              <div>
                                <button disabled={Boolean(playlistOpBusy[p.id])} onClick={() => void toggleTrackInPlaylist(p.id, p.containsTrack)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                                  <AnimatePresence mode="wait">
                                    {p.containsTrack ? (
                                      <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Check className="w-4 h-4 text-green-400" /></motion.span>
                                    ) : (
                                      <motion.span key="plus" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Plus className="w-4 h-4 text-white" /></motion.span>
                                    )}
                                  </AnimatePresence>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <Volume2 className="h-5 w-5 text-gray-300" />
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-48" />
            </div>
          </div>

        </div>
      </div>
    );
  }

  // mini player
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-3 overflow-visible">
      <div className="relative mx-auto max-w-4xl overflow-visible rounded-2xl border border-white/15 bg-[#121212]/95 backdrop-blur-md shadow-2xl">
        {showMemoryInput ? renderMemoryComposer('right-3 bottom-full mb-3', 'w-[min(92vw,24rem)]') : null}

        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/now-playing" className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-white">{trackTitle}</p>
            <p className="truncate text-[12px] text-gray-400">{trackArtist}</p>
            {memories.length > 0 ? <p className="truncate text-[11px] text-gray-500">“{memories[visibleIndex]?.content ?? ''}”</p> : null}
          </Link>

          <div className="text-[11px] text-gray-400 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</div>

          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <button onClick={handleToggleLike} disabled={likeBusy} className={`h-9 w-9 rounded-full flex items-center justify-center ${isLiked ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}><Heart className="h-5 w-5" /></button>
            ) : (
              <span className="h-9 w-9" />
            )}

            <button onClick={() => setShowMemoryInput((s) => !s)} className="h-9 w-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white" title="Add a memory"><Cloud className="h-5 w-5" /></button>
            <div className="relative">
              <button onClick={async () => { setShowSavePopover((s) => !s); if (!showSavePopover) await loadUserPlaylists(currentTrack?.id); }} className="h-9 w-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white" title="Save to playlist">
                <span className="relative inline-flex h-5 w-5 items-center justify-center">
                  <Cloud className="h-5 w-5" />
                  <Plus className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-[#121212] p-0.5 text-white" />
                </span>
              </button>
              <AnimatePresence>
                {showSavePopover && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 bottom-full mb-2 w-72 rounded-2xl bg-[#0b0b0b] border border-white/10 shadow-2xl p-3 z-50">
                    <div className="mb-2 flex items-center gap-2">
                      <input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Нова назва плейлиста" className="flex-1 rounded-lg bg-white/5 border border-white/10 p-2 text-sm text-white outline-none" />
                      <button onClick={handleCreatePlaylist} className="rounded-full bg-purple-600 px-3 py-1 text-sm text-white">Create</button>
                    </div>
                    <div className="max-h-56 overflow-auto">
                      {loadingPlaylists ? <div className="text-sm text-gray-400">Завантаження…</div> : userPlaylists.length === 0 ? <div className="text-sm text-gray-400">Немає плейлистів</div> : userPlaylists.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10">
                              <img src={p.coverImageUrls?.[0] ?? ''} alt="cover" className="w-full h-full object-cover rounded-md" />
                            </div>
                            <div>
                              <div className="text-sm text-white">{p.name}</div>
                              <div className="text-xs text-gray-400">{p.trackCount} треків</div>
                            </div>
                          </div>
                          <div>
                            <button disabled={Boolean(playlistOpBusy[p.id])} onClick={() => void toggleTrackInPlaylist(p.id, p.containsTrack)} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                              <AnimatePresence mode="wait">
                                {p.containsTrack ? (
                                  <motion.span key="check-mini" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Check className="w-4 h-4 text-green-400" /></motion.span>
                                ) : (
                                  <motion.span key="plus-mini" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}><Plus className="w-4 h-4 text-white" /></motion.span>
                                )}
                              </AnimatePresence>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={togglePlay} className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center">
            {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
          </button>
        </div>

        <div className="block h-1.5 w-full overflow-hidden rounded-b-2xl bg-white/10">
          <span className="block h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: `${progressPercent}%` }} />
        </div>

      </div>
    </div>
  );
}
