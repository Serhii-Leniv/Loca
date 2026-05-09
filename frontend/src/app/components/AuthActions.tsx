import { Link } from 'react-router';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AuthActionsProps = {
  compact?: boolean;
};

export default function AuthActions({ compact = false }: AuthActionsProps) {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={logout}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 text-red-400" />
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          to="/profile"
          className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-[13px] text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <User className="w-4 h-4 text-purple-400" />
          {user?.email ?? 'Профіль'}
        </Link>
        <button
          type="button"
          onClick={logout}
          className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-[13px] text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          Вихід
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <Link
        to="/login"
        className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-[13px] text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        Увійти
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-[13px] text-white flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        Увійти
      </Link>
      <Link
        to="/"
        className="h-10 px-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-[13px] text-white flex items-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-colors"
      >
        Реєстрація
      </Link>
    </div>
  );
}