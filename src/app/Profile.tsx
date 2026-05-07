import { Home as HomeIcon, Search, Library, User as UserIcon, Settings, ChevronRight, Music, Heart, Users as UsersIcon, LogOut, Bell, Globe, Edit } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function Profile() {
  // Mock data for playlists
  const myPlaylists = [
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
  ];

  // Mock data for recent listening
  const recentListening = [
    {
      id: 1,
      name: 'OTOY',
      image: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Артист',
    },
    {
      id: 2,
      name: 'Сестри Тельнюк',
      image: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Артист',
    },
    {
      id: 3,
      name: 'Lviv Rebels',
      image: 'https://images.unsplash.com/photo-1599594407558-957c79005316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Артист',
    },
    {
      id: 4,
      name: 'DJ Karpatski',
      image: 'https://images.unsplash.com/photo-1634284633072-a98a84684ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMGhlYWRwaG9uZXMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Артист',
    },
  ];

  // Mock data for memories
  const myMemories = [
    {
      id: 1,
      track: 'Літо',
      artist: 'OTOY',
      memory: 'Цей трек асоціюється в мене з літом 2025, коли ми їздили на море…',
      image: 'https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwdmlueWwlMjBjb3ZlcnxlbnwxfHx8fDE3NzQ5NTQzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      track: 'Вечір у Львові',
      artist: 'Сестри Тельнюк',
      memory: 'Ця композиція нагадує мені про перше побачення в старому місті…',
      image: 'https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc0OTY1MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  // Settings menu items
  const settingsItems = [
    { id: 1, icon: Edit, label: 'Редагувати профіль', color: 'text-purple-400', path: '/edit-profile' },
    { id: 2, icon: Globe, label: 'Мова', color: 'text-gray-400', path: '/change-language' },
    { id: 3, icon: Bell, label: 'Сповіщення', color: 'text-gray-400', path: '/notifications' },
    { id: 4, icon: LogOut, label: 'Вийти з акаунта', color: 'text-red-400', path: '/' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-semibold text-white">Профіль</h1>
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6 mt-4">

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 mb-4 border-4 border-white/10">
            <UserIcon className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-[24px] font-semibold text-white mb-1">Юрій Пелех</h2>
          <p className="text-[13px] text-gray-400 mb-2">yurii.pelech@gmail.com</p>
          <p className="text-[14px] text-gray-300 max-w-xs leading-relaxed">Закоханий в українську музику та місцеві таланти 🎵</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="text-center">
            <p className="text-[20px] font-semibold text-white mb-1">12</p>
            <p className="text-[12px] text-gray-400">Плейлисти</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <p className="text-[20px] font-semibold text-white mb-1">248</p>
            <p className="text-[12px] text-gray-400">Вподобані</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <p className="text-[20px] font-semibold text-white mb-1">34</p>
            <p className="text-[12px] text-gray-400">Підписки</p>
          </div>
        </div>

        {/* My Playlists Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-white">Мої плейлисти</h3>
            <Link to="/library/playlists" className="flex items-center gap-1 text-[13px] text-purple-400 hover:text-purple-300 transition-colors">
              Переглянути всі
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {myPlaylists.map((playlist) => (
              <Link
                to="/album"
                key={playlist.id}
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center gap-4 hover:bg-white/10 transition-all duration-200 group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <ImageWithFallback
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-[15px] font-medium text-white truncate mb-1">{playlist.name}</h4>
                  <p className="text-[12px] text-gray-400">{playlist.tracks} треків</p>
                </div>
                <Music className="w-5 h-5 text-gray-500 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Listened Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-white">Нещодавно прослухано</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {recentListening.map((item) => (
              <Link to="/album" key={item.id} className="flex-shrink-0 w-28">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 group cursor-pointer">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-[12px] text-white font-medium truncate">{item.name}</p>
                <p className="text-[11px] text-gray-500">{item.type}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* My Memories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold text-white">Мої спогади</h3>
            <Link to="/my-memories" className="flex items-center gap-1 text-[13px] text-purple-400 hover:text-purple-300 transition-colors">
              Переглянути всі
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {myMemories.map((memory) => (
              <Link to="/now-playing" key={memory.id}>
                <div
                  className="rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/20 p-4 backdrop-blur-sm hover:from-purple-900/30 hover:to-purple-950/30 transition-colors cursor-pointer"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      <ImageWithFallback
                        src={memory.image}
                        alt={memory.track}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-white truncate">{memory.track}</p>
                      <p className="text-[12px] text-gray-400 truncate">{memory.artist}</p>
                    </div>
                    <Heart className="w-5 h-5 text-purple-400 flex-shrink-0 fill-purple-400" />
                  </div>
                  <p className="text-[13px] text-gray-300 leading-relaxed">{memory.memory}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings and Account Section */}
        <div>
          <h3 className="text-[18px] font-semibold text-white mb-4">Налаштування та акаунт</h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {settingsItems.map((item, index) => (
              <Link
                to={item.path}
                key={item.id}
                className={`w-full px-4 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${
                  index !== settingsItems.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className={`text-[15px] flex-1 text-left ${item.color}`}>{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-500" />
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
          <Link to="/library" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <Library className="w-6 h-6" />
            <span className="text-[11px]">Бібліотека</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-purple-400">
            <UserIcon className="w-6 h-6" />
            <span className="text-[11px] font-medium">Профіль</span>
          </button>
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
