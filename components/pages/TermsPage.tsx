import React from 'react';
import { FadeIn } from '../ui/FadeIn';
import { BatteryWarning, GitMerge, FileText, Smile } from 'lucide-react';

export const TermsPage = () => (
  <div className="pt-32 pb-20 min-h-screen">
    <div className="max-w-3xl mx-auto px-6">
      <FadeIn>
        <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4">TERMS</span>
        <h1 className="text-3xl font-light text-primary mb-8">平台使用約定</h1>

        <div className="space-y-10 text-primary-light font-light leading-loose border-t border-secondary-light pt-10">
          <p className="text-lg text-primary font-normal">
            歡迎來到 Unload。這是一套聚焦職場心理邊界的覺察工具，同時也是一個以 MIT 授權釋出的開源專案，目前仍處於長期 Beta 測試與持續調整階段。本頁說明的是使用本服務時彼此之間的基本約定，協助我們維持一個基於互信、尊重與安全的內在探索環境。
          </p>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <BatteryWarning className="w-4 h-4 text-secondary-accent" />
                這不是醫療服務 (Non-Medical)
              </h3>
              <p className="text-sm">
                Unload 可被視為一面協助觀察自身狀態的「鏡子」，而非「醫生」。介面與文字僅提供心理學相關的引導與反思架構，<strong>不構成專業醫療診斷、諮商或治療</strong>。若身心狀態感到難以負荷，建議直接尋求合格醫師或心理師的協助。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-secondary-accent" />
                Beta 測試階段 (Beta Phase)
              </h3>
              <p className="text-sm">
                目前本服務仍處於開發與 Beta 測試階段，功能與介面可能會隨時調整或更新，偶爾亦可能出現不穩定或無法預期的狀況。我們會盡力維護服務品質，但不保證任何時刻皆完全無錯誤或不中斷。您在此階段的使用與回饋，將成為我們持續改進本服務的重要參考。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary-accent" />
                內容歸屬 (Ownership)
              </h3>
              <p className="text-sm">
                簡單來說：<strong>平台屬於我們，故事屬於使用者。</strong>
                <br />
                Unload 的介面設計與程式碼由平台維護與管理，並以 MIT 開源授權條款釋出，您得依該授權條款的內容使用、重製、修改與散布本專案程式碼。但您在本服務中撰寫的日記、反思內容與其他個人輸入，之智慧財產權仍完全歸屬於您本人；除法律要求或您另行明示同意外，我們不會以可識別您身分的方式公開這些內容。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary-accent" />
                開源與貢獻 (Open Source & Contributions)
              </h3>
              <p className="text-sm space-y-1">
                <span>
                  Unload 的程式碼將會公開於 GitHub，以 MIT 授權條款釋出，歡迎任何人檢視、fork、提出 Issue 或發送 Pull Request。為了維持專案品質與使用者隱私，若您打算在 GitHub 上貢獻程式碼，請同意並遵守以下原則：
                </span>
                <br />
                <span>．請遵守專案說明中所列的 MIT 授權與貢獻指南，不新增與此相牴觸的額外限制。</span>
                <br />
                <span>．在發送 PR 前，建議先於 Issue 區說明動機與設計想法，並盡量以小而清楚的修改單位提交變更。</span>
                <br />
                <span>．請避免在程式碼、測試資料或討論紀錄中加入任何真實個資或可識別使用者身分的內容。</span>
                <br />
                <span>．請尊重現有的程式風格與架構設計，必要時可提出重構建議，但不以破壞性方式推翻整體方向。</span>
                <br />
                <span>．所有被接受併入主分支的貢獻內容，將以 MIT 授權條款對外釋出，您同意不再就該部分主張額外權利或要求個別對價。</span>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <Smile className="w-4 h-4 text-secondary-accent" />
                意見回饋與問卷調查 (Feedback & Surveys)
              </h3>
              <p className="text-sm">
                您在使用本服務期間，可能會不定期收到來自本服務或官方網站發送之問卷調查或意見回饋邀請。您可自由選擇是否參與，並得於問卷中填寫您對本服務或相關功能之看法與建議。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                <Smile className="w-4 h-4 text-secondary-accent" />
                友善使用 (Respect)
              </h3>
              <p className="text-sm">
                使用本工具時，假設所有參與者都在盡力照顧自己。請避免破壞系統安全或進行任何非法行為；若發生明顯違規，平台保有調整或終止服務的彈性空間。
              </p>
            </section>
          </div>

          <div className="text-sm text-primary-light/60 mt-12 pt-8 border-t border-secondary-light/30">
            最後更新日期：2025 年 11 月 01 日
          </div>
        </div>
      </FadeIn>
    </div>
  </div>
);
