import { ChevronLeft, MoreVertical, Play, Shuffle, Heart, Download, Share2, Clock, Music } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getPlaylistById } from './services/playlists';
import { useAudioStore } from './stores/audioStore';
import PlaylistCover from './components/PlaylistCover';
import { formatDuration } from './utils/duration';

type Track = {
  id: string;
  title: string;
  artistName: string;
  duration: number;
  coverImageUrl: string;
  isLiked?: boolean;
};

type PlaylistDetail = {
  id: string;
  name: string;
  createdAt: string;
  trackCount: number;
  coverImageUrls: string[];
  tracks: Track[];
};

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setContextQueue } = useAudioStore();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlaylist() {
      if (!id) {
        setIsLoading(false);
        setError('Плейлист не знайдено.');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getPlaylistById(id);
        if (isMounted) {
          setPlaylist(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити плейлист');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPlaylist();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const tracks = useMemo(() => playlist?.tracks ?? [], [playlist]);
  const totalDuration = useMemo(() => tracks.reduce((sum, t) => sum + (t.duration || 0), 0), [tracks]);

  const handlePlayTrack = async (track: Track) => {
    const trackIndex = tracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      await setContextQueue(tracks as any, trackIndex);
    }
  };

  const handleShufflePlay = async () => {
    if (tracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    await setContextQueue(tracks as any, randomIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 py-10 text-center text-gray-400">Завантаження плейлиста...</div>
      ) : error ? (
        <div className="px-4 py-10">
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{error}</div>
        </div>
      ) : playlist ? (
        <>
          <div className="px-4 mt-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-600/40 blur-3xl rounded-3xl scale-95"></div>
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/10 flex items-center justify-center flex-shrink-0">
                  {playlist.coverImageUrls && playlist.coverImageUrls.length > 0 ? (
                    <PlaylistCover coverImageUrls={playlist.coverImageUrls} sizeClass="w-64 h-64" />
                  ) : (
                    <Music className="w-16 h-16 text-white/30" />
                  )}
                </div>
              </div>

              <div className="text-center w-full px-4">
                <h1 className="text-[28px] font-bold text-white mb-2">{playlist.name}</h1>
                <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 mb-4">
                  <span>{playlist.createdAt ? new Date(playlist.createdAt).getFullYear() : '—'}</span>
                  <span>•</span>
                  <span>Плейлист</span>
                  <span>•</span>
                  <span>{tracks.length} треків</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => tracks[0] && void handlePlayTrack(tracks[0])}
                className="flex-1 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-5 h-5 text-white fill-white" />
                <span className="text-[15px] font-medium text-white">Відтворити</span>
              </button>
              <button className="h-14 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200" onClick={() => void handleShufflePlay()}>
                <Shuffle className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="px-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 mb-3">
              <span className="w-6 text-[11px] text-gray-500 text-center">#</span>
              <span className="flex-1 text-[11px] text-gray-500 uppercase tracking-wide">Назва</span>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>

            <div className="space-y-1">
              {tracks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Плейлист порожній</div>
              ) : (
                tracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => void handlePlayTrack(track)}
                    className="w-full rounded-lg bg-transparent hover:bg-white/5 p-3 flex items-center gap-3 transition-all duration-200 group text-left"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-[13px] text-gray-400 group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 text-white fill-white hidden group-hover:block" />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[14px] font-normal text-white truncate">{track.title}</h4>
                      <p className="text-[12px] text-gray-400 truncate">{track.artistName}</p>
                    </div>

                    <span className="text-[13px] text-gray-400 flex-shrink-0">{formatDuration(track.duration)}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-[18px] font-semibold text-white mb-4">Про плейлист</h3>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Назва</span>
                  <span className="text-white">{playlist.name}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Треків</span>
                  <span className="text-white">{tracks.length}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Загальна тривалість</span>
                  <span className="text-white">{Math.floor(totalDuration / 60)} хв</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="h-8"></div>
    </div>
  );
}
