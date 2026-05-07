import { ArrowLeft, User as UserIcon, Camera, Save } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function EditProfile() {
  const [displayName, setDisplayName] = useState('Юрій Пелех');
  const [bio, setBio] = useState('Закоханий в українську музику та місцеві таланти 🎵');
  const [musicPreferences, setMusicPreferences] = useState('Інді, Фолк, Електроніка');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-[24px] font-semibold text-white">Редагування профілю</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 border-4 border-white/10">
              <UserIcon className="w-16 h-16 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-purple-500 border-4 border-[#0a0a0a] flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-[12px] text-gray-400 mt-3">Натисніть, щоб змінити фото</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">

          {/* Display Name */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Ім'я для відображення</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Введіть ім'я"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Email</label>
            <input
              type="email"
              value="yurii.pelech@gmail.com"
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-gray-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-500 mt-1 ml-1">Email не можна змінити</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Біографія</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
              placeholder="Розкажіть про себе"
              rows={3}
              maxLength={150}
            />
            <p className="text-[11px] text-gray-500 mt-1 ml-1">{bio.length}/150 символів</p>
          </div>

          {/* Music Preferences */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Улюблені жанри</label>
            <input
              type="text"
              value={musicPreferences}
              onChange={(e) => setMusicPreferences(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              placeholder="Наприклад: Рок, Поп, Джаз"
            />
          </div>

        </div>

        {/* Save Button */}
        <Link to="/profile" className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/30">
          <Save className="w-5 h-5" />
          Зберегти зміни
        </Link>

      </div>
    </div>
  );
}
