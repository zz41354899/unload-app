import React from 'react';
import { Globe2 } from 'lucide-react';

interface OnboardingNavbarProps {
  t: (key: string, options?: any) => string;
  currentLanguage: string;
  isLangOpen: boolean;
  onToggleLangMenu: () => void;
  onChangeLanguage: (lang: string) => void;
}

export const OnboardingNavbar: React.FC<OnboardingNavbarProps> = ({
  t,
  currentLanguage,
  isLangOpen,
  onToggleLangMenu,
  onChangeLanguage,
}) => (
  <nav className="w-full px-6 py-6 md:px-12 flex justify-between items-center shrink-0">
    <span className="text-2xl font-extrabold tracking-tight text-gray-900">
      LOGO
    </span>

    <div className="relative z-50">
      <div className="relative">
        <button
          type="button"
          onClick={onToggleLangMenu}
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/80 transition-colors shadow-sm bg-white/50 backdrop-blur-sm"
          aria-label="Toggle language menu"
        >
          <Globe2 className="w-5 h-5" />
        </button>
        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-gray-200 shadow-lg py-1 text-xs">
            <button
              type="button"
              onClick={() => onChangeLanguage('zh-TW')}
              className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                currentLanguage === 'zh-TW' ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              {t('login.language.zh')}
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage('en')}
              className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                currentLanguage === 'en' ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              {t('login.language.en')}
            </button>
          </div>
        )}
      </div>
    </div>
  </nav>
);
