import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export default function ChangeLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState('uk');

  const languages = [
    { code: 'uk', name: 'Українська', nativeName: 'Українська' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0a0a]/95 to-transparent backdrop-blur-md px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-[24px] font-semibold text-white">Мова застосунку</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6">
        <p className="text-[13px] text-gray-400 mb-4 px-1">Оберіть мову інтерфейсу застосунку</p>

        {/* Language List */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors ${
                index !== languages.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-[15px] text-white font-medium">{language.nativeName}</span>
                <span className="text-[12px] text-gray-400">{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Info Message */}
        <div className="mt-6 px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-500/20">
          <p className="text-[12px] text-gray-300 leading-relaxed">
            Після зміни мови застосунок автоматично перезапуститься для застосування змін.
          </p>
        </div>
      </div>
    </div>
  );
}
