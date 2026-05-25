import { Home as HomeIcon, Search as SearchIcon, Library, User, MapPin, X, Play } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { getNearbyTracks, type TrackResponseDto } from './services/tracks';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TrackResponseDto[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        setLoading(true);
        getNearbyTracks(undefined, searchQuery)
          .then(setSearchResults)
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-[28px] font-semibold text-white mb-1">Пошук</h1>
        <p className="text-[13px] text-gray-400 mb-6">Знайди музику та артистів поруч</p>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Введи назву треку, альбому або артиста"
            className="w-full h-12 pl-12 pr-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-8">

        {/* Search Results */}
        {searchQuery.trim() !== '' && (
          <div>
            <h3 className="text-[18px] font-semibold text-white mb-4">Результати пошуку</h3>
            <div className="space-y-3">
              {searchResults.map((track) => (
                <Link
                  to={`/now-playing?id=${track.id}`}
                  key={track.id}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 relative">
                    <ImageWithFallback
                      src={track.coverImageUrl || ''}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-[15px] font-medium text-white truncate mb-1">{track.title}</h4>
                    <p className="text-[12px] text-gray-400 truncate">{track.artistName} • {track.locationName}</p>
                  </div>
                </Link>
              ))}
              {!loading && searchResults.length === 0 && (
                <p className="text-gray-500 text-[13px] px-4">Нічого не знайдено</p>
              )}
            </div>
          </div>
        )}


      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around h-full px-6">
          <Link to="/home" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[11px]">Домівка</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-purple-400">
            <SearchIcon className="w-6 h-6" />
            <span className="text-[11px] font-medium">Пошук</span>
          </button>
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
