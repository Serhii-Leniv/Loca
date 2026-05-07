import { ChevronLeft, Plus, Check, Music } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function AddToPlaylist() {
  // Track which playlists contain the current song
  const [addedPlaylists, setAddedPlaylists] = useState<number[]>([2, 5]);

  // Current track info
  const currentTrack = {
    title: 'Місто мрій',
    artist: 'OTOY',
    cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // User's playlists
  const playlists = [
    {
      id: 1,
      name: 'Літні вечори 2025',
      tracks: 48,
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Карпатські ритми',
      tracks: 32,
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      name: 'Наша дорожня музика',
      tracks: 67,
      cover: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      name: 'Львівські артисти',
      tracks: 25,
      cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      name: 'Спогади з друзями',
      tracks: 41,
      cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      name: 'Ранкова енергія',
      tracks: 28,
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGhlYWRwaG9uZXMlMjB2aWJlfGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      name: 'Вечірній чіл',
      tracks: 35,
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsbCUyMG11c2ljJTIwdmlicXxlbnwxfHx8fDE3NzQ5NjUxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const togglePlaylist = (playlistId: number) => {
    setAddedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/now-playing" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[18px] font-semibold text-white">Додати в плейлист</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Current Track */}
      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-950/20 border border-purple-500/20 p-4">
          <p className="text-[11px] text-purple-400 uppercase tracking-wide font-medium mb-3">Додається трек</p>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 shadow-lg">
              <ImageWithFallback
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-white mb-1 truncate">{currentTrack.title}</h3>
              <p className="text-[14px] text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Playlist */}
      <div className="px-4 mb-6">
        <button className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group active:scale-[0.98]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-colors">
            <Plus className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[15px] font-semibold text-white mb-0.5">Створити новий плейлист</h3>
            <p className="text-[12px] text-gray-400">З цим треком</p>
          </div>
        </button>
      </div>

      {/* Playlists List */}
      <div className="px-4">
        <h2 className="text-[13px] text-gray-400 uppercase tracking-wide font-medium mb-3 px-1">Ваші плейлисти</h2>
        <div className="space-y-2">
          {playlists.map((playlist) => {
            const isAdded = addedPlaylists.includes(playlist.id);
            return (
              <button
                key={playlist.id}
                onClick={() => togglePlaylist(playlist.id)}
                className={`w-full rounded-2xl border p-3 flex items-center gap-3 transition-all duration-200 active:scale-[0.98] ${
                  isAdded
                    ? 'bg-purple-900/30 border-purple-500/40 hover:bg-purple-900/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Cover Image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Playlist Info */}
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-[15px] font-medium text-white mb-1 truncate">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] text-gray-400">
                    <Music className="w-3 h-3" />
                    <span>{playlist.tracks} треків</span>
                  </div>
                </div>

                {/* Add/Remove Button */}
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isAdded
                    ? 'bg-purple-600 border-purple-600 scale-110'
                    : 'bg-transparent border-gray-600'
                }`}>
                  {isAdded ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>

      {/* Done Button (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <Link
          to="/now-playing"
          className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-[15px] font-semibold text-white">Готово</span>
        </Link>
      </div>
    </div>
  );
}
