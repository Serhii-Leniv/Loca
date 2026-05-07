import { ChevronLeft, MoreVertical, Heart, Plus, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Monitor, Sparkles, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function NowPlaying() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <h3 className="text-[14px] font-medium text-white">Зараз грає</h3>
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-8 mt-8">

        {/* Album Cover */}
        <div className="flex justify-center">
          <div className="w-full max-w-[340px] aspect-square rounded-3xl overflow-hidden bg-white/5 shadow-2xl shadow-purple-500/20 border border-purple-500/20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Album Cover"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-[26px] font-semibold text-white mb-1 leading-tight">Місто мрій</h1>
              <p className="text-[16px] text-gray-400 mb-2">OTOY</p>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] text-purple-300 font-medium">
                Локальний артист
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200"
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'text-purple-500 fill-purple-500' : 'text-white'}`} />
              </button>
              <Link to="/add-to-playlist" className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[35%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[12px] text-gray-500">
            <span>1:24</span>
            <span>3:58</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setShuffleEnabled(!shuffleEnabled)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${shuffleEnabled ? 'text-purple-400' : 'text-gray-500'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-white hover:text-gray-300 transition-colors">
            <SkipBack className="w-7 h-7" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/40 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            )}
          </button>
          <button className="w-12 h-12 flex items-center justify-center text-white hover:text-gray-300 transition-colors">
            <SkipForward className="w-7 h-7" />
          </button>
          <button
            onClick={() => setRepeatEnabled(!repeatEnabled)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${repeatEnabled ? 'text-purple-400' : 'text-gray-500'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Device Control */}
        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-medium text-white">Підключені пристрої</p>
              <p className="text-[11px] text-gray-500">iPhone Олександра</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500 rotate-180" />
        </button>

        {/* Song Legend Section */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-[15px] font-semibold text-white">Легенда пісні</h3>
          </div>
          <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
            Цю пісню я написав на даху старого будинку у Львові. Був ранок, і місто тільки прокидалося...
          </p>
          <button className="px-4 py-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-[13px] text-amber-300 font-medium transition-colors">
            Читати більше
          </button>
        </div>

        {/* Listener Memory Section */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-[15px] font-semibold text-white">Спогад слухача</h3>
          </div>
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-[11px] font-semibold text-white">
                А
              </div>
              <span className="text-[12px] text-gray-500">Анонімний слухач</span>
            </div>
            <p className="text-[13px] text-gray-300 leading-relaxed">
              Цей трек асоціюється в мене з літом 2025, коли ми їздили на море. Неймовірні спогади! 💜
            </p>
          </div>
          <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[13px] text-purple-400 font-medium transition-colors">
            Ще спогади
          </button>
        </div>

        {/* Synchronous Stream Section */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-950/30 border border-purple-500/30 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-[15px] font-semibold text-white">Синхронний стрім</h3>
              </div>
              <p className="text-[12px] text-gray-400">
                Слухайте музику разом з друзями в реальному часі
              </p>
            </div>
          </div>
          <Link to="/sync-room" className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <Users className="w-5 h-5 text-white" />
            <span className="text-[14px] font-medium text-white">Створити кімнату</span>
          </Link>
        </div>

      </div>

      {/* Hide scrollbar globally */}
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