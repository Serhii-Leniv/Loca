import { ArrowLeft, Check, Globe } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function Languages() {
  const [selectedLanguage, setSelectedLanguage] = useState('uk');

  const languages = [
    { code: 'uk', name: 'Українська', nativeName: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/settings" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[24px] font-semibold text-white">Мова застосунку</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">

        {/* Info */}
        <div className="px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-300 leading-relaxed">
              Оберіть мову інтерфейсу застосунку. Зміни будуть застосовані відразу після вибору.
            </p>
          </div>
        </div>

        {/* Language List */}
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-3">
            Доступні мови
          </h3>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${
                  index !== languages.length - 1 ? 'border-b border-white/10' : ''
                } ${
                  selectedLanguage === language.code
                    ? 'bg-purple-500/10 hover:bg-purple-500/15'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className={`text-[15px] font-medium ${
                      selectedLanguage === language.code ? 'text-purple-400' : 'text-white'
                    }`}>
                      {language.nativeName}
                    </span>
                    <span className="text-[12px] text-gray-400">{language.name}</span>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <h3 className="text-[14px] font-medium text-white px-1 mb-3">Не знайшли свою мову?</h3>
          <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[13px] text-gray-300 leading-relaxed mb-3">
              Ми постійно працюємо над додаванням нових мов. Якщо ви хочете допомогти з перекладом, зв'яжіться з нами.
            </p>
            <button className="text-[13px] font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Запропонувати переклад →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
