import { ChevronLeft, Plus, Play, Users, MoreHorizontal, ListMusic } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

const playlists = [
  {
    id: 1,
    name: 'Літні вечори 2025',
    tracks: 48,
    collaborative: false,
    cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    name: 'Карпатські ритми',
    tracks: 32,
    collaborative: false,
    cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjJiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3,
    name: 'Наша дорожня музика',
    tracks: 67,
    collaborative: true,
    cover: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4,
    name: 'Львівські артисти',
    tracks: 25,
    collaborative: false,
    cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5,
    name: 'Спогади з друзями',
    tracks: 41,
    collaborative: true,
    cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6,
    name: 'Ранкова медитація',
    tracks: 19,
    collaborative: false,
    cover: 'https://images.unsplash.com/photo-1731275956984-44abf12b281f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwZXZlbmluZyUyMHN1bnNldCUyMGFtYmllbnR8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 7,
    name: 'Вечірня тренування',
    tracks: 23,
    collaborative: false,
    cover: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQ4OTIwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 8,
    name: 'Нічний Київ',
    tracks: 36,
    collaborative: true,
    cover: 'https://images.unsplash.com/photo-1766933161362-ccf4050529a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3NDg4MjkxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function LibraryPlaylists() {
  const [view, setView] = useState<'list' | 'grid'>('list');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[16px] font-medium text-white">Плейлисти</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === 'list' ? 'grid' : 'list')}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ListMusic className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Create playlist button */}
        <button className="w-full rounded-2xl bg-white/5 border border-dashed border-purple-500/40 p-4 flex items-center gap-4 hover:bg-purple-500/5 transition-all duration-200 mb-6 group">
          <div className="w-14 h-14 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
            <Plus className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium text-white">Створити плейлист</p>
            <p className="text-[12px] text-gray-500">Зберігай улюблені треки разом</p>
          </div>
        </button>

        {/* Count */}
        <p className="text-[13px] text-gray-500 mb-4">{playlists.length} плейлистів</p>

        {/* List view */}
        {view === 'list' ? (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <Link
                to="/album"
                key={playlist.id}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 group"
              >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                    <ImageWithFallback
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[14px] font-medium text-white truncate">{playlist.name}</p>
                      {playlist.collaborative && (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <Users className="w-3 h-3 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-400">
                      {playlist.tracks} треків
                      {playlist.collaborative && <span className="text-purple-400"> • Спільний</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-full bg-purple-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-purple-500/30"
                    >
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </button>
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
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 gap-4">
            {playlists.map((playlist) => (
              <Link to="/album" key={playlist.id}>
                <div className="group cursor-pointer">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-2">
                    <ImageWithFallback
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">{playlist.name}</p>
                      <p className="text-[11px] text-gray-500">{playlist.tracks} треків</p>
                    </div>
                    {playlist.collaborative && (
                      <Users className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5 ml-1" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
