import { Home as HomeIcon, Search, Library as LibraryIcon, User, Heart, Users, Clock, Play } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { getTracks } from './services/tracks';
import { useAudioStore } from './stores/audioStore';
import { Track } from './types';

export default function Library() {
  const [activeFilter, setActiveFilter] = useState('Плейлисти');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { setContextQueue } = useAudioStore();

  // Fetch tracks on mount
  useEffect(() => {
    async function fetchTracks() {
      try {
        setLoading(true);
        const data = await getTracks();
        setTracks(data);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setError('Failed to load tracks');
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, []);

  // Handle track play
  const handlePlayTrack = async (track: Track) => {
    try {
      const trackIndex = tracks.findIndex((t) => t.id === track.id);
      if (trackIndex !== -1) {
        await setContextQueue(tracks, trackIndex);
      }
    } catch (err) {
      console.error('Failed to play track:', err);
    }
  };

  const filters = [
    { label: 'Плейлисти', path: '/playlists' },
    { label: 'Альбоми', path: '/library/albums' },
    { label: 'Вподобані пісні', path: '/library/liked-songs' },
    { label: 'Артисти', path: null },
  ];

  // Mock data for playlists
  const playlists = [
    {
      id: 1,
      name: 'Літні вечори 2025',
      tracks: 48,
      cover: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 2,
      name: 'Карпатські ритми',
      tracks: 32,
      cover: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 3,
      name: 'Наша дорожня музика',
      tracks: 67,
      cover: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: true,
    },
    {
      id: 4,
      name: 'Львівські артисти',
      tracks: 25,
      cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: false,
    },
    {
      id: 5,
      name: 'Спогади з друзями',
      tracks: 41,
      cover: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      collaborative: true,
    },
  ];

  // Mock data for recent listening
  const recentListening = [
    {
      id: 1,
      name: 'Вечірня казка',
      artist: 'Сестри Тельнюк',
      cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Літо',
      artist: 'OTOY',
      cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      name: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      cover: 'https://images.unsplash.com/photo-1599594407558-957c79005316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

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
            <p className="text-[13px] text-purple-200">Твої пісні, що сподобались</p>
          </div>
        </Link>

        {/* Continue Listening Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-[18px] font-semibold text-white">Продовжити прослуховування</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {recentListening.map((item) => (
              <Link to="/now-playing" key={item.id} className="flex-shrink-0 w-36">
                <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 group cursor-pointer">
                  <ImageWithFallback
                    src={item.cover}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[13px] text-white font-medium truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{item.artist}</p>
              </Link>
            ))}
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
                    {playlist.collaborative && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400">Спільний плейлист</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Real Tracks Section */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Усі треки</h3>
          {loading && <p className="text-[14px] text-gray-400">Завантаження треків...</p>}
          {error && <p className="text-[14px] text-red-400">{error}</p>}
          {!loading && tracks.length === 0 && <p className="text-[14px] text-gray-400">Немає доступних треків</p>}
          {!loading && tracks.length > 0 && (
            <div className="space-y-2">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                    <ImageWithFallback
                      src={track.coverImageUrl || 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080'}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{track.title}</p>
                    <p className="text-[12px] text-gray-400 truncate">{track.artistName}</p>
                  </div>
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0"
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
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