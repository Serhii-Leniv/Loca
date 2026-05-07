import { ArrowLeft, Lock, Eye, EyeOff, Save } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[24px] font-semibold text-white">Змінити пароль</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Info Message */}
        <div className="px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
          <p className="text-[12px] text-gray-300 leading-relaxed">
            Пароль повинен містити мінімум 8 символів, включаючи великі та малі літери, цифри та спеціальні символи.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">

          {/* Current Password */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Поточний пароль</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Введіть поточний пароль"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Новий пароль</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Введіть новий пароль"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[13px] text-gray-400 mb-2 ml-1">Підтвердіть новий пароль</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-[15px] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Повторіть новий пароль"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <Link to="/settings" className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/30">
          <Save className="w-5 h-5" />
          Зберегти пароль
        </Link>

        {/* Security Tips */}
        <div className="mt-8 space-y-3">
          <h3 className="text-[14px] font-medium text-white px-1">Поради безпеки</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <p className="text-[13px] text-gray-400 leading-relaxed">Використовуйте унікальний пароль для кожного сервісу</p>
            </div>
            <div className="flex items-start gap-3 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <p className="text-[13px] text-gray-400 leading-relaxed">Уникайте очевидних паролів, таких як дати народження</p>
            </div>
            <div className="flex items-start gap-3 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
              <p className="text-[13px] text-gray-400 leading-relaxed">Регулярно оновлюйте свій пароль для підвищення безпеки</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
