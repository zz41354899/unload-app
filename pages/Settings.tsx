import React, { useState } from 'react';
import { useAppStore } from '../store';
import { testApiKey } from '../lib/apiClient';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface SettingsProps {
  navigate: (page: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const { apiKey, setApiKey, showToast } = useAppStore();
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestApiKey = async () => {
    if (!inputValue.trim()) {
      showToast('請輸入 API Key', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testApiKey(inputValue.trim());
      setTestResult(result);
      
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '測試失敗';
      setTestResult({
        success: false,
        message: `測試失敗：${errorMessage}`
      });
      showToast(`測試失敗：${errorMessage}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!inputValue.trim()) {
      showToast('請輸入 API Key', 'error');
      return;
    }

    if (!testResult?.success) {
      showToast('請先驗證 API Key', 'error');
      return;
    }

    setApiKey(inputValue.trim());
    showToast('API Key 已保存', 'success');
  };

  const handleClearApiKey = () => {
    setApiKey(null);
    setInputValue('');
    setTestResult(null);
    showToast('API Key 已清除', 'success');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('dashboard')}
            className="text-accent hover:text-primary transition-colors mb-4 flex items-center gap-2"
          >
            ← 返回
          </button>
          <h1 className="text-4xl font-bold text-text mb-2">設定</h1>
          <p className="text-muted">管理你的 API Key 和應用設定</p>
        </div>

        {/* API Key Section */}
        <div className="bg-surface rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-text mb-6">Google Gemini API Key</h2>

          {/* Current Status */}
          {apiKey && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Check size={20} />
                <span>API Key 已設定</span>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text mb-3">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="輸入你的 Google Gemini API Key"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-text placeholder-gray-400"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-muted mt-2">
              你可以在 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google AI Studio</a> 獲取免費的 API Key
            </p>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`mb-6 p-4 rounded-lg border ${
              testResult.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`flex items-center gap-2 ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.success ? (
                  <Check size={20} />
                ) : (
                  <X size={20} />
                )}
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleTestApiKey}
              disabled={isTesting || !inputValue.trim()}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isTesting ? '測試中...' : '測試 API Key'}
            </button>
            <button
              onClick={handleSaveApiKey}
              disabled={!testResult?.success}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              保存 API Key
            </button>
            {apiKey && (
              <button
                onClick={handleClearApiKey}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
              >
                清除
              </button>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">如何獲取 API Key？</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>訪問 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
            <li>點擊「Create API Key」按鈕</li>
            <li>選擇「Create new secret key in new project」</li>
            <li>複製生成的 API Key</li>
            <li>將 API Key 貼到上方的輸入框</li>
            <li>點擊「測試 API Key」驗證有效性</li>
            <li>點擊「保存 API Key」保存設定</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
