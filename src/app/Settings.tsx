import { ChevronLeft, ChevronRight, User as UserIcon, Music, Bell, Lock, Globe, Info, Volume2, Play, Trash2, LogOut, Smartphone } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';

export default function Settings() {
  const [autoplay, setAutoplay] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [crossfade, setCrossfade] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [cacheSize, setCacheSize] = useState('245 МБ');
  const [showCacheSuccess, setShowCacheSuccess] = useState(false);

  const handleClearCache = () => {
    setCacheSize('0 МБ');
    setShowCacheSuccess(true);
    setTimeout(() => {
      setShowCacheSuccess(false);
    }, 3000);
  };

  // User data
  const user = {
    name: 'Юрій Пелех',
    email: 'yurii.pelech@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  };

  // Settings sections
  const accountSettings = [
    { id: 1, icon: UserIcon, label: 'Редагувати профіль', subtitle: 'Змінити фото, ім\'я та біо', hasChevron: true, linkTo: '/edit-profile' },
    { id: 2, icon: Lock, label: 'Змінити пароль', hasChevron: true, linkTo: '/change-password' },
    { id: 3, icon: Smartphone, label: 'Підключені пристрої', subtitle: '3 активних пристрої', hasChevron: true, linkTo: '/connected-devices' },
  ];

  const playbackSettings = [
    { id: 1, icon: Play, label: 'Автовідтворення', subtitle: 'Схожі треки після завершення', toggle: true, value: autoplay, onChange: setAutoplay },
    { id: 2, icon: Music, label: 'Плавні переходи', subtitle: 'Crossfade між треками', toggle: true, value: crossfade, onChange: setCrossfade },
  ];

  const notificationSettings = [
    { id: 1, icon: Bell, label: 'Push-сповіщення', subtitle: 'Нові треки та рекомендації', toggle: true, value: pushNotifications, onChange: setPushNotifications },
    { id: 2, icon: Bell, label: 'Email-розсилка', subtitle: 'Новини та оновлення', toggle: true, value: emailNotifications, onChange: setEmailNotifications },
    { id: 3, icon: Bell, label: 'Переглянути сповіщення', hasChevron: true, linkTo: '/notifications' },
  ];

  const privacySettings = [
    { id: 1, icon: Lock, label: 'Приватний режим', subtitle: 'Історія не зберігається', toggle: true, value: privateMode, onChange: setPrivateMode },
    { id: 2, icon: Lock, label: 'Хто бачить мої плейлисти', subtitle: 'Лише я', hasChevron: true },
    { id: 3, icon: Lock, label: 'Хто бачить мої спогади', subtitle: 'Друзі', hasChevron: true },
  ];

  const otherSettings = [
    { id: 1, icon: Globe, label: 'Мова', subtitle: 'Українська', hasChevron: true, linkTo: '/languages' },
    { id: 2, icon: Trash2, label: 'Очистити кеш', subtitle: cacheSize, hasChevron: true, action: handleClearCache },
    { id: 3, icon: LogOut, label: 'Вийти з акаунта', hasChevron: true, linkTo: '/' },
    { id: 4, icon: Smartphone, label: 'Вийти з усіх пристроїв', hasChevron: true, linkTo: '/' },
  ];

  const renderSettingItem = (item: any) => {
    if (item.toggle) {
      return (
        <button
          key={item.id}
          onClick={() => item.onChange(!item.value)}
          className="w-full flex items-center justify-between px-4 py-4 border-b border-white/10 last:border-b-0 active:bg-white/5 transition-colors text-left"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <item.icon
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                item.value ? 'text-purple-400' : 'text-gray-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] transition-colors duration-300 ${item.value ? 'text-white' : 'text-white/70'}`}>
                {item.label}
              </p>
              {item.subtitle && (
                <p className="text-[12px] text-gray-400 mt-0.5">{item.subtitle}</p>
              )}
            </div>
          </div>
          {/* Toggle pill — purely visual, row itself is the interactive target */}
          <div
            className={`relative w-12 h-7 rounded-full flex-shrink-0 transition-colors duration-300 ${
              item.value ? 'bg-purple-600' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                item.value ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </button>
      );
    }

    const content = (
      <button
        onClick={item.action}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <item.icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[15px] text-white">{item.label}</p>
            {item.subtitle && (
              <p className="text-[12px] text-gray-400 mt-0.5">{item.subtitle}</p>
            )}
          </div>
        </div>
        {item.hasChevron && <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </button>
    );

    if (item.linkTo) {
      return (
        <Link to={item.linkTo} key={item.id}>
          {content}
        </Link>
      );
    }

    return <div key={item.id}>{content}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/profile" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[20px] font-semibold text-white">Налаштування</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-6">
        {/* User Account Section */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="w-full flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 flex-shrink-0 border-2 border-white/10">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h2 className="text-[18px] font-semibold text-white mb-0.5">{user.name}</h2>
              <p className="text-[13px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Акаунт
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {accountSettings.map(renderSettingItem)}
          </div>
        </div>

        {/* Playback Settings */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Відтворення
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {playbackSettings.map(renderSettingItem)}
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Сповіщення
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {notificationSettings.map(renderSettingItem)}
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Приватність
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {/* Private Mode toggle — always visible */}
            <button
              onClick={() => setPrivateMode(!privateMode)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-white/10 active:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Lock
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                    privateMode ? 'text-purple-400' : 'text-gray-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] transition-colors duration-300 ${privateMode ? 'text-white' : 'text-white/70'}`}>
                    Приватний режим
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Історія не зберігається</p>
                </div>
              </div>
              <div
                className={`relative w-12 h-7 rounded-full flex-shrink-0 transition-colors duration-300 ${
                  privateMode ? 'bg-purple-600' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    privateMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>

            {/* Expandable rows — visible only when privateMode is ON */}
            <div
              style={{
                maxHeight: privateMode ? '200px' : '0px',
                opacity: privateMode ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
              }}
            >
              {/* Хто бачить мої плейлисти */}
              <div
                style={{
                  transform: privateMode ? 'translateY(0)' : 'translateY(-8px)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/10">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[15px] text-white">Хто бачить мої плейлисти</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">Лише я</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </button>
              </div>

              {/* Хто бачить мої спогади */}
              <div
                style={{
                  transform: privateMode ? 'translateY(0)' : 'translateY(-8px)',
                  transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[15px] text-white">Хто бачить мої спогади</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">Друзі</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Інше
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {otherSettings.map(renderSettingItem)}
          </div>
        </div>

        {/* Cache Success Message */}
        {showCacheSuccess && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="px-6 py-3 rounded-full bg-purple-600 shadow-lg shadow-purple-500/30 border border-purple-400/30">
              <p className="text-[14px] font-medium text-white">✓ Кеш успішно очищено</p>
            </div>
          </div>
        )}

        {/* App Version Footer */}
        <div className="text-center py-6">
          <p className="text-[12px] text-gray-500 mb-1">Loca Music</p>
          <p className="text-[11px] text-gray-600">Версія 2.4.1 (Build 1205)</p>
          <p className="text-[11px] text-gray-600 mt-2">© 2026 Loca. Усі права захищено.</p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}