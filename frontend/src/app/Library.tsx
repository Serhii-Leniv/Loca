import { Home as HomeIcon, Search, Library as LibraryIcon, User, Heart, Play } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { getLikedTracks, getNearbyTracks, type TrackResponseDto } from './services/tracks';
import { getAlbums, type AlbumResponseDto } from './services/albums';
import { getPlaylists, type PlaylistResponseDto } from './services/playlists';
import { useAudioStore } from './stores/audioStore';
import { formatCollectionDuration, formatDuration } from './utils/duration';
import PlaylistCover from './components/PlaylistCover';
import type { LikedTracksCollection } from './types';

export default function Library() {
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('libraryActiveTab') || '');

  useEffect(() => {
    sessionStorage.setItem('libraryActiveTab', activeFilter);
  }, [activeFilter]);
  const [likedCollection, setLikedCollection] = useState<LikedTracksCollection | null>(null);
  const [albums, setAlbums] = useState<AlbumResponseDto[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistResponseDto[]>([]);
  const [tracks, setTracks] = useState<TrackResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setContextQueue } = useAudioStore();

  const filters = [
    { label: 'Плейлисти', path: '/playlists' },
    { label: 'Альбоми', path: '/library/albums' },
    { label: 'Вподобані пісні', path: '/library/liked-songs' },
    { label: 'Артисти', path: null },
  ];

  useEffect(() => {
    Promise.all([getLikedTracks(), getAlbums(), getNearbyTracks(), getPlaylists()])
      .then(([likedData, albumsData, tracksData, playlistsData]) => {
        setLikedCollection(likedData);
        setAlbums(albumsData);
        setTracks(tracksData);
        setPlaylists(playlistsData);
      })
      .catch((err) => {
        console.error(err);
        setError('Не вдалося завантажити бібліотеку');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlayTrack = async (track: TrackResponseDto) => {
    const trackIndex = tracks.findIndex((t) => t.id === track.id);
    if (trackIndex !== -1) {
      await setContextQueue(tracks, trackIndex);
    }
  };

  const likedTracks = likedCollection?.tracks ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-[28px] font-semibold text-white mb-1">Моя бібліотека</h1>
        <p className="text-[13px] text-gray-400 mb-6">Твої плейлисти, альбоми та вподобані пісні</p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((filter) =>
            filter.path ? (
              <Link
                to={filter.path}
                key={filter.label}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${activeFilter === filter.label
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                onClick={() => setActiveFilter(filter.label)}
              >
                {filter.label}
              </Link>
            ) : null
          )}
        </div>
      </div>

      <div className="px-4 space-y-6">
        <Link
          to="/liked-songs"
          className="w-full rounded-2xl bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-purple-950/60 border border-purple-500/30 p-5 flex items-center gap-4 shadow-xl shadow-purple-500/10 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[18px] font-semibold text-white mb-1">Вподобані пісні</h3>
            <p className="text-[13px] text-purple-200">
              {likedTracks.length} пісень{likedCollection ? ` • ${formatCollectionDuration(likedCollection.totalDurationSeconds)}` : ''}
            </p>
          </div>
        </Link>

        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Альбоми</h3>
          <div className="space-y-3">
            {albums.map((album) => (
              <Link
                to={`/library/albums/${encodeURIComponent(album.title)}`}
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
            {albums.length === 0 ? (
              <p className="text-gray-500 text-[13px] px-4 py-2">Альбомів ще немає</p>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Твої плейлисти</h3>
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <Link
                to={`/playlist/${playlist.id}`}
                key={playlist.id}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <PlaylistCover
                    coverImageUrls={playlist.coverImageUrls}
                    sizeClass="w-20 h-20"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-[15px] font-medium text-white truncate mb-1">{playlist.name}</h4>
                  <p className="text-[12px] text-gray-400">{playlist.trackCount} треків</p>
                </div>
              </Link>
            ))}
            {playlists.length === 0 ? (
              <p className="text-gray-500 text-[13px] px-4 py-2">Плейлистів ще немає</p>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Усі треки</h3>
          {error ? <p className="text-[14px] text-red-400">{error}</p> : null}
          {tracks.length === 0 ? (
            <p className="text-[14px] text-gray-400">Немає доступних треків</p>
          ) : (
            <div className="space-y-2">
              {tracks.map((track) => (
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
                  <span className="text-[12px] text-gray-400 flex-shrink-0">{formatDuration(track.duration)}</span>
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
      </div>

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
          <button type="button" className="flex flex-col items-center gap-1 text-purple-400">
            <LibraryIcon className="w-6 h-6" />
            <span className="text-[11px] font-medium">Бібліотека</span>
          </button>
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
