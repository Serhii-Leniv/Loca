import { ChevronLeft, MoreVertical, Play, Shuffle, Heart, Music, MoreHorizontal, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function LikedSongs() {
  const [activeFilter, setActiveFilter] = useState('Усі');

  const filters = ['Усі', 'Нещодавні', 'Інді', 'Для настрою'];

  // Mock data for liked songs
  const likedSongs = [
    {
      id: 1,
      number: 1,
      title: 'Літо',
      artist: 'OTOY',
      duration: '3:45',
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      hasMemory: true,
    },
    {
      id: 2,
      number: 2,
      title: 'Місто мрій',
      artist: 'OTOY',
      duration: '4:12',
      cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      hasLegend: true,
    },
    {
      id: 3,
      number: 3,
      title: 'Вечір у Львові',
      artist: 'Сестри Тельнюк',
      duration: '3:28',
      cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      hasMemory: true,
    },
    {
      id: 4,
      number: 4,
      title: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      duration: '5:03',
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      hasMemory: true,
      hasLegend: true,
    },
    {
      id: 5,
      number: 5,
      title: 'Ніч на Дніпрі',
      artist: 'Анна Вольна',
      duration: '4:35',
      cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      number: 6,
      title: 'Ритми столиці',
      artist: 'DJ Karpatski',
      duration: '3:56',
      cover: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      number: 7,
      title: 'Зоряна ніч',
      artist: 'OTOY',
      duration: '4:18',
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      hasLegend: true,
    },
    {
      id: 8,
      number: 8,
      title: 'Весняний дощ',
      artist: 'Сестри Тельнюк',
      duration: '3:42',
      cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      hasMemory: true,
    },
    {
      id: 9,
      number: 9,
      title: 'Дорога додому',
      artist: 'Lviv Rebels',
      duration: '4:55',
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 10,
      number: 10,
      title: 'Спогади',
      artist: 'Анна Вольна',
      duration: '4:08',
      cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      hasMemory: true,
      hasLegend: true,
    },
  ];

  const totalTracks = likedSongs.length;
  const totalDurationMinutes = likedSongs.reduce((acc, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number);
    return acc + minutes + seconds / 60;
  }, 0);
  const totalHours = Math.floor(totalDurationMinutes / 60);
  const remainingMinutes = Math.floor(totalDurationMinutes % 60);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Вподобані пісні</h1>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 mt-4 mb-6">
        <div className="relative h-[280px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 shadow-2xl shadow-purple-900/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="mb-auto pt-8 flex items-center justify-center">
              <Heart className="w-20 h-20 text-white fill-white drop-shadow-2xl" />
            </div>
            <h2 className="text-[32px] font-bold text-white mb-2 drop-shadow-lg">Вподобані пісні</h2>
            <p className="text-[12px] text-gray-200 mb-1">
              {totalTracks} треків • {totalHours} год {remainingMinutes} хв
            </p>
            <p className="text-[13px] text-gray-300">Твої улюблені треки в одному місці</p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4">
          <button className="flex-1 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <Play className="w-5 h-5 text-white fill-white" />
            <span className="text-[15px] font-medium text-white">Відтворити</span>
          </button>
          <button className="h-14 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200">
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[15px] font-medium text-white">Shuffle</span>
          </button>
          <button className="w-14 h-14 rounded-full bg-white/5 border border-purple-400/30 flex items-center justify-center hover:bg-white/10 transition-all duration-200">
            <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Track List */}
      <div className="px-4">
        <div className="space-y-2">
          {likedSongs.map((song) => (
            <Link
              to="/now-playing"
              key={song.id}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group"
            >
                {/* Song Number */}
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] text-gray-400 group-hover:hidden">{song.number}</span>
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400 hidden group-hover:block" />
                </div>

                {/* Cover */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[14px] font-medium text-white truncate">{song.title}</h4>
                    {song.hasMemory && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-[9px] text-purple-300 font-medium uppercase tracking-wide whitespace-nowrap">
                        Є спогад
                      </span>
                    )}
                    {song.hasLegend && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-500/30 text-[9px] text-amber-300 font-medium uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Легенда
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 truncate">{song.artist}</p>
                </div>

                {/* Duration and Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[12px] text-gray-400">{song.duration}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>

      {/* Hide scrollbar globally for carousels */}
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
