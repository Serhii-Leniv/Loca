import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Mail, Lock, Music, MapPin, User } from 'lucide-react';
import { registerAndLogin } from './services/auth';
import { ApiError } from './services/api';
import { useAuth } from './context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/home';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setValidationErrors([]);
    setLoading(true);

    try {
      const response = await registerAndLogin({ email, password });
      signIn(response.token);
      navigate(fromPath, { replace: true });
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.details.errors) {
        const messages = Object.values(submitError.details.errors).flat();
        setError(submitError.message);
        setValidationErrors(messages.length > 0 ? messages : ['Не вдалося зареєструватися']);
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Не вдалося зареєструватися');
        setValidationErrors(['Не вдалося зареєструватися']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] px-6 py-12">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#1f1f1f] flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl"></div>
              <div className="relative flex items-center justify-center">
                <Music className="w-7 h-7 text-purple-500 absolute -left-1" />
                <MapPin className="w-6 h-6 text-purple-400 absolute right-0 top-1" />
              </div>
            </div>
          </div>

          <h1 className="text-[32px] font-semibold text-white tracking-tight mb-2">Loca</h1>
          <p className="text-[14px] text-gray-400 tracking-wide">Музика, що поруч</p>
        </div>


        <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              placeholder="Пароль"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {validationErrors.length > 0 ? (
            <ul className="space-y-1 text-sm text-red-300">
              {validationErrors.map((message, index) => (
                <li key={`${message}-${index}`}>• {message}</li>
              ))}
            </ul>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 mb-2"
          >
            <span className="text-[15px] font-medium">{loading ? 'Створення...' : 'Зареєструватися'}</span>
          </button>
        </form>

        <div className="text-center">
          <p className="text-[14px] text-gray-400">
            Вже маєш акаунт?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline underline-offset-2">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
