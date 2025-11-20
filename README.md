<div align="center">
<img width="200" alt="Unload Logo" src="./public/logo.svg" />
</div>

# Unload - 心靈卸載應用

> 給自己一點喘息的時間吧

**Unload** 是一個幫助你記錄、整理和釋放心中煩惱的應用程式。透過簡單直觀的介面，讓你能夠輕鬆地將日常的擔憂和煩惱記錄下來，並透過視覺化的方式追蹤你的情緒變化。

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

## 💾 資料儲存

所有使用者資料都儲存在瀏覽器的 `localStorage` 中，包括：
- 使用者資訊
- 記錄的任務和煩惱
- 通知和系統訊息

**隱私保障**：你的所有資料都只存在你的瀏覽器中，不會上傳到任何伺服器。

## 📝 使用指南

### 1. 登入
點擊「馬上試用」按鈕進入應用程式。

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

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**給自己一點喘息的時間吧。** 🌿
