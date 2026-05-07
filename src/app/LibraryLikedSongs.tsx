import { ChevronLeft, Play, Shuffle, Heart, MoreHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

const likedSongs = [
  { id: 1, title: 'Літо', artist: 'OTOY', duration: '3:45', hasMemory: true, cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, title: 'Місто мрій', artist: 'OTOY', duration: '4:12', hasLegend: true, cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, title: 'Вечір у Львові', artist: 'Сестри Тельнюк', duration: '3:28', hasMemory: true, cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, title: 'Карпати кличуть', artist: 'Lviv Rebels', duration: '5:03', hasMemory: true, hasLegend: true, cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjJiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 5, title: 'Ніч на Дніпрі', artist: 'Анна Вольна', duration: '4:35', cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 6, title: 'Ритми столиці', artist: 'DJ Karpatski', duration: '3:56', cover: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 7, title: 'Зоряна ніч', artist: 'OTOY', duration: '4:18', hasLegend: true, cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjJjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 8, title: 'Весняний дощ', artist: 'Сестри Тельнюк', duration: '3:42', hasMemory: true, cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjJzaW5nZXIlMjJwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 9, title: 'Дорога додому', artist: 'Lviv Rebels', duration: '4:55', cover: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 10, title: 'Спогади', artist: 'Анна Вольна', duration: '4:08', hasMemory: true, hasLegend: true, cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 11, title: 'Синє небо', artist: 'Марія Коваль', duration: '3:33', cover: 'https://images.unsplash.com/photo-1553991529-0207f8725423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBmb2xrJTIwc2luZ2VyfGVufDF8fHx8MTc3NDk2NTkyNnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 12, title: 'Рок-н-рол серця', artist: 'Андрій Рок', duration: '3:50', cover: 'https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBhcnRpc3R8ZW58MXx8fHwxNzc0OTY1OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const filters = ['Усі', 'Нещодавні', 'Інді', 'Для настрою'];

export default function LibraryLikedSongs() {
  const [activeFilter, setActiveFilter] = useState('Усі');

  const totalMinutes = likedSongs.reduce((acc, s) => {
    const [m, sec] = s.duration.split(':').map(Number);
    return acc + m + sec / 60;
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Вподобані пісні</h1>
          <div className="w-10 h-10" />
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 mt-2 mb-6">
        <div className="relative h-[220px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 shadow-2xl shadow-purple-900/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center pb-2">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 shadow-xl">
              <Heart className="w-10 h-10 text-white fill-white drop-shadow-lg" />
            </div>
            <p className="text-[13px] text-purple-200 mb-1">
              {likedSongs.length} треків • {hours} год {mins} хв
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-3">
          <Link to="/now-playing" className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02]">
            <Play className="w-5 h-5 text-white fill-white" />
            <span className="text-[15px] font-medium text-white">Відтворити</span>
          </Link>
          <button className="py-3.5 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-200">
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[15px] font-medium text-white">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Track list */}
      <div className="px-4">
        <div className="space-y-2">
          {likedSongs.map((song, index) => (
            <Link
              to="/now-playing"
              key={song.id}
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
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-[14px] font-medium text-white truncate">{song.title}</p>
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

                {/* Duration + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[12px] text-gray-400">{song.duration}</span>
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
