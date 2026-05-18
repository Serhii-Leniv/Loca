import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useInRouterContext, useLocation } from 'react-router';
import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ChevronsDown, Heart, Cloud } from 'lucide-react';
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
  if (!useInRouterContext()) return null;
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

  useEffect(() => {
    setIsLiked(Boolean(currentTrack?.isLiked));
  }, [currentTrack?.id, currentTrack?.isLiked]);

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

  // Fullscreen layout
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white overflow-auto">
        <div className="relative min-h-screen flex flex-col items-center justify-start pt-12 px-4">
          <Link to="/home" className="absolute left-4 top-6 rounded-full bg-black/40 p-2">
            <ChevronsDown className="h-5 w-5 text-white" />
          </Link>

          <img src={cover} alt={`${trackTitle} cover`} className="w-72 h-72 rounded-2xl object-cover shadow-2xl" />

          <div className="text-center mt-6 max-w-2xl">
            <h2 className="text-3xl font-extrabold">{trackTitle}</h2>
            <p className="mt-1 text-lg text-gray-300">{trackArtist}</p>

            <div className="mt-4">
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

            {/* memory input area (toggled by cloud icon) */}
            <div className={`mt-4 w-full transition-all ${showMemoryInput ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <textarea value={memoryDraft} onChange={(e) => setMemoryDraft(e.target.value)} placeholder={myMemoryExists ? 'You already left a memory for this track' : 'Share your memory about this track'} className="w-full bg-white/5 rounded p-2 text-sm text-white" rows={3} disabled={myMemoryExists || submitting} />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => { setShowMemoryInput(false); setMemoryDraft(''); }} className="px-3 py-1 rounded bg-white/5" disabled={submitting}>Cancel</button>
                <button onClick={handleSubmitMemory} className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 transition-transform" disabled={submitting || myMemoryExists || !memoryDraft.trim()}>{submitting ? 'Submitting...' : myMemoryExists ? 'Saved' : 'Submit'}</button>
              </div>
            </div>

          </div>

          <div className="w-full max-w-2xl mt-8 px-4">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <div className="w-14 text-right">{formatTime(currentTime)}</div>

              <input type="range" min={0} max={duration > 0 ? duration : 0} step={0.1} value={duration > 0 ? currentTime : 0} onChange={(e) => seek(Number(e.target.value))} className="flex-1 mx-4" />

              <div className="w-14 text-left">{formatTime(duration)}</div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6">
              <button onClick={toggleShuffle} className={`p-2 rounded ${isShuffleEnabled ? 'bg-white/10 text-purple-300' : 'text-white'}`}><Shuffle className="h-6 w-6" /></button>
              <button onClick={playPrevious} className="p-2 rounded"><SkipBack className="h-8 w-8" /></button>

              <button onClick={togglePlay} className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg">{isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</button>

              <button onClick={playNext} className="p-2 rounded"><SkipForward className="h-8 w-8" /></button>

              {isAuthenticated ? (
                <>
                  <button onClick={handleToggleLike} disabled={likeBusy} className={`p-2 rounded ${isLiked ? 'bg-white/10 text-purple-300' : 'text-white'}`}><Heart className="h-6 w-6" /></button>
                  <button onClick={() => setShowMemoryInput(s => !s)} className={`p-2 rounded ${showMemoryInput ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`} title="Add memory"><Cloud className="h-6 w-6" /></button>
                </>
              ) : null}

              <button onClick={toggleRepeat} className={`p-2 rounded ${isRepeating ? 'bg-white/10 text-purple-300' : 'text-white'}`}><Repeat className="h-6 w-6" /></button>
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
    <div className="fixed bottom-20 left-0 right-0 z-40 px-3">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#121212]/95 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/now-playing" className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-white">{trackTitle}</p>
            <p className="truncate text-[12px] text-gray-400">{trackArtist}</p>
            {memories.length > 0 ? <p className="truncate text-[11px] text-gray-500">“{memories[visibleIndex]?.content ?? ''}”</p> : null}
          </Link>

          <div className="text-[11px] text-gray-400 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</div>

          {isAuthenticated ? (
            <button onClick={handleToggleLike} disabled={likeBusy} className={`h-9 w-9 rounded-full flex items-center justify-center ${isLiked ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}><Heart className="h-5 w-5" /></button>
          ) : null}

          <div className="ml-2">
            <button onClick={() => setShowMemoryInput(s => !s)} className={`h-9 w-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white`} title="Add a memory"><Cloud className="h-5 w-5" /></button>
          </div>

          <button onClick={togglePlay} className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center">
            {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
          </button>
        </div>

        <div className="block h-1.5 w-full overflow-hidden rounded-b-2xl bg-white/10">
          <span className="block h-full bg-gradient-to-r from-purple-500 to-purple-400" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ${showMemoryInput ? 'max-h-80 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}>
          <div className="mt-2 px-3">
            <textarea value={memoryDraft} onChange={(e) => setMemoryDraft(e.target.value)} placeholder={myMemoryExists ? 'You already left a memory for this track' : 'Share your memory about this track'} className="w-full rounded-md bg-white/5 p-2 text-sm text-white resize-none" rows={3} disabled={myMemoryExists || submitting} />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button onClick={() => { setShowMemoryInput(false); setMemoryDraft(''); }} className="px-3 py-1 rounded bg-white/5" disabled={submitting}>Cancel</button>
              <button onClick={handleSubmitMemory} className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500" disabled={submitting || myMemoryExists || !memoryDraft.trim()}>{submitting ? 'Submitting...' : myMemoryExists ? 'Saved' : 'Submit'}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
