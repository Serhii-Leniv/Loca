import { Home as HomeIcon, Search, Library, User, Play, ChevronRight, Sparkles, Shuffle, Map } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import AuthActions from './components/AuthActions';
import { useEffect, useState } from 'react';
import { getAlbums, type AlbumResponseDto } from './services/albums';
import { getNearbyTracks, getRandomTrack, type TrackResponseDto } from './services/tracks';
import { useAuth } from './context/AuthContext';
import { useAudioStore } from './stores/audioStore';

export default function Home() {
  const { user } = useAuth();
  const { setContextQueue } = useAudioStore();
  const [albums, setAlbums] = useState<AlbumResponseDto[]>([]);
  const [nearbyTracks, setNearbyTracks] = useState<TrackResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAlbums(), getNearbyTracks()])
      .then(([albumsData, tracksData]) => {
        setAlbums(albumsData);
        setNearbyTracks(tracksData);
      })
      .catch((err) => {
        console.error(err);
        setError('Не вдалося завантажити дані');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlayTrack = async (track: TrackResponseDto) => {
    const trackIndex = nearbyTracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      await setContextQueue(nearbyTracks, trackIndex);
    }
  };

  const handleRandomSong = async () => {
    try {
      const randomTrack = await getRandomTrack();
      const trackIndex = nearbyTracks.findIndex((t) => t.id === randomTrack.id);
      if (trackIndex !== -1) {
        await setContextQueue(nearbyTracks, trackIndex);
      } else {
        await setContextQueue([randomTrack], 0);
      }
    } catch (err) {
      console.error('Failed to play random track:', err);
    }
  };

  const memories = [
    {
      id: 1,
      track: 'Літо',
      artist: 'OTOY',
      image: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Цей трек асоціюється в мене з літом 2025, коли ми їздили на море…',
    },
    {
      id: 2,
      track: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      image: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Слухав цю пісню під час походу в гори, неймовірні відчуття…',
    },
    {
      id: 3,
      track: 'Вечір у Львові',
      artist: 'Сестри Тельнюк',
      image: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Ця композиція нагадує мені про перше побачення в старому місті…',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-white mb-0.5">
              Привіт, {user?.email.split('@')[0] ?? 'слухачу'}
            </h2>
            <p className="text-[13px] text-gray-400">Музика, що поруч</p>
          </div>
          <AuthActions />
        </div>
      </div>

      <div className="px-4 space-y-8 mt-6">
        <div className="relative h-[200px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-950/40 border border-purple-500/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6">
            <h3 className="text-[24px] font-semibold text-white mb-2">Локальні новинки</h3>
            <p className="text-[13px] text-gray-300 mb-4">Нові треки від артистів Львова</p>
            <Link to="/local-news">
              <button type="button" className="w-32 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.05]">
                <Play className="w-4 h-4 text-white fill-white" />
                <span className="text-[14px] font-medium text-white">Слухати</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center py-4">
          <button
            type="button"
            onClick={() => void handleRandomSong()}
            className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mb-2"
          >
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[16px] font-medium text-white">Рандомна пісня</span>
          </button>
          <p className="text-[12px] text-gray-500">Запусти щось випадкове</p>
        </div>

        <div>
          <h3 className="text-[20px] font-semibold text-white mb-4">Нові треки</h3>
          {error ? <p className="text-[14px] text-red-400">{error}</p> : null}
          {nearbyTracks.length === 0 ? (
            <p className="text-[14px] text-gray-400">Немає доступних треків</p>
          ) : (
            <div className="space-y-3">
              {nearbyTracks.slice(0, 5).map((track) => (
                <div key={track.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                    <ImageWithFallback
                      src={track.coverImageUrl || ''}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{track.title}</p>
                    <p className="text-[12px] text-gray-400 truncate">{track.artistName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handlePlayTrack(track)}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex-shrink-0"
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Музика поруч</h3>
            <div className="flex items-center gap-3">
              <Link
                to="/artists-map"
                className="flex items-center gap-1 text-[13px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Map className="w-3.5 h-3.5" />
                Карта
              </Link>
              <Link
                to="/local-news"
                className="flex items-center gap-1 text-[13px] text-purple-400 hover:text-purple-300 transition-colors"
              >
                Усі
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {nearbyTracks.length > 0 ? (
              nearbyTracks.map((track) => (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => void handlePlayTrack(track)}
                  className="flex-shrink-0 w-32 text-left"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 group cursor-pointer">
                    <ImageWithFallback
                      src={track.coverImageUrl || ''}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-[13px] text-white font-medium truncate">{track.title}</p>
                  <p className="text-[11px] text-gray-500">{track.artistName}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-[13px] px-4">Немає треків поруч</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Популярні альбоми</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {albums.map((album) => (
              <Link
                to={`/library/albums/${encodeURIComponent(album.title)}`}
                key={album.id}
                className="flex-shrink-0 w-32"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 group cursor-pointer">
                  <ImageWithFallback
                    src={album.coverImageUrl || ''}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[13px] text-white font-medium truncate">{album.title}</p>
                <p className="text-[11px] text-gray-500">{album.artistName}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Спогади слухачів</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {memories.map((item) => (
              <Link to="/now-playing" key={item.id} className="flex-shrink-0 w-72 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                    <ImageWithFallback src={item.image} alt={item.track} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-white truncate">{item.track}</p>
                    <p className="text-[12px] text-gray-400 truncate">{item.artist}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-300 leading-relaxed line-clamp-2">{item.memory}</p>
              </Link>
            ))}
          </div>
          <Link
            to="/listener-memories"
            className="mt-3 inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[13px] text-purple-400 hover:bg-white/10 transition-colors"
          >
            Читати ще історії
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Легенди пісень</h3>
          </div>
          <div className="space-y-3">
            <Link to="/now-playing" className="block rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-4 backdrop-blur-sm hover:from-amber-900/30 hover:to-orange-900/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1764014353214-617155ead811?w=100&h=100&fit=crop"
                    alt="OTOY"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] text-amber-400 font-medium uppercase tracking-wide">Легенда від автора</span>
                  </div>
                  <p className="text-[15px] font-medium text-white">Місто мрій</p>
                  <p className="text-[13px] text-gray-400">OTOY</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-300 leading-relaxed">
                "Цю пісню я написав на даху старого будинку у Львові. Був ранок, і місто тільки прокидалося..."
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around h-full px-6">
          <button type="button" className="flex flex-col items-center gap-1 text-purple-400">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[11px] font-medium">Домівка</span>
          </button>
          <Link to="/search" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-[11px]">Пошук</span>
          </Link>
          <Link to="/library" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <Library className="w-6 h-6" />
            <span className="text-[11px]">Бібліотека</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[11px]">Профіль</span>
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
