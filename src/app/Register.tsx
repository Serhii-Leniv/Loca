import { Mail, Lock, Music, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] flex items-center justify-center p-4">
      {/* Mobile Container */}
      <div className="w-full max-w-[400px] px-6 py-12">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Logo icon with subtle purple glow */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#1f1f1f] flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl"></div>
              <div className="relative flex items-center justify-center">
                <Music className="w-7 h-7 text-purple-500 absolute -left-1" />
                <MapPin className="w-6 h-6 text-purple-400 absolute right-0 top-1" />
              </div>
            </div>
          </div>
          
          {/* App Name */}
          <h1 className="text-[32px] font-semibold text-white tracking-tight mb-2">Loca</h1>
          
          {/* Tagline */}
          <p className="text-[14px] text-gray-400 tracking-wide">Музика, що поруч</p>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3 mb-6">
          {/* Google Button */}
          <button className="w-full h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[15px] text-white/90">Продовжити з Google</span>
          </button>

          {/* Facebook Button */}
          <button className="w-full h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-[15px] text-white/90">Продовжити з Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-[13px] text-gray-500 uppercase tracking-wider">або</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="Пароль"
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Primary CTA Button */}
        <Link to="/home" className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mb-8">
          <span className="text-[15px] font-medium">Зареєструватися</span>
        </Link>

        {/* Bottom Link */}
        <div className="text-center">
          <p className="text-[14px] text-gray-400">
            Вже маєш акаунт?{' '}
            <Link to="/home" className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline underline-offset-2">
              Увійти
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
