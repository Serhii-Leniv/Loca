import { ChevronLeft, Play, MoreHorizontal, Disc3 } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

const albums = [
  {
    id: 1,
    title: 'Місто мрій',
    artist: 'OTOY',
    year: 2025,
    tracks: 10,
    cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'Вечірні казки',
    artist: 'Сестри Тельнюк',
    year: 2024,
    tracks: 12,
    cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    title: 'Карпатська воля',
    artist: 'Lviv Rebels',
    year: 2025,
    tracks: 9,
    cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjJiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    title: 'Нічні ритми',
    artist: 'DJ Karpatski',
    year: 2024,
    tracks: 14,
    cover: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5,
    title: 'Вільна душа',
    artist: 'Анна Вольна',
    year: 2025,
    tracks: 11,
    cover: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6,
    title: 'Зоряний шлях',
    artist: 'OTOY',
    year: 2024,
    tracks: 8,
    cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 7,
    title: 'Степові вітри',
    artist: 'Марія Коваль',
    year: 2025,
    tracks: 13,
    cover: 'https://images.unsplash.com/photo-1553991529-0207f8725423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBmb2xrJTIwc2luZ2VyfGVufDF8fHx8MTc3NDk2NTkyNnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 8,
    title: 'Рок-Україна',
    artist: 'Андрій Рок',
    year: 2024,
    tracks: 10,
    cover: 'https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBhcnRpc3R8ZW58MXx8fHwxNzc0OTY1OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

type SortKey = 'Нещодавні' | 'Назва' | 'Артист';

export default function LibraryAlbums() {
  const [sort, setSort] = useState<SortKey>('Нещодавні');
  const sorts: SortKey[] = ['Нещодавні', 'Назва', 'Артист'];

  const sorted = [...albums].sort((a, b) => {
    if (sort === 'Назва') return a.title.localeCompare(b.title, 'uk');
    if (sort === 'Артист') return a.artist.localeCompare(b.artist, 'uk');
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Альбоми</h1>
          <div className="w-10 h-10" />
        </div>
      </div>

      <div className="px-4">
        {/* Sort chips */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {sorts.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                sort === s
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[13px] text-gray-500 mb-4">{albums.length} альбомів</p>

        {/* Album grid */}
        <div className="grid grid-cols-2 gap-4">
          {sorted.map((album) => (
            <Link to="/album" key={album.id}>
              <div className="group cursor-pointer">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-2 relative">
                  <ImageWithFallback
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{album.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{album.artist}</p>
                    <p className="text-[10px] text-gray-600">{album.year} • {album.tracks} треків</p>
                  </div>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <Disc3 className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white mb-0.5">Зберігай альбоми</p>
            <p className="text-[12px] text-gray-500">Натисни «Зберегти» на будь-якому альбомі</p>
          </div>
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
