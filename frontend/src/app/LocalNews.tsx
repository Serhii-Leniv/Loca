import { ChevronLeft, Play, Shuffle, MapPin, MoreHorizontal, Sparkles, Music } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function LocalNews() {
  const [activeFilter, setActiveFilter] = useState('Усі');

  const filters = ['Усі', 'Сьогодні', 'Цей тиждень', 'Цей місяць'];

  const tracks = [
    {
      id: 1,
      title: 'Місто мрій',
      artist: 'OTOY',
      city: 'Львів',
      duration: '3:45',
      isNew: true,
      hasLegend: true,
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Вечірня казка',
      artist: 'Сестри Тельнюк',
      city: 'Львів',
      duration: '4:12',
      isNew: true,
      cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      city: 'Львів',
      duration: '5:03',
      isNew: false,
      hasLegend: true,
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Ритми столиці',
      artist: 'DJ Karpatski',
      city: 'Київ',
      duration: '3:56',
      isNew: true,
      cover: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: 'Ніч на Дніпрі',
      artist: 'Анна Вольна',
      city: 'Дніпро',
      duration: '4:35',
      isNew: false,
      cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: 'Зоряна ніч',
      artist: 'OTOY',
      city: 'Львів',
      duration: '4:18',
      isNew: true,
      hasLegend: true,
      cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      title: 'Весняний дощ',
      artist: 'Сестри Тельнюк',
      city: 'Львів',
      duration: '3:42',
      isNew: false,
      cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      title: 'Дорога додому',
      artist: 'Lviv Rebels',
      city: 'Львів',
      duration: '4:55',
      isNew: true,
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjJiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Локальні новинки</h1>
          <div className="w-10 h-10" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 mt-4 mb-6">
        <div className="relative h-[200px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-950/40 border border-purple-500/20 shadow-2xl shadow-purple-900/30">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjJiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-[12px] text-purple-300 font-medium">Артисти твого регіону</span>
            </div>
            <h2 className="text-[26px] font-semibold text-white mb-1">Локальні новинки</h2>
            <p className="text-[13px] text-gray-300">Нові треки від артистів Львова</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to="/now-playing" className="flex-1 h-13 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] py-3.5">
            <Play className="w-5 h-5 text-white fill-white" />
            <span className="text-[15px] font-medium text-white">Відтворити</span>
          </Link>
          <button className="h-13 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200 py-3.5">
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[15px] font-medium text-white">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 mb-5">
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

      {/* Track count */}
      <div className="px-4 mb-3">
        <p className="text-[13px] text-gray-500">{tracks.length} треків</p>
      </div>

      {/* Track List */}
      <div className="px-4">
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <Link
              to="/now-playing"
              key={track.id}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group"
            >
                {/* Number */}
                <div className="w-6 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] text-gray-400 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 text-purple-400 fill-purple-400 hidden group-hover:block" />
                </div>

                {/* Cover */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-[14px] font-medium text-white truncate">{track.title}</h4>
                    {track.isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-[9px] text-purple-300 font-medium uppercase tracking-wide whitespace-nowrap">
                        Нове
                      </span>
                    )}
                    {track.hasLegend && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-500/30 text-[9px] text-amber-300 font-medium uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        Легенда
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[12px] text-gray-400 truncate">{track.artist}</p>
                    <span className="text-gray-600 text-[10px]">•</span>
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-gray-500" />
                      <span className="text-[11px] text-gray-500">{track.city}</span>
                    </div>
                  </div>
                </div>

                {/* Duration & Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[12px] text-gray-400">{track.duration}</span>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-8" />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
