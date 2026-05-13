import { Home as HomeIcon, Search, Library as LibraryIcon, User, Heart, Users, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { getLikedTracks, type TrackResponseDto } from './services/tracks';
import { getAlbums, type AlbumResponseDto } from './services/albums';

export default function Library() {
  const [activeFilter, setActiveFilter] = useState('Плейлисти');
  const [likedTracks, setLikedTracks] = useState<TrackResponseDto[]>([]);
  const [albums, setAlbums] = useState<AlbumResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: 'Плейлисти', path: '/playlists' },
    { label: 'Альбоми', path: '/library/albums' },
    { label: 'Вподобані пісні', path: '/library/liked-songs' },
    { label: 'Артисти', path: null },
  ];

  useEffect(() => {
    Promise.all([getLikedTracks(), getAlbums()])
      .then(([tracksData, albumsData]) => {
        setLikedTracks(tracksData);
        setAlbums(albumsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Mock data for playlists
  const playlists = [
    {
      id: 1,
      name: 'Літні вечори 2025',
      tracks: 48,
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-[28px] font-semibold text-white mb-1">Моя бібліотека</h1>
        <p className="text-[13px] text-gray-400 mb-6">Твої плейлисти, альбоми та вподобані пісні</p>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((filter) =>
            filter.path ? (
              <Link
                to={filter.path}
                key={filter.label}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter.label
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setActiveFilter(filter.label)}
              >
                {filter.label}
              </Link>
            ) : (
              null
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6">

        {/* Liked Songs Card */}
        <Link to="/liked-songs" className="w-full rounded-2xl bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-purple-950/60 border border-purple-500/30 p-5 flex items-center gap-4 shadow-xl shadow-purple-500/10 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[18px] font-semibold text-white mb-1">Вподобані пісні</h3>
            <p className="text-[13px] text-purple-200">{likedTracks.length} пісень</p>
          </div>
        </Link>

        {/* My Albums Section */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Альбоми</h3>
          <div className="space-y-3">
            {albums.map((album) => (
              <Link
                to={`/album?id=${album.id}`}
                key={album.id}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={album.coverImageUrl || ''}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-[15px] font-medium text-white truncate mb-1">{album.title}</h4>
                  <p className="text-[12px] text-gray-400">{album.artistName}</p>
                </div>
              </Link>
            ))}
            {albums.length === 0 && (
              <p className="text-gray-500 text-[13px] px-4 py-2">Альбомів ще немає</p>
            )}
          </div>
        </div>

        {/* Playlists Section */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Твої плейлисти</h3>
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <Link
                to="/album"
                key={playlist.id}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] font-medium text-white truncate">{playlist.name}</h4>
                    {playlist.collaborative && (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <Users className="w-3 h-3 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-400">
                    <span>{playlist.tracks} треків</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around h-full px-6">
          <Link to="/home" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[11px]">Домівка</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-[11px]">Пошук</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-purple-400">
            <LibraryIcon className="w-6 h-6" />
            <span className="text-[11px] font-medium">Бібліотека</span>
          </button>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[11px]">Профіль</span>
          </Link>
        </div>
      </div>

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
