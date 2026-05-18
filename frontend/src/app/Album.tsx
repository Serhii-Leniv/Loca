import { ChevronLeft, MoreVertical, Play, Shuffle, Heart, Plus, Download, Share2, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { getAlbumTracks } from './services/albums';
import { useAudioStore } from './stores/audioStore';
import { AlbumDetail, TrackWithStreaming } from './types';
import { formatCollectionDuration, formatDuration } from './utils/duration';

export default function Album() {
  const { albumName } = useParams();
  const { setContextQueue } = useAudioStore();
  const [isLiked, setIsLiked] = useState(false);
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAlbum() {
      if (!albumName) {
        setIsLoading(false);
        setError('Оберіть альбом, щоб переглянути треки.');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getAlbumTracks(albumName);
        if (isMounted) {
          setAlbum(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Не вдалося завантажити альбом');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAlbum();

    return () => {
      isMounted = false;
    };
  }, [albumName]);

  const tracks = useMemo(() => album?.tracks ?? [], [album]);

  const handlePlayTrack = async (track: TrackWithStreaming) => {
    const trackIndex = tracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      await setContextQueue(tracks, trackIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library/albums" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="px-4 py-10 text-center text-gray-400">Завантаження альбому...</div>
      ) : error ? (
        <div className="px-4 py-10">
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">{error}</div>
        </div>
      ) : album ? (
        <>
          <div className="px-4 mt-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-600/40 blur-3xl rounded-3xl scale-95"></div>
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <ImageWithFallback
                    src={album.coverImageUrl ?? ''}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center w-full px-4">
                <h1 className="text-[28px] font-bold text-white mb-2">{album.title}</h1>
                <Link to="/library" className="inline-block mb-3">
                  <p className="text-[15px] text-gray-300 hover:text-white transition-colors">
                    {album.artistName}
                  </p>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 mb-4">
                  <span>{album.createdAt ? new Date(album.createdAt).getFullYear() : '—'}</span>
                  <span>•</span>
                  <span>Альбом</span>
                  <span>•</span>
                  <span>{tracks.length} треків, {formatCollectionDuration(album.totalDurationSeconds ?? 0)}</span>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed max-w-md mx-auto">
                  Треки згруповані за тегом Album у файлах, тому тут показано реальний вміст бібліотеки.
                </p>
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
              <button className="h-14 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200">
                <Shuffle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isLiked
                    ? 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}>
                  <Heart className={`w-5 h-5 transition-all duration-300 ${
                    isLiked
                      ? 'text-purple-400 fill-purple-400 scale-110'
                      : 'text-gray-400 group-hover:text-purple-400'
                  }`} />
                </div>
                <span className={`text-[11px] transition-colors duration-300 ${
                  isLiked ? 'text-purple-400' : 'text-gray-400'
                }`}>
                  {isLiked ? 'Вподобано' : 'Вподобати'}
                </span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="text-[11px] text-gray-400">Додати</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="text-[11px] text-gray-400">Завантажити</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="text-[11px] text-gray-400">Поділитись</span>
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
              {tracks.map((track, index) => (
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
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-normal text-white truncate">{track.title}</h4>
                      {track.artistName ? <MessageCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> : null}
                      {index === 0 ? <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> : null}
                    </div>
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
              ))}
            </div>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-[18px] font-semibold text-white mb-4">Про альбом</h3>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Назва</span>
                  <span className="text-white">{album.title}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Виконавець</span>
                  <span className="text-white">{album.artistName}</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Треків</span>
                  <span className="text-white">{tracks.length}</span>
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
