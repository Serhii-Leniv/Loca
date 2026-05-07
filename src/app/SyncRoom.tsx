import { ChevronLeft, MoreVertical, Play, Pause, SkipBack, SkipForward, Share2, Heart, Smile, Music, Radio } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function SyncRoom() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(45);

  // Mock data for room participants
  const participants = [
    { id: 1, name: 'Назар', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NDI0ODQwMDB8MA&ixlib=rb-4.1.0&q=80&w=400', isHost: true },
    { id: 2, name: 'Оля', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc0MjQ4NDAwMHww&ixlib=rb-4.1.0&q=80&w=400' },
    { id: 3, name: 'Максим', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NDI0ODQwMDB8MA&ixlib=rb-4.1.0&q=80&w=400' },
  ];

  // Mock data for live reactions
  const reactions = [
    { id: 1, user: 'Оля', emoji: '🔥', text: 'Обожнюю цей трек!' },
    { id: 2, user: 'Максим', emoji: '❤️', text: 'Класна атмосфера' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/now-playing" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Синхронний стрім</h1>
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 mt-6">

        {/* Room Header Card */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-950/20 border border-purple-500/20 p-5 backdrop-blur-sm shadow-xl shadow-purple-500/10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[22px] font-semibold text-white mb-1">Кімната Назара</h2>
              <p className="text-[13px] text-gray-400">{participants.length} учасники онлайн</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] text-purple-300 font-medium">Слухають разом</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 mt-4">
            {participants.map((participant, index) => (
              <div key={participant.id} className="relative">
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    participant.isHost ? 'border-purple-400' : 'border-white/20'
                  } ${index !== 0 ? '-ml-2' : ''}`}
                  style={{ zIndex: participants.length - index }}
                >
                  <ImageWithFallback
                    src={participant.image}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {participant.isHost && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-[#0a0a0a] flex items-center justify-center">
                    <Music className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 border-dashed flex items-center justify-center -ml-2 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-[11px] text-gray-400">+</span>
            </div>
          </div>
        </div>

        {/* Now Playing Block */}
        <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm">
          {/* Status Label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-[12px] text-purple-300 font-medium">Відтворюється для всіх</span>
          </div>

          {/* Album Cover */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 mb-6 shadow-2xl shadow-black/50">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Album cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h3 className="text-[24px] font-semibold text-white mb-1">Літо</h3>
            <p className="text-[15px] text-gray-400">OTOY</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="relative h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>1:23</span>
              <span>3:05</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95">
              <SkipBack className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/30 transition-all active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              )}
            </button>
            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95">
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Live Reactions */}
        <div>
          <h3 className="text-[15px] font-medium text-white mb-3 px-1">Реакції учасників</h3>
          <div className="space-y-2">
            {reactions.map((reaction) => (
              <div key={reaction.id} className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-[20px]">{reaction.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-purple-300">{reaction.user}</p>
                    <p className="text-[13px] text-gray-300 mt-0.5">{reaction.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors">
            <Smile className="w-4 h-4 text-gray-400" />
            <span className="text-[14px] text-gray-400">Додати реакцію</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 transition-all active:scale-[0.98]">
            <Share2 className="w-5 h-5 text-white" />
            <span className="text-[15px] font-medium text-white">Запросити друзів</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-[13px] text-gray-400 font-mono">Код: <span className="text-purple-400 font-semibold">LVIV2026</span></span>
            </div>
            <button className="h-12 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors">
              <span className="text-[13px] text-purple-400 font-medium">Копіювати</span>
            </button>
          </div>
        </div>

        {/* Info Block */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-900/10 to-blue-950/10 border border-blue-500/20 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Radio className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-gray-300 leading-relaxed">
                Всі учасники кімнати слухають одну й ту саму пісню синхронно. Паузи, перемотування та зміна треків відбуваються для всіх одночасно.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
