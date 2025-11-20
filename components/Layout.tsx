
import React, { useState } from 'react';
import { Feather, LayoutDashboard, History, Menu, PanelLeft, LogOut, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  navigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, navigate }) => {
  const { user, logout, toast } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const navItems = [
    { id: 'dashboard', label: '儀錶板', icon: LayoutDashboard },
    { id: 'history', label: '歷史記錄', icon: History },
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
           {/* Logo Group */}
           {isSidebarOpen ? (
               <div 
                 className="flex items-center gap-2 cursor-pointer" 
                 onClick={() => navigate('dashboard')}
               >
                  <img src="/logo.svg" alt="Unload Logo" className="w-[140px] h-10 object-contain" />
               </div>
           ) : (
               <div 
                 className="cursor-pointer p-2" 
                 onClick={() => navigate('dashboard')}
               >
                  <img src="/logo-m.svg" alt="Unload Logo" className="w-8 h-8 object-contain" />
               </div>
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
                    導覽
                </div>
            )}
            
            {navItems.map((item) => (
            <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`
                    flex items-center transition-all duration-200 w-full
                    ${isSidebarOpen ? 'gap-3 px-2 py-2 rounded-lg text-left justify-start' : 'justify-center p-3 rounded-xl'}
                    ${currentPage === item.id 
                        ? (isSidebarOpen ? 'text-text font-bold' : 'bg-primary text-white shadow-lg shadow-primary/30') 
                        : 'text-gray-500 hover:text-text hover:bg-gray-50'}
                `}
                title={!isSidebarOpen ? item.label : undefined}
            >
                {/* Logic: Open -> Text Only (matches PDF). Closed -> Icon Only. */}
                {!isSidebarOpen && <item.icon className="w-5 h-5" />}
                {isSidebarOpen && <span className="text-base">{item.label}</span>}
            </button>
            ))}
        </nav>

        {/* Sidebar Footer: User & Logout */}
        <div className={`mt-auto flex flex-col gap-4 w-full ${isSidebarOpen ? 'items-start' : 'items-center'}`}>
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
                                <div className="text-xs text-gray-400 truncate">Free Plan</div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => logout()}
                        className={`
                            flex items-center transition-all duration-200 w-full text-red-500 hover:bg-red-50 rounded-xl
                            ${isSidebarOpen ? 'gap-3 px-2 py-2 justify-start' : 'justify-center p-3'}
                        `}
                        title={!isSidebarOpen ? "登出" : undefined}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="text-base font-medium">登出</span>}
                    </button>
                </>
            )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-background z-50 px-6 py-4 flex justify-between items-center shadow-sm md:shadow-none">
          <div className="flex items-center gap-2">
             <img src="/logo-m.svg" alt="Unload Logo" className="w-8 h-8 object-contain" />
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
          </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-background z-40 pt-20 px-8">
              {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => {
                        navigate(item.id);
                        setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 w-full text-left py-4 text-lg border-b border-gray-100"
                >
                    <item.icon className="w-5 h-5 text-gray-400" />
                    {item.label}
                </button>
            ))}
            {user && (
                <button
                    onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 w-full text-left py-4 text-lg border-b border-gray-100 text-red-500"
                >
                    <LogOut className="w-5 h-5" />
                    登出
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
        {/* Top Header Area - Spacer primarily now */}
        <header className="flex justify-end items-center mb-10 h-10">
           {/* User info moved to sidebar */}
        </header>

        {children}
      </main>

    </div>
  );
};
