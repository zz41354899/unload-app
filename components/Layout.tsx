
import React, { useState } from 'react';
import { Compass, LayoutDashboard, History, Menu, PanelLeft, LogOut, CheckCircle, Loader, BookOpen, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabaseClient';
import { Onboarding } from '../pages/Onboarding';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  navigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, navigate }) => {
  const { user, logout, toast, isGuideOpen, openGuide, closeGuide, guideStep } = useAppStore();
  const routerNavigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // 模擬登出延遲
    await new Promise(resolve => setTimeout(resolve, 800));

    // 同步登出 Supabase，確保不會在 App 初始化時又從 session 還原 user
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Supabase] signOut failed:', error);
    }

    logout();
    routerNavigate('/app/login');
  };
  
  const navItems = [
    { id: 'dashboard', label: t('layout.nav.dashboard'), icon: LayoutDashboard },
    { id: 'journal', label: t('layout.nav.journal'), icon: BookOpen },
    { id: 'history', label: t('layout.nav.history'), icon: History },
  ];

  return (
    <div className="min-h-screen flex bg-background text-text font-sans selection:bg-primary selection:text-white">
      {/* Sidebar - Desktop */}
      <aside 
        className={`
            hidden md:flex flex-col bg-background fixed h-full pt-8 pb-8 transition-all duration-300 ease-in-out z-40 border-r border-transparent
            ${isSidebarOpen ? 'w-64 pl-8 pr-4' : 'w-20 items-center border-gray-100'} 
        `}
      >
        {/* Header: Logo + Toggle */}
        <div className={`flex items-center mb-12 ${isSidebarOpen ? 'gap-4 flex-row' : 'flex-col gap-6'}`}>
          {/* Logo Group (文字版 Logo) */}
          {isSidebarOpen ? (
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                navigate('dashboard');
                routerNavigate('/app/dashboard');
              }}
            >
              <span className="text-2xl font-extrabold tracking-tight text-text">
                LOGO
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer p-2 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-xl shadow-sm"
              onClick={() => {
                navigate('dashboard');
                routerNavigate('/app/dashboard');
              }}
            >
              <span>L</span>
            </button>
          )}

           {/* Toggle Button */}
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="p-1.5 rounded-md text-text hover:bg-gray-200/50 transition-colors"
             title={isSidebarOpen ? "收起側邊欄" : "展開側邊欄"}
           >
              <PanelLeft className="w-5 h-5" />
           </button>
        </div>

        <nav className="flex-1 space-y-6 w-full">
            {/* Only show label when sidebar is open */}
            {isSidebarOpen && (
                <div className="text-sm text-muted mb-4 pl-2">
                    {t('layout.nav.sectionTitle')}
                </div>
            )}
            
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const isHistoryGuide = guideStep === 3 && item.id === 'journal';
              const baseActive = isActive
                ? (isSidebarOpen ? 'text-text font-bold' : 'bg-primary text-white shadow-lg shadow-primary/30')
                : 'text-gray-500 hover:text-text hover:bg-gray-50';
              const guideRing = isHistoryGuide ? ' ring-2 ring-accent shadow-lg' : '';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    routerNavigate(`/app/${item.id}`);
                  }}
                  className={`flex items-center transition-all duration-200 w-full
                    ${isSidebarOpen ? 'gap-3 px-2 py-2 rounded-lg text-left justify-start' : 'justify-center p-3 rounded-xl'}
                    ${baseActive}${guideRing}
                  `}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  {/* Logic: Open -> Text Only. Closed -> Icon Only. */}
                  {!isSidebarOpen && <item.icon className="w-5 h-5" />}
                  {isSidebarOpen && <span className="text-base">{item.label}</span>}
                </button>
              );
            })}
        </nav>

        {/* Sidebar Footer: User & Logout */}
        <div className={`mt-auto flex flex-col gap-4 w-full ${isSidebarOpen ? 'items-start' : 'items-center'}`}>
            {/* Onboarding Guide Trigger */}
            <button
              type="button"
              onClick={openGuide}
              className={`flex items-center w-full text-left text-sm rounded-lg transition-all duration-200 ${isSidebarOpen ? 'gap-3 px-2 py-2' : 'justify-center p-3'} text-gray-500 hover:text-text hover:bg-gray-50`}
            >
              <Compass className="w-4 h-4" />
              {isSidebarOpen && <span>{t('onboarding.action.start')}</span>}
            </button>

            {user && (
                <>
                    {/* User Info (Only expanded) or Avatar (Collapsed) */}
                    <div className={`flex items-center gap-3 px-2 ${isSidebarOpen ? 'w-full' : ''}`}>
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-text truncate">{user.name}</div>
                                <div className="text-xs text-gray-400 truncate">{user.email}</div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`
                            flex items-center transition-all duration-200 w-full text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed
                            ${isSidebarOpen ? 'gap-3 px-2 py-2 justify-start' : 'justify-center p-3'}
                        `}
                        title={!isSidebarOpen ? "登出" : undefined}
                    >
                        {isLoggingOut ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            <LogOut className="w-5 h-5" />
                        )}
                        {isSidebarOpen && (
                          <span className="text-base font-medium">
                            {isLoggingOut ? t('layout.logout.loading') : t('layout.logout.label')}
                          </span>
                        )}
                    </button>
                </>
            )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-background z-50 px-6 py-4 flex items-center justify-between shadow-sm md:shadow-none">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              navigate('dashboard');
              routerNavigate('/app/dashboard');
            }}
          >
            <span className="text-xl font-extrabold tracking-tight text-text">
              LOGO
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen((open) => !open)}
                className="p-1.5 rounded-full text-gray-500 hover:text-text hover:bg-gray-100 transition-colors"
                aria-label="Toggle language menu"
              >
                <Globe2 className="w-5 h-5" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-28 rounded-xl bg-white border border-gray-200 shadow-lg py-1 text-xs z-[10000]">
                  <button
                    type="button"
                    onClick={() => {
                      void i18n.changeLanguage('zh-TW');
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      i18n.language === 'zh-TW' ? 'font-semibold text-text' : 'text-gray-600'
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
                    className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                      i18n.language === 'en' ? 'font-semibold text-text' : 'text-gray-600'
                    }`}
                  >
                    {t('login.language.en')}
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6" />
            </button>
          </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-background z-40 pt-20 px-8">
              {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        navigate(item.id);
                        routerNavigate(`/app/${item.id}`);
                        setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 w-full text-left py-4 text-lg border-b border-gray-100"
                >
                    <item.icon className="w-5 h-5 text-gray-400" />
                    {item.label}
                </button>
            ))}
            <button
                type="button"
                onClick={() => {
                    openGuide();
                    setMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 w-full text-left py-4 text-lg border-b border-gray-100 text-gray-500 hover:text-text"
            >
                <Compass className="w-5 h-5 text-gray-400" />
                {t('onboarding.action.start')}
            </button>
            {user && (
                <button
                    onClick={async () => {
                        setIsLoggingOut(true);
                        await new Promise(resolve => setTimeout(resolve, 800));
                        try {
                            await supabase.auth.signOut();
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.error('[Supabase] signOut failed:', error);
                        }
                        logout();
                        setMobileMenuOpen(false);
                        routerNavigate('/app/login');
                    }}
                    disabled={isLoggingOut}
                    className="flex items-center gap-4 w-full text-left py-4 text-lg border-b border-gray-100 text-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoggingOut ? (
                        <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    {isLoggingOut ? t('layout.logout.loading') : t('layout.logout.label')}
                </button>
            )}
          </div>
      )}

      {/* Main Content */}
      <main 
        className={`
            flex-1 p-6 md:p-12 pt-20 md:pt-8 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
        `}
      >
        {/* Top Header Area (desktop only, mobile uses its own header) */}
        <header className="hidden md:flex justify-end items-center mb-10 h-10">
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
                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                    i18n.language === 'zh-TW' ? 'font-semibold text-text' : 'text-gray-600'
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
                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-50 ${
                    i18n.language === 'en' ? 'font-semibold text-text' : 'text-gray-600'
                  }`}
                >
                  {t('login.language.en')}
                </button>
              </div>
            )}
          </div>
        </header>

        {children}

        {isGuideOpen && (
          <div className="fixed inset-0 z-[10000] bg-black/40 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full md:h-auto md:w-auto pointer-events-auto">
              <Onboarding onClose={closeGuide} navigatePage={navigate} />
            </div>
          </div>
        )}
      </main>

    </div>
  );
};
