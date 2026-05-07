import { Home as HomeIcon, Search, Library, User, Play, ChevronRight, Sparkles, Shuffle } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function Home() {
  // Mock data for local artists
  const localArtists = [
    { id: 1, name: 'OTOY', image: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Сестри Тельнюк', image: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Lviv Rebels', image: 'https://images.unsplash.com/photo-1599594407558-957c79005316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'DJ Karpatski', image: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 5, name: 'Анна Вольна', image: 'https://images.unsplash.com/photo-1605958056628-85f07124443a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMG11c2ljaWFufGVufDF8fHx8MTc3NDk2NTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  // Mock data for memories
  const memories = [
    {
      id: 1,
      track: 'Літо',
      artist: 'OTOY',
      image: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Цей трек асоціюється в мене з літом 2025, коли ми їздили на море…'
    },
    {
      id: 2,
      track: 'Карпати кличуть',
      artist: 'Lviv Rebels',
      image: 'https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Слухав цю пісню під час походу в гори, неймовірні відчуття…'
    },
    {
      id: 3,
      track: 'Вечір у Львові',
      artist: 'Сестри Тельнюк',
      image: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      memory: 'Ця композиція нагадує мені про перше побачення в старому місті…'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-white mb-0.5">Привіт, Олександр</h2>
            <p className="text-[13px] text-gray-400">Музика, що поруч</p>
          </div>
          <Link to="/profile">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-8 mt-6">
        
        {/* Hero Section - Featured Local Playlist */}
        <div className="relative h-[200px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-950/40 border border-purple-500/20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1646480512847-64d58ff2b0aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1a3JhaW5pYW4lMjBiYW5kJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ5NjUxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-6">
            <h3 className="text-[24px] font-semibold text-white mb-2">Локальні новинки</h3>
            <p className="text-[13px] text-gray-300 mb-4">Нові треки від артистів Львова</p>
            <Link to="/local-news">
              <button className="w-32 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-[1.05]">
                <Play className="w-4 h-4 text-white fill-white" />
                <span className="text-[14px] font-medium text-white">Слухати</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Random Song Button */}
        <div className="flex flex-col items-center py-4">
          <Link
            to="/now-playing"
            className="w-full h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 flex items-center justify-center gap-3 shadow-xl shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mb-2"
          >
            <Shuffle className="w-5 h-5 text-white" />
            <span className="text-[16px] font-medium text-white">Рандомна пісня</span>
          </Link>
          <p className="text-[12px] text-gray-500">Запусти щось випадкове</p>
        </div>

        {/* Local Artists Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Музика поруч</h3>
            <Link
              to="/local-news"
              className="flex items-center gap-1 text-[13px] text-purple-400 hover:text-purple-300 transition-colors"
            >
              Переглянути всі
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {localArtists.map((artist) => (
              <Link to="/album" key={artist.id} className="flex-shrink-0 w-32">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 group cursor-pointer">
                  <ImageWithFallback
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[13px] text-white font-medium truncate">{artist.name}</p>
                <p className="text-[11px] text-gray-500">Львів</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Memories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Спогади слухачів</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {memories.map((item) => (
              <Link to="/now-playing" key={item.id} className="flex-shrink-0 w-72 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.track}
                      className="w-full h-full object-cover"
                    />
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

        {/* Legends Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[20px] font-semibold text-white">Легенди пісень</h3>
          </div>
          <div className="space-y-3">
            <Link to="/now-playing" className="block rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-4 backdrop-blur-sm hover:from-amber-900/30 hover:to-orange-900/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={localArtists[0].image}
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
                "Цю пісню я написав на даху старого будинку у Львові. Був ранок, і місто тільки прокидалося. Саме тоді я зрозумів, що хочу присвятити своє життя музиці..."
              </p>
            </Link>

            <Link to="/now-playing" className="block rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-4 backdrop-blur-sm hover:from-amber-900/30 hover:to-orange-900/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={localArtists[1].image}
                    alt="Сестри Тельнюк"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] text-amber-400 font-medium uppercase tracking-wide">Легенда від авора</span>
                  </div>
                  <p className="text-[15px] font-medium text-white">Вечірня казка</p>
                  <p className="text-[13px] text-gray-400">Сестри Тельнюк</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-300 leading-relaxed">
                "Ми написали цю пісню разом з нашою бабусею. Вона розповіла нам стару карпатську легенду, і ми вирішили покласти її на музику..."
              </p>
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around h-full px-6">
          <button className="flex flex-col items-center gap-1 text-purple-400">
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