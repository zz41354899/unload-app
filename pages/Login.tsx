
import React, { useState } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { useAppStore } from '../store';

interface LoginProps {
  navigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
  const { login } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // 模擬登入延遲
    await new Promise(resolve => setTimeout(resolve, 800));
    login();
    navigate('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        {/* Logo Corner */}
        <a href="https://unload.zeabur.app/" className="absolute top-8 left-8 flex items-center gap-2">
            <img src="/logo.svg" alt="Unload Logo" className="w-[140px] h-10 object-contain" />
        </a>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 bg-background">
            <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <img src="/logo-m.svg" alt="Unload Logo" className="w-10 h-10 object-contain" />
                </div>
                
                <h1 className="text-3xl font-bold mb-6 text-text">登入</h1>
                <h2 className="text-xl font-bold text-text mb-2">歡迎回到 Unload</h2>
                <p className="text-lg text-text font-bold mb-8">釐清脈絡，照顧自己</p>

                <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-primary text-white rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-[#1e2b1e] transition-all mb-8 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            <span className="font-bold text-lg tracking-wide">登入中...</span>
                        </>
                    ) : (
                        <>
                            <span className="font-bold text-lg tracking-wide">馬上試用</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-500 mt-8">
                    開始之前，請先了解我們的 <span className="underline cursor-pointer">服務條款</span> 與 <span className="underline cursor-pointer">隱私權政策</span>。
                </p>
            </div>
        </div>
    </div>
  );
};
