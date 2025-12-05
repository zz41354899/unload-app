
import React, { useState } from 'react';
import { ArrowRight, Loader, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
    navigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
    const { login } = useAppStore();
    const routerNavigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const handleLogin = async () => {
        setIsLoading(true);

        const redirectTo = `${window.location.origin}/app/login`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
                queryParams: {
                    // 總是顯示帳號選擇清單，方便切換 Google 帳號
                    prompt: 'select_account',
                },
            },
        });

        if (error) {
            // TODO: 之後可整合全域 toast 呈現錯誤
            // eslint-disable-next-line no-console
            console.error('[Supabase] Google sign-in failed:', error.message);
            setIsLoading(false);
            return;
        }

        // 成功時會跳轉至 Google，再依 Supabase 設定導回 redirectTo；
        // 回到應用後再由 App 層透過 supabase.auth.getUser() 建立本地 user 狀態。
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
                <span className="text-2xl font-extrabold tracking-tight text-text">
                    LOGO
                </span>
            </a>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 bg-background">
                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <span className="text-3xl font-extrabold tracking-tight text-text">
                            LOGO
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6 text-text">{t('login.title')}</h1>
                    <h2 className="text-xl font-bold text-text mb-8">{t('login.subtitle')}</h2>

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
                                <ArrowRight className="w-5 h-5" />
                                <span className="font-bold text-lg tracking-wide">{t('login.google.button')}</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 leading-relaxed">
                        {t('login.google.notice.prefix')}{' '}
                        <button
                            type="button"
                            onClick={() => routerNavigate('/privacy')}
                            className="underline underline-offset-2 cursor-pointer text-gray-600 hover:text-text"
                        >
                            {t('login.google.privacy')}
                        </button>{' '}
                        {t('login.google.notice.connector')}{' '}
                        <button
                            type="button"
                            onClick={() => routerNavigate('/terms')}
                            className="underline underline-offset-2 cursor-pointer text-gray-600 hover:text-text"
                        >
                            {t('login.google.terms')}
                        </button>
                        {t('login.google.notice.suffix')}
                    </p>
                </div>
            </div>
        </div>
    );
};
