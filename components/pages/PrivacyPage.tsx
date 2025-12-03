import React from 'react';
import { FadeIn } from '../ui/FadeIn';
import { ShieldCheck, Fingerprint, Eye } from 'lucide-react';

export const PrivacyPage = () => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="max-w-3xl mx-auto px-6">
      <FadeIn>
        <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4">PRIVACY</span>
        <h1 className="text-3xl font-light text-primary mb-8">隱私承諾與資料約定</h1>

        <div className="space-y-10 text-primary-light font-light leading-loose border-t border-secondary-light/40 pt-10">
          <p className="text-lg text-primary font-normal">
            Unload 心輕日誌 是一套專注於職場心理邊界的覺察工具，同時也是一個以 MIT 授權釋出的開源專案。我們知道，高敏感族群與在意邊界的人，對於「自己的資料被怎麼使用」格外敏感，因此這份隱私約定，不只是法律文字，更是我們對保護您內在空間與使用痕跡的具體承諾。
          </p>

          <div className="grid gap-8">
            <div className="bg-white p-6 rounded-lg border border-secondary-light/30 hover:border-secondary-accent/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-secondary-accent" />
                <h3 className="text-lg font-medium text-primary">資料使用目的</h3>
              </div>
              <p className="text-sm">
                我們所收集的資訊，將主要用於提供與維護本服務、改善使用體驗，以及進行匿名或彙總的統計分析。此外，我們可能不定期於官方網站或相關管道發放問卷調查，蒐集您自願提供的回饋與建議，用於優化系統設計與內容品質。除本頁說明或法律要求外，這些資料不會被用於與本服務無關的其他用途。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-secondary-light/50">
              <div className="flex items-center gap-3 mb-3">
                <Fingerprint className="w-5 h-5 text-secondary-accent" />
                <h3 className="text-lg font-medium text-primary">關於您的權利</h3>
              </div>
              <p className="text-sm">
                若您不希望持續收到與服務相關的問卷調查或聯繫，或對個人資料的使用方式有任何疑問，您可以隨時透過頁面上提供的聯絡方式告知。我們會在合理範圍內協助處理您的請求。相關紀錄僅在提供服務、維護系統運作與進行必要分析所需的期間內被保留，不會被用於與本服務無關的其他用途。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-secondary-light/50">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-secondary-accent" />
                <h3 className="text-lg font-medium text-primary">第三方規則</h3>
              </div>
              <p className="text-sm">
                除了法律強制要求外，我們絕不會將您的資料出售、交換或揭露給任何第三方廣告商或機構。這是一個封閉且安全的自我對話空間。
              </p>
            </div>
          </div>

          <div className="text-sm text-primary-light/60 mt-12 pt-8 border-t border-secondary-light/20">
            若有任何隱私疑慮，歡迎直接聯繫：
            <a
              href="mailto:support@unloadjournal.site"
              className="border-b border-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
            >
              support@unloadjournal.site
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
);
