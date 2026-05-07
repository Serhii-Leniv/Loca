import { Home as HomeIcon, Search as SearchIcon, Library, User, MapPin, X } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function Search() {
  // Mock data for genres/moods
  const genres = [
    { id: 1, name: 'Спокійний вечір', color: 'from-indigo-600 to-blue-700', image: 'https://images.unsplash.com/photo-1731275956984-44abf12b281f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwZXZlbmluZyUyMHN1bnNldCUyMGFtYmllbnR8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/calm-evening' },
    { id: 2, name: 'Для навчання', color: 'from-emerald-600 to-teal-700', image: 'https://images.unsplash.com/photo-1617239098289-ad0ee436361e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzJTIwY29mZmVlfGVufDF8fHx8MTc3NDk2NTkyNHww&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/study' },
    { id: 3, name: 'Дорога', color: 'from-orange-600 to-red-700', image: 'https://images.unsplash.com/photo-1589577507866-d0a067bf8920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwdHJpcCUyMGNhciUyMGRyaXZpbmd8ZW58MXx8fHwxNzc0OTY1OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/road' },
    { id: 4, name: 'Тренування', color: 'from-red-600 to-pink-700', image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NzQ4OTIwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/workout' },
    { id: 5, name: 'Вечірка', color: 'from-fuchsia-600 to-purple-700', image: 'https://images.unsplash.com/photo-1766933161362-ccf4050529a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGNlbGVicmF0aW9uJTIwbGlnaHRzfGVufDF8fHx8MTc3NDg4MjkxM3ww&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/party' },
    { id: 6, name: 'Меланхолія', color: 'from-slate-600 to-gray-700', image: 'https://images.unsplash.com/photo-1753041261065-01d9c9a6bf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwbWVsYW5jaG9saWMlMjB3aW5kb3d8ZW58MXx8fHwxNzc0OTY1OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080', path: '/mood/melancholy' },
  ];

  // Mock data for local artists
  const localArtists = [
    { id: 1, name: 'Марія Коваль', city: 'Львів', image: 'https://images.unsplash.com/photo-1553991529-0207f8725423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBmb2xrJTIwc2luZ2VyfGVufDF8fHx8MTc3NDk2NTkyNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Андрій Рок', city: 'Львів', image: 'https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBhcnRpc3R8ZW58MXx8fHwxNzc0OTY1OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'OTOY', city: 'Львів', image: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Сестри Тельнюк', city: 'Львів', image: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  // Recent searches
  const recentSearches = ['OTOY', 'Карпати кличуть', 'Літо 2025', 'Сестри Тельнюк'];

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
            placeholder="Введи назву треку, альбому або артиста"
            className="w-full h-12 pl-12 pr-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-8">
        
        {/* Recent Searches */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Нещодавні пошуки</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-2 transition-all duration-200 group"
              >
                <span className="text-[14px] text-white">{search}</span>
                <X className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Genres and Moods */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Жанри та настрої</h3>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((genre) => (
              <Link
                to={genre.path}
                key={genre.id}
                className="relative h-28 w-full rounded-2xl overflow-hidden group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color}`}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  <ImageWithFallback
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative h-full flex items-end p-4">
                  <h4 className="text-[16px] font-semibold text-white">{genre.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Local Artists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-white">Музика поруч</h3>
            <Link to="/local-news" className="text-[13px] text-purple-400 hover:text-purple-300 transition-colors">
              Переглянути всі
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {localArtists.map((artist) => (
              <Link to="/album" key={artist.id} className="flex-shrink-0 w-40">
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white/5 mb-3 border border-white/10 group cursor-pointer">
                  <ImageWithFallback
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-white" />
                      <span className="text-[10px] text-white font-medium">{artist.city}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[14px] text-white font-medium truncate">{artist.name}</p>
                <p className="text-[12px] text-gray-500">Локальний артист</p>
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