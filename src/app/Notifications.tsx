import { ChevronLeft, Settings, MessageCircle, Sparkles, Users, MapPin, Music, TrendingUp, Heart, CheckCheck, UserPlus, Radio } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function Notifications() {
  // Mock notifications data
  const notifications = {
    today: [
      {
        id: 1,
        type: 'memory',
        icon: MessageCircle,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-900/40',
        title: 'Новий спогад додано',
        message: 'Марія К. поділилася спогадом до треку "Літо" від OTOY',
        time: '15 хв тому',
        unread: true,
        important: true,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
      {
        id: 2,
        type: 'sync_invite',
        icon: Users,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-900/40',
        title: 'Запрошення до синхронної кімнати',
        message: 'Тарас П. запросив тебе до групового прослуховування',
        time: '1 год тому',
        unread: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      {
        id: 3,
        type: 'legend',
        icon: Sparkles,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-900/40',
        title: 'Легенда пісні оновлена',
        message: 'OTOY додав нову легенду до треку "Місто мрій"',
        time: '2 год тому',
        unread: true,
        cover: 'https://images.unsplash.com/photo-1764014353214-617155ead811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljaWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0OTY1MTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 4,
        type: 'recommendation',
        icon: TrendingUp,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-900/40',
        title: 'Рекомендація дня',
        message: 'Ми підібрали для тебе плейлист "Інді-ритми Львова"',
        time: '3 год тому',
        unread: false,
      },
    ],
    yesterday: [
      {
        id: 5,
        type: 'local_artist',
        icon: MapPin,
        iconColor: 'text-green-400',
        iconBg: 'bg-green-900/40',
        title: 'Новий локальний артист',
        message: 'Lviv Rebels випустили новий альбом у твоєму регіоні',
        time: 'Вчора о 18:30',
        unread: false,
        cover: 'https://images.unsplash.com/photo-1599594407558-957c79005316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBwbGF5ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NjUxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 6,
        type: 'playlist',
        icon: Music,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-900/40',
        title: 'Твій плейлист оновлено',
        message: 'Додано 5 нових треків до "Літні вечори 2025"',
        time: 'Вчора о 14:20',
        unread: false,
      },
      {
        id: 7,
        type: 'follower',
        icon: UserPlus,
        iconColor: 'text-pink-400',
        iconBg: 'bg-pink-900/40',
        title: 'Нова підписка',
        message: 'Оксана М. тепер підписана на твої плейлисти',
        time: 'Вчора о 11:15',
        unread: false,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
      {
        id: 8,
        type: 'like',
        icon: Heart,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-900/40',
        title: 'Вподобання',
        message: 'Твій спогад про "Вечір у Львові" отримав 12 вподобань',
        time: 'Вчора о 09:45',
        unread: false,
      },
    ],
    earlier: [
      {
        id: 9,
        type: 'live',
        icon: Radio,
        iconColor: 'text-orange-400',
        iconBg: 'bg-orange-900/40',
        title: 'Наживо зараз',
        message: 'Сестри Тельнюк розпочали концерт у твоєму місті',
        time: '2 дні тому',
        unread: false,
        cover: 'https://images.unsplash.com/photo-1759415508344-a7515b352f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzc0ODc1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 10,
        type: 'memory',
        icon: MessageCircle,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-900/40',
        title: 'Новий спогад',
        message: 'Іван К. додав спогад до треку "Карпати кличуть"',
        time: '3 дні тому',
        unread: false,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
      {
        id: 11,
        type: 'playlist',
        icon: Music,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-900/40',
        title: 'Плейлист тижня',
        message: 'Новий плейлист "Карпатські мелодії" чекає на тебе',
        time: '5 днів тому',
        unread: false,
      },
    ],
  };

  const renderNotification = (notification: any) => {
    const hasAvatar = notification.avatar;
    const hasCover = notification.cover;

    return (
      <button
        key={notification.id}
        className={`w-full rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
          notification.unread
            ? 'bg-white/8 border-white/15 hover:bg-white/10'
            : 'bg-white/3 border-white/8 hover:bg-white/5'
        } ${
          notification.important
            ? 'shadow-lg shadow-purple-600/20 ring-1 ring-purple-500/30'
            : ''
        }`}
      >
        <div className="flex items-start gap-3 p-4">
          {/* Icon or Avatar */}
          {hasAvatar ? (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0 ring-2 ring-white/10">
              <ImageWithFallback
                src={notification.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          ) : hasCover ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
              <ImageWithFallback
                src={notification.cover}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
              <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`text-[15px] font-medium ${
                notification.unread ? 'text-white' : 'text-gray-300'
              }`}>
                {notification.title}
              </h4>
              {notification.unread && (
                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5"></div>
              )}
            </div>
            <p className={`text-[13px] leading-relaxed mb-2 ${
              notification.unread ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {notification.message}
            </p>
            <p className="text-[11px] text-gray-500">{notification.time}</p>
          </div>
        </div>
      </button>
    );
  };

  const totalUnread = [...notifications.today, ...notifications.yesterday, ...notifications.earlier].filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <Link to="/home" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[20px] font-semibold text-white">Сповіщення</h1>
            {totalUnread > 0 && (
              <p className="text-[11px] text-purple-400 mt-0.5">
                {totalUnread} нових
              </p>
            )}
          </div>
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Quick Actions */}
        {totalUnread > 0 && (
          <button className="w-full h-10 rounded-full bg-purple-900/30 border border-purple-500/30 hover:bg-purple-900/40 flex items-center justify-center gap-2 transition-colors">
            <CheckCheck className="w-4 h-4 text-purple-400" />
            <span className="text-[13px] text-purple-400 font-medium">
              Позначити все як прочитане
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">
        {/* Today Section */}
        {notifications.today.length > 0 && (
          <div>
            <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
              Сьогодні
            </h2>
            <div className="space-y-3">
              {notifications.today.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Yesterday Section */}
        {notifications.yesterday.length > 0 && (
          <div>
            <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
              Вчора
            </h2>
            <div className="space-y-3">
              {notifications.yesterday.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Earlier Section */}
        {notifications.earlier.length > 0 && (
          <div>
            <h2 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
              Раніше
            </h2>
            <div className="space-y-3">
              {notifications.earlier.map(renderNotification)}
            </div>
          </div>
        )}

        {/* Empty State (hidden when there are notifications) */}
        {notifications.today.length === 0 &&
          notifications.yesterday.length === 0 &&
          notifications.earlier.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <CheckCheck className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-[18px] font-medium text-white mb-2">
                Усі сповіщення переглянуті
              </h3>
              <p className="text-[13px] text-gray-400 text-center">
                Нових сповіщень поки немає. Ми повідомимо тебе про нову активність.
              </p>
            </div>
          )}

        {/* Notification Settings Link */}
        <div className="pt-4 pb-8">
          <Link to="/settings" className="w-full h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-[14px] text-gray-400">Налаштування сповіщень</span>
          </Link>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
