# 系統架構文件 / System Architecture Document

本文件描述系統的功能邊界與技術架構，作為開發與維護之主要參考依據。

This document defines the functional boundaries and technical architecture of the system, serving as the primary reference for development and maintenance.

---

## 一、技術堆疊 / Tech Stack

| 層級 / Layer                | 技術 / Technology                    | 說明 / Description                                                                     |
| --------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| 前端與 API / Frontend & API | Vercel + Vercel Serverless Functions | 靜態前端部署與無伺服器 API 端點 / Static frontend hosting and serverless API endpoints |
| 資料庫 / Database           | Supabase (PostgreSQL)                | 主要關聯式資料庫 / Primary relational database                                         |
| 檔案儲存 / File Storage     | Dropbox API                          | 附件管理（PDF）/ Attachment management (PDF)                                           |

---

## 二、角色與權限模型 / Role & Permission Model

| 角色 / Role                       | 說明 / Description                                       | 資料存取 / Data Access                    |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------- |
| 訪客 / Guest                      | 未登入使用者 / Unauthenticated user                      | 無 / None                                 |
| 會員（未審核）/ Member (Pending)  | 已註冊，待管理員審核 / Registered, awaiting admin review | 僅限個人資料編輯 / Profile editing only   |
| 會員（已審核）/ Member (Approved) | 通過審核之會員 / Reviewed and approved member            | 完整資料檢索與詳情查看 / Full data access |
| 系統管理員 / Admin                | 後台管理人員 / Backend administrator                     | 全功能存取 / Full system access           |

---

## 三、功能模組邊界 / Functional Module Boundaries

### 3.1 身份驗證系統 / Authentication System

**範圍內 / In Scope**

- Email 註冊 + 自動發送驗證信 / Email registration with verification email
- Google Social Login
- 新帳號預設為「未審核」狀態 / New accounts default to "Pending" status
- Admin 手動審核通過機制 / Manual approval by Admin

**範圍外 / Out of Scope**

- 其他第三方登入（如 Facebook、LINE）/ Other social logins (e.g. Facebook, LINE)
- 自動化審核邏輯 / Automated approval logic

---

### 3.2 資料庫模組 / Database Modules

**範圍內 / In Scope**

- 地址資訊模組 (Address Info)：地理、地價、房產資料 / Geographic, land price, and property data
- 用戶資料模組 (Users)：帳號、密碼雜湊、基本資訊、審核狀態 / Account, password hash, profile, approval status

---

### 3.3 會員中心 / Member Center

**範圍內 / In Scope**

- 個人基本資訊編輯，所有已登入帳號均可操作（含未審核）/ Profile editing available to all logged-in users, including pending members

**範圍外 / Out of Scope**

- 未審核會員無法使用資料檢索與詳情查看功能 / Pending members cannot access data list or detail pages

---

### 3.4 資料列表頁 / Data List Page

限已審核會員與 Admin / Available to Approved Members and Admin only

**範圍內 / In Scope**

篩選功能 / Filters:

- 資料類型 / Filter by Type
- 市中心／精華區 / Filter by Downtown
- 價格區間 / Filter by Price Range
- 資產類型 / Filter by Asset Type

排序功能 / Sorts:

- 建立日期 / Sort by Created Date
- 更新日期 / Sort by Updated Date

- 點擊資料項目時顯示確認提示視窗（防誤觸），使用者確認後方可進入詳情頁  
  / Confirm dialog shown before navigating to detail page (prevents accidental access to sensitive data)

---

### 3.5 資料詳情頁 / Data Detail Page

限已審核會員與 Admin / Available to Approved Members and Admin only

**範圍內 / In Scope**

- 別名／來源標籤 / Alias & Source Labels:
  - 同行開發標籤（來源：Web 外部蒐集）/ Peer development tag (source: external web)
  - 高鐵開發標籤（來源：Government 政府公開資料）/ HSR development tag (source: government open data)
  - 大樓開發標籤（來源：Address 地址關聯資料）/ Building development tag (source: address data)
- Google Map 內嵌地圖，依地址動態標記 / Embedded Google Map with dynamic address pin
- Dropbox PDF 附件下載（觸發下載時自動寫入 Access Log）/ PDF download via Dropbox API (triggers Access Log entry)
- 單張主要照片展示 / Single main photo display
- 進入頁面時自動寫入 Access Log / Access Log entry written on page entry

---

### 3.6 後台管理系統 / Admin Dashboard

限 Admin 帳號 / Admin accounts only

**範圍內 / In Scope**

- 土地建物資料維護：新增、修改、刪除 / Asset data management: create, update, delete
- 管理員分權標籤設定 / Admin role tag management:
  - 最高管理員 / Super Admin
  - 一般經理人 / Manager
- Access Log 查看：全覽模式 + 依指定人員篩選 / Access Log viewer: full view + filter by user/admin
- Access Log 為手動維護，無自動清理邏輯 / Access Log is manually maintained; no automatic cleanup

---

## 四、稽核日誌觸發點 / Access Log Trigger Points

| 觸發事件 / Trigger Event           | 說明 / Description                                                       |
| ---------------------------------- | ------------------------------------------------------------------------ |
| 進入資料詳情頁 / Enter Detail Page | 通過防誤觸確認後自動寫入 / Written automatically after confirm dialog    |
| 下載 PDF / Download PDF            | 觸發 Dropbox 下載時自動寫入 / Written when Dropbox download is triggered |
