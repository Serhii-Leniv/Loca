import { ChevronLeft, MoreVertical, Play, Shuffle, Heart, Plus, Download, Share2, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function Album() {
  const [isLiked, setIsLiked] = useState(false);
  // Mock album data
  const album = {
    title: 'Карпатські історії',
    artist: 'Сестри Тельнюк',
    year: 2025,
    genre: 'Інді-фолк',
    trackCount: 12,
    duration: '48 хв',
    cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Музичний альбом, що переплітає автентичні карпатські мелодії з сучасним інді-звучанням. Кожна пісня — це окрема історія про життя в горах.',
  };

  // Mock track list
  const tracks = [
    {
      id: 1,
      number: 1,
      title: 'Ранок у горах',
      duration: '3:45',
      hasMemory: true,
    },
    {
      id: 2,
      number: 2,
      title: 'Вечірня казка',
      duration: '4:12',
      hasLegend: true,
    },
    {
      id: 3,
      number: 3,
      title: 'Полонина',
      duration: '3:58',
    },
    {
      id: 4,
      number: 4,
      title: 'Трембіта гуде',
      duration: '4:23',
      hasMemory: true,
      hasLegend: true,
    },
    {
      id: 5,
      number: 5,
      title: 'Гуцульські ритми',
      duration: '3:35',
    },
    {
      id: 6,
      number: 6,
      title: 'Водограй',
      duration: '4:48',
      hasMemory: true,
    },
    {
      id: 7,
      number: 7,
      title: 'Зелена діброва',
      duration: '3:52',
    },
    {
      id: 8,
      number: 8,
      title: 'Перевал',
      duration: '4:15',
      hasLegend: true,
    },
    {
      id: 9,
      number: 9,
      title: 'Ліс шепоче',
      duration: '3:28',
    },
    {
      id: 10,
      number: 10,
      title: 'Місячна ніч',
      duration: '5:02',
      hasMemory: true,
    },
    {
      id: 11,
      number: 11,
      title: 'Дорога додому',
      duration: '4:35',
    },
    {
      id: 12,
      number: 12,
      title: 'Карпати мої',
      duration: '4:58',
      hasLegend: true,
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
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
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Album Info */}
          <div className="text-center w-full px-4">
            <h1 className="text-[28px] font-bold text-white mb-2">{album.title}</h1>
            <Link to="/artist" className="inline-block mb-3">
              <p className="text-[15px] text-gray-300 hover:text-white transition-colors">
                {album.artist}
              </p>
            </Link>
            <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 mb-4">
              <span>{album.year}</span>
              <span>•</span>
              <span>{album.genre}</span>
              <span>•</span>
              <span>{album.trackCount} треків</span>
              <span>•</span>
              <span>{album.duration}</span>
            </div>
            <p className="text-[13px] text-gray-400 leading-relaxed max-w-md mx-auto">
              {album.description}
            </p>
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
          {tracks.map((track) => (
            <Link
              to="/now-playing"
              key={track.id}
              className="w-full rounded-lg bg-transparent hover:bg-white/5 p-3 flex items-center gap-3 transition-all duration-200 group"
            >
              {/* Track Number */}
              <div className="w-6 flex items-center justify-center flex-shrink-0">
                <span className="text-[13px] text-gray-400 group-hover:hidden">{track.number}</span>
                <Play className="w-4 h-4 text-white fill-white hidden group-hover:block" />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-normal text-white truncate">{track.title}</h4>
                  {track.hasMemory && (
                    <MessageCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  )}
                  {track.hasLegend && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Duration */}
              <span className="text-[13px] text-gray-400 flex-shrink-0">{track.duration}</span>

              {/* More Options */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
                src={album.cover}
                alt={album.artist}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] text-amber-400 font-medium uppercase tracking-wide">Від виконавця</span>
              </div>
              <p className="text-[15px] font-medium text-white">{album.artist}</p>
            </div>
          </div>
          <p className="text-[13px] text-gray-300 leading-relaxed">
            "Цей альбом ми записували в маленькій студії біля підніжжя Карпат. Кожного ранку ми прокидалися від звуків природи, а вечорами слухали історії місцевих жителів. Саме ці спогади та емоції ми намагалися передати в кожній пісні. Сподіваємося, що наша музика допоможе вам відчути красу Карпат."
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
              <span className="text-white">15 березня 2025</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Жанр</span>
              <span className="text-white">{album.genre}</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Лейбл</span>
              <span className="text-white">Карпатські мелодії Records</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Продюсер</span>
              <span className="text-white">Іван Коваль</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
