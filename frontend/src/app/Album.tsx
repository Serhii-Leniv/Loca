import { ChevronLeft, MoreVertical, Play, Shuffle, Heart, Plus, Download, Share2, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { getAlbumById, type AlbumWithTracksResponseDto } from './services/albums';

export default function Album() {
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get('id');
  const [isLiked, setIsLiked] = useState(false);
  const [album, setAlbum] = useState<AlbumWithTracksResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (albumId) {
      getAlbumById(albumId)
        .then(setAlbum)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [albumId]);

  // Mock listener memories
  const listenerMemories = [
    {
      id: 1,
      user: 'Марія К.',
      track: 'Вечірня казка',
      memory: 'Ця пісня звучала на нашому весіллі в Карпатах. Ми танцювали під неї біля вогнища...',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      user: 'Тарас П.',
      track: 'Трембіта гуде',
      memory: 'Слухав цей альбом під час походу на Говерлу. Неймовірні емоції!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 mb-4">Альбом не знайдено</p>
        <Link to="/home" className="text-purple-400 hover:underline">Повернутися додому</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Album Cover Section */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex flex-col items-center">
          {/* Album Cover with Glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-600/40 blur-3xl rounded-3xl scale-95"></div>
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <ImageWithFallback
                src={album.coverImageUrl || ''}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Album Info */}
          <div className="text-center w-full px-4">
            <h1 className="text-[28px] font-bold text-white mb-2">{album.title}</h1>
            <p className="text-[15px] text-gray-300 mb-3">{album.artistName}</p>
            <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 mb-4">
              <span>{new Date(album.createdAt).getFullYear()}</span>
              <span>•</span>
              <span>{album.tracks.length} треків</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button className="flex-1 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
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

      {/* Track List */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 mb-3">
          <span className="w-6 text-[11px] text-gray-500 text-center">#</span>
          <span className="flex-1 text-[11px] text-gray-500 uppercase tracking-wide">Назва</span>
          <Clock className="w-4 h-4 text-gray-500" />
        </div>

        <div className="space-y-1">
          {album.tracks.map((track, index) => (
            <Link
              to={`/now-playing?id=${track.id}`}
              key={track.id}
              className="w-full rounded-lg bg-transparent hover:bg-white/5 p-3 flex items-center gap-3 transition-all duration-200 group"
            >
              {/* Track Number */}
              <div className="w-6 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] text-gray-400 group-hover:hidden">{index + 1}</span>
                <Play className="w-4 h-4 text-white fill-white hidden group-hover:block" />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-normal text-white truncate">{track.title}</h4>
                </div>
              </div>

              {/* Duration */}
              <span className="text-[13px] text-gray-400 flex-shrink-0">{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>

              {/* More Options */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Album Legend Section */}
      <div className="px-4 mb-6">
        <h3 className="text-[18px] font-semibold text-white mb-4">Легенда альбому</h3>
        <div className="rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
              <ImageWithFallback
                src={album.coverImageUrl || ''}
                alt={album.artistName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-amber-400 font-medium uppercase tracking-wide">Від виконавця</span>
              </div>
              <p className="text-[15px] font-medium text-white">{album.artistName}</p>
            </div>
          </div>
          <p className="text-[13px] text-gray-300 leading-relaxed">
            "Цей альбом ми записували з особливим натхненням. Сподіваємося, ви відчуєте ту атмосферу, яку ми заклали в кожну ноту."
          </p>
        </div>
      </div>

      {/* Listener Memories Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-semibold text-white">Спогади слухачів</h3>
          <button className="text-[13px] text-purple-400 hover:text-purple-300 transition-colors">
            Показати всі
          </button>
        </div>
        <div className="space-y-3">
          {listenerMemories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={memory.avatar}
                    alt={memory.user}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-white mb-0.5">{memory.user}</p>
                  <p className="text-[12px] text-purple-400">Про трек "{memory.track}"</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-300 leading-relaxed">{memory.memory}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Album Section */}
      <div className="px-4 mb-6">
        <h3 className="text-[18px] font-semibold text-white mb-3">Про альбом</h3>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Дата виходу</span>
              <span className="text-white">{new Date(album.createdAt).toLocaleDateString('uk-UA')}</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Виконавець</span>
              <span className="text-white">{album.artistName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
