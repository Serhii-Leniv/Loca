import { ChevronLeft, MoreVertical, Play, Shuffle, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useCallback, useEffect, useState } from 'react';
import { getLikedTracks } from './services/tracks';
import { useAudioStore } from './stores/audioStore';
import type { Track, LikedTracksCollection } from './types';
import { formatCollectionDuration, formatDuration } from './utils/duration';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080';

function shuffleTracks(tracks: Track[]): Track[] {
  const copy = [...tracks];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function LikedSongs() {
<<<<<<< HEAD
  
=======

>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58
  const [likedCollection, setLikedCollection] = useState<LikedTracksCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setContextQueue } = useAudioStore();


  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLikedTracks();
        if (!cancelled) {
          setLikedCollection(data);
        }
      } catch (err) {
        console.error('Failed to load liked tracks:', err);
        if (!cancelled) {
          setError('Не вдалося завантажити вподобані треки');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const likedTracks = likedCollection?.tracks ?? [];
  const totalTracks = likedTracks.length;
  const totalDurationSeconds = likedCollection?.totalDurationSeconds ?? 0;

  const handlePlayAll = useCallback(async () => {
    if (likedTracks.length === 0) return;
    await setContextQueue(likedTracks, 0);
  }, [likedTracks, setContextQueue]);

  const handleShuffleAll = useCallback(async () => {
    if (likedTracks.length === 0) return;
    const shuffled = shuffleTracks(likedTracks);
    await setContextQueue(shuffled, 0);
  }, [likedTracks, setContextQueue]);

  const handlePlayTrackAt = useCallback(
    async (index: number) => {
      if (index < 0 || index >= likedTracks.length) return;
      await setContextQueue(likedTracks, index);
    },
    [likedTracks, setContextQueue]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Вподобані пісні</h1>
          <button type="button" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 mb-6">
        <div className="relative h-[280px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 shadow-2xl shadow-purple-900/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="mb-auto pt-8 flex items-center justify-center">
              <Heart className="w-20 h-20 text-white fill-white drop-shadow-2xl" />
            </div>
            <h2 className="text-[32px] font-bold text-white mb-2 drop-shadow-lg">Вподобані пісні</h2>
            <p className="text-[12px] text-gray-200 mb-1">
              {loading ? 'Завантаження…' : `${totalTracks} треків, ${formatCollectionDuration(totalDurationSeconds)}`}
            </p>
            <p className="text-[13px] text-gray-300">Твої улюблені треки в одному місці</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={loading || likedTracks.length === 0}
            onClick={() => void handlePlayAll()}
            className="flex-1 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 text-white fill-white" />
            <span className="text-[15px] font-medium text-white">Відтворити</span>
          </button>
          <button
            type="button"
            disabled={loading || likedTracks.length === 0}
            onClick={() => void handleShuffleAll()}
            className="h-14 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[15px] font-medium text-white">Shuffle</span>
          </button>
          <div className="w-14 h-14 rounded-full bg-white/5 border border-purple-400/30 flex items-center justify-center">
            <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
          </div>
        </div>
      </div>

      {error ? <p className="px-4 text-sm text-red-400 mb-4">{error}</p> : null}
      {loading ? <p className="px-4 text-sm text-gray-400 mb-4">Завантаження…</p> : null}
      {!loading && !error && likedTracks.length === 0 ? (
        <p className="px-4 text-sm text-gray-400 mb-4">Тут поки порожньо. Додай треки через сердечко в плеєрі.</p>
      ) : null}

<<<<<<< HEAD
      
=======

>>>>>>> 4a6c38e1e72d24eefd42104d6bb5fcf67e275b58

      <div className="px-4">
        <div className="space-y-2">
          {!loading &&
            likedTracks.map((song, index) => (
              <button
                key={song.id}
                type="button"
                onClick={() => void handlePlayTrackAt(index)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group text-left cursor-pointer"
              >
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] text-gray-400 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400 hidden group-hover:block" />
                </div>

                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={song.coverImageUrl || DEFAULT_COVER}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-[14px] font-medium text-white truncate">{song.title}</h4>
                  <p className="text-[12px] text-gray-400 truncate">{song.artistName}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[12px] text-gray-400">{formatDuration(song.duration)}</span>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="h-8" />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
