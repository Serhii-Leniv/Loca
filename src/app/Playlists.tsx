import { ChevronLeft, Plus, Music, Users, Play } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function Playlists() {
  // Mock playlists data
  const playlists = [
    {
      id: 1,
      name: 'Літні вечори 2025',
      description: 'Найкраща музика для теплих літніх вечорів',
      tracks: 48,
      duration: '3 год 12 хв',
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 2,
      name: 'Карпатські ритми',
      description: 'Традиційна та сучасна українська музика',
      tracks: 32,
      duration: '2 год 8 хв',
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 3,
      name: 'Наша дорожня музика',
      description: 'Треки для довгих подорожей',
      tracks: 67,
      duration: '4 год 35 хв',
      cover: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: true,
    },
    {
      id: 4,
      name: 'Львівські артисти',
      description: 'Локальна сцена Львова',
      tracks: 25,
      duration: '1 год 52 хв',
      cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 5,
      name: 'Спогади з друзями',
      description: 'Пісні, що нагадують про важливі моменти',
      tracks: 41,
      duration: '2 год 47 хв',
      cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: true,
    },
    {
      id: 6,
      name: 'Ранкова енергія',
      description: 'Бадьорі треки для доброго ранку',
      tracks: 28,
      duration: '1 год 38 хв',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGhlYWRwaG9uZXMlMjB2aWJlfGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 7,
      name: 'Вечірній чіл',
      description: 'Спокійна музика для релаксації',
      tracks: 35,
      duration: '2 год 24 хв',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsbCUyMG11c2ljJTIwdmlicXxlbnwxfHx8fDE3NzQ5NjUxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 8,
      name: 'Українські хіти 2025',
      description: 'Найпопулярніші українські треки року',
      tracks: 52,
      duration: '3 год 28 хв',
      cover: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5lJTIwbXVzaWN8ZW58MXx8fHwxNzc0OTY1MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/library" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[20px] font-semibold text-white">Мої плейлисти</h1>
          <button className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors shadow-lg shadow-purple-500/30">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-950/20 border border-purple-500/20 p-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-[24px] font-bold text-white">{playlists.length}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Плейлистів</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[24px] font-bold text-white">
                {playlists.reduce((sum, p) => sum + p.tracks, 0)}
              </p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Треків</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[24px] font-bold text-white">
                {playlists.filter(p => p.collaborative).length}
              </p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Спільних</p>
            </div>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="px-4">
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <Link
              to="/album"
              key={playlist.id}
              className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]"
            >
              {/* Cover Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                <ImageWithFallback
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Playlist Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-semibold text-white truncate">
                    {playlist.name}
                  </h3>
                  {playlist.collaborative && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  )}
                </div>
                <p className="text-[13px] text-gray-400 mb-2 truncate">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Music className="w-3 h-3" />
                  <span>{playlist.tracks} треків</span>
                  <span>•</span>
                  <span>{playlist.duration}</span>
                  {playlist.collaborative && (
                    <>
                      <span>•</span>
                      <span className="text-purple-400">Спільний</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Create New Playlist Button */}
      <div className="px-4 mt-6">
        <button className="w-full rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-950/40 border-2 border-dashed border-purple-500/40 p-6 flex flex-col items-center gap-3 hover:from-purple-900/60 hover:to-purple-950/60 hover:border-purple-500/60 transition-all duration-200 group">
          <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
            <Plus className="w-7 h-7 text-purple-400" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-medium text-white mb-1">Створити новий плейлист</p>
            <p className="text-[12px] text-gray-400">Додай свої улюблені треки</p>
          </div>
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
