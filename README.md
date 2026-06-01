# 168 Web GUI

技術選型與實作說明文件，描述本專案各層的技術決策與達成方式。  
Technical stack and implementation reference for this project.

---

## 一、語言與執行環境 / Language & Runtime

| 項目 / Item        | 選型 / Choice               |
| ------------------ | --------------------------- |
| 語言 / Language    | TypeScript                  |
| 執行環境 / Runtime | Node.js (Vercel Serverless) |

全專案採用 TypeScript，前後端共用型別定義，減少介面不一致的風險。  
TypeScript is used across the entire project to share type definitions between frontend and API, minimizing interface mismatches.

---

## 二、前端技術 / Frontend

| 項目 / Item            | 選型 / Choice           |
| ---------------------- | ----------------------- |
| 框架 / Framework       | Vue 3 (Composition API) |
| 建置工具 / Build Tool  | Vite                    |
| UI 元件庫 / UI Library | Naive UI                |
| 部署 / Deployment      | Vercel (Static Hosting) |

- Vue 3 Composition API 搭配 `<script setup>` 語法，提升模組可讀性與型別推導能力。  
  Vue 3 Composition API with `<script setup>` for improved readability and TypeScript inference.
- Naive UI 提供完整的 TypeScript 支援，與 Vue 3 原生整合。  
  Naive UI offers full TypeScript support with native Vue 3 integration.

---

## 三、後端 API / Backend API

| 項目 / Item        | 選型 / Choice               |
| ------------------ | --------------------------- |
| 平台 / Platform    | Vercel Serverless Functions |
| 路由結構 / Routing | `/api/*` 目錄對應 HTTP 端點 |

API 邏輯部署為 Vercel Serverless Functions，每支函式對應一個獨立端點，無需維護常駐伺服器。  
API logic is deployed as Vercel Serverless Functions. Each function maps to a single HTTP endpoint with no persistent server to maintain.

---

## 四、資料庫與資料存取 / Database & Data Access

| 項目 / Item                | 選型 / Choice                   |
| -------------------------- | ------------------------------- |
| 資料庫 / Database          | Supabase (PostgreSQL)           |
| 存取方式 / Access Method   | supabase-js 內建 Query Builder  |
| 型別產生 / Type Generation | `supabase gen types typescript` |

使用 `supabase-js` 提供的 Query Builder 進行資料存取，搭配 Supabase CLI 自動從 schema 產生 TypeScript 型別，確保查詢與回傳值具備完整型別安全。  
Data access uses the supabase-js built-in Query Builder. TypeScript types are auto-generated from the database schema via Supabase CLI, ensuring full type safety on queries and responses.

---

## 五、身份驗證 / Authentication

| 項目 / Item                       | 選型 / Choice                   |
| --------------------------------- | ------------------------------- |
| 驗證服務 / Auth Service           | Supabase Auth                   |
| 支援方式 / Supported Methods      | Email + Password、Google OAuth2 |
| Session 管理 / Session Management | Supabase Auth 內建（JWT）       |

**Google OAuth2 實作流程 / Google OAuth2 Flow:**

1. 前端呼叫 `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. 使用者於 Google 完成授權後，重導回應用程式
3. Supabase Auth 接管 callback，建立 session 並回傳 JWT
4. 前端透過 `supabase.auth.getSession()` 取得當前使用者資訊

新帳號建立後預設為「未審核」狀態，須由 Admin 於後台手動審核，詳見 [ARCHITECTURE.md](./ARCHITECTURE.md)。  
New accounts default to "Pending" status and require manual Admin approval. See [ARCHITECTURE.md](./ARCHITECTURE.md) for role details.

---

## 六、檔案儲存 / File Storage

| 項目 / Item    | 選型 / Choice      |
| -------------- | ------------------ |
| 服務 / Service | Dropbox API        |
| 用途 / Purpose | PDF 附件上傳與下載 |

檔案操作透過後端 Serverless Function 代理，前端不直接持有 Dropbox 存取金鑰。下載行為同步寫入 Access Log，詳見 [ARCHITECTURE.md](./ARCHITECTURE.md)。  
File operations are proxied through backend Serverless Functions; the frontend never holds Dropbox credentials directly. Download events are logged to the Access Log.

---

## 七、本地開發啟動 / Local Development

```bash
# 安裝依賴 / Install dependencies
npm install

# 啟動開發伺服器 / Start dev server
npm run dev

# 產生 Supabase TypeScript 型別 / Generate Supabase types
npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
```

環境變數請參考 `.env.example`。  
Refer to `.env.example` for required environment variables.
