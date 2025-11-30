
import React, { useState } from 'react';
import { ArrowRight, Loader, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';

interface LoginProps {
    navigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
    const { login } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const handleLogin = async () => {
        setIsLoading(true);
        // 模擬登入延遲
        await new Promise(resolve => setTimeout(resolve, 800));
        login();
        navigate('onboarding');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Language Toggle */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsLangOpen((open) => !open)}
                        className="p-2 rounded-full text-gray-500 hover:text-text hover:bg-gray-100 transition-colors"
                        aria-label="Toggle language menu"
                    >
                        <Globe2 className="w-5 h-5" />
                    </button>
                    {isLangOpen && (
                        <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-gray-200 shadow-lg py-1 text-xs z-[10000]">
                            <button
                                type="button"
                                onClick={() => {
                                    void i18n.changeLanguage('zh-TW');
                                    setIsLangOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${i18n.language === 'zh-TW' ? 'font-semibold text-text' : 'text-gray-600'
                                    }`}
                            >
                                {t('login.language.zh')}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    void i18n.changeLanguage('en');
                                    setIsLangOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${i18n.language === 'en' ? 'font-semibold text-text' : 'text-gray-600'
                                    }`}
                            >
                                {t('login.language.en')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Logo Corner */}
            <a
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2"
            >
                <img src="/logo.svg" alt="Unload Logo" className="w-[140px] h-10 object-contain" />
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-gray-600 shadow-sm backdrop-blur">
                    {t('login.previewBadge')}
                </span>
            </a>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 bg-background">
                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/logo-m.svg" alt="Unload Logo" className="w-10 h-10 object-contain" />
                    </div>

                    <h1 className="text-3xl font-bold mb-6 text-text">{t('login.title')}</h1>
                    <h2 className="text-xl font-bold text-text mb-2">{t('login.subtitle')}</h2>
                    <p className="text-lg text-text font-bold mb-8">{t('login.tagline')}</p>

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-primary text-white rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-[#1e2b1e] transition-all mb-8 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span className="font-bold text-lg tracking-wide">{t('login.loading')}</span>
                            </>
                        ) : (
                            <>
                                <span className="font-bold text-lg tracking-wide">{t('login.tryNow')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500">
                        {t('login.previewHint')}
                    </p>
                </div>
            </div>
        </div>
    );
};
