# Unload 心輕日誌 - 職場心理邊界覺察工具

> 給高敏感與在意邊界的人，一個比較安全的緩衝區。

**Unload 心輕日誌** 是一套聚焦「職場心理邊界」的覺察工具，同時也是一個以 **MIT 授權** 釋出的開源專案。目前仍處於長期 **Beta 測試階段**，功能與介面會隨著回饋持續調整。

透過引導式的紀錄流程與視覺化整理介面，Unload 心輕日誌 協助你把工作中的壓力、責任感與邊界混亂，拆解成比較能被看見與承接的片段，為高敏族群與在意邊界的人留出一點喘息空間。

## ✨ 功能特色

- **📝 覺察記錄** - 輕鬆記錄日常煩惱、擔憂和情緒
- **📊 情緒追蹤** - 視覺化圖表幫助你了解情緒模式
- **🎯 智能分類** - 按類別和責任人組織你的記錄
- **💾 本地儲存** - 所有資料安全地儲存在你的瀏覽器中
- **📱 響應式設計** - 在桌面和行動裝置上完美運作
- **🎨 現代化 UI** - 簡潔美觀的使用者介面

## 🚀 快速開始

### 系統需求

- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd unload
   ```

2. **安裝依賴套件**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **在瀏覽器開啟**
   ```
   http://localhost:3000
   ```

### 建置生產版本

```bash
npm run build
npm run preview
```

## 📁 專案結構

```
unload/
├── public/              # 靜態資源（logo、圖片等）
├── components/          # React 元件
│   ├── Layout.tsx      # 主要佈局元件
│   └── StepWizard.tsx  # 步驟嚮導元件
├── pages/              # 頁面元件
│   ├── Login.tsx       # 登入頁面
│   ├── Dashboard.tsx   # 儀錶板
│   ├── History.tsx     # 歷史記錄
│   └── NewTask.tsx     # 新增記錄
├── App.tsx             # 主應用程式元件
├── store.tsx           # 全域狀態管理（Context API）
├── types.ts            # TypeScript 型別定義
├── index.tsx           # 應用程式入口
├── index.html          # HTML 模板
└── vite.config.ts      # Vite 配置

```

## 🛠️ 技術棧

- **框架**：React 19 + TypeScript
- **構建工具**：Vite
- **樣式**：Tailwind CSS
- **狀態管理**：React Context API
- **圖表**：Recharts
- **圖標**：Lucide React
- **表單**：React Hook Form
- **驗證**：Zod

## 💾 資料儲存與隱私

Unload 心輕日誌 會根據實作環境，搭配後端服務與瀏覽器端儲存機制來保存資料，例如：

- 透過具備存取控管機制的後端資料庫（如 Supabase 搭配 Row Level Security）保存帳號與使用紀錄
- 使用瀏覽器端的 IndexedDB / localStorage 快取部分設定與狀態

具體的資料使用方式、保留期間與問卷調查相關說明，請以專案實際部署環境所提供的「隱私承諾」與「平台約定」頁面為準。

## 📝 使用指南

### 1. 登入
點擊「馬上登入」按鈕進入應用程式。

### 2. 記錄煩惱
在儀錶板中點擊「新增記錄」，填寫以下資訊：
- 煩惱類別（工作、生活、人際關係等）
- 具體內容
- 責任人分配
- 優先度

### 3. 查看統計
在儀錶板中查看：
- 情緒趨勢圖表
- 分類統計
- 最近的記錄

### 4. 檢視歷史
在「歷史記錄」頁面查看所有過往的記錄。

## 🎨 自訂設定

編輯 `index.html` 中的 Tailwind 配置來改變應用程式的主題顏色：

```javascript
colors: {
  background: '#F9F8F4',
  primary: '#2C3E2C',
  text: '#1E2A22',
  accent: '#1ABC9C',
  muted: '#9CA3AF',
  surface: '#FFFFFF',
}
```

## 📄 授權

本專案以 [MIT License](./LICENSE) 授權釋出，你可以依照 MIT 授權條款使用、重製、修改與散布本專案程式碼。

## 🤝 開源與貢獻

- 歡迎在 GitHub 上提出 Issue、發送 Pull Request，或分享你在實際職場情境中的使用經驗
- 建議在送出較大變更前，先於 Issue 中簡單說明動機與設計想法
- 請避免在程式碼、測試資料或討論中放入任何真實個資或可識別個人身分的內容

專案實際的貢獻指南與規範，請以 GitHub Repo 中的說明文件為準。

---

**給自己一點喘息的時間吧。** 🌿
