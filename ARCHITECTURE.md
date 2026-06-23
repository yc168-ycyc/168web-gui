# 系統架構文件 / System Architecture Document

本文件描述系統的功能邊界、角色權限、資料模組與 UI / 功能架構，作為開發與維護之主要參考依據。

This document defines the functional boundaries, roles and permissions, data modules, and UI / feature architecture of the system, serving as the primary reference for development and maintenance.

---

## 一、技術堆疊 / Tech Stack

| 層級 / Layer                | 技術 / Technology                    | 說明 / Description                                                                                      |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 前端與 API / Frontend & API | Vercel + Vercel Serverless Functions | 靜態前端部署與無伺服器 API 端點 / Static frontend hosting and serverless API endpoints                  |
| 資料庫 / Database           | Supabase (PostgreSQL)                | 主要關聯式資料庫 / Primary relational database                                                          |
| 檔案儲存 / File Storage     | Dropbox API                          | 案件附件與圖片檔案管理（PDF / images）/ Property attachments and image file management (PDF / images) |

### 檔案儲存策略補充 / File Storage Strategy Notes

延續使用 Dropbox API，原因如下：

- 適合集中管理案件相關附件與圖片 / Suitable for centralized management of property-related attachments and images
- 方便業務或管理端直接檢視與補件 / Convenient for operations or admins to inspect files and upload missing materials directly
- 對於後續補上傳圖片、附件之作業流程較直覺 / More intuitive for delayed upload workflows such as adding images or attachments later
- 已符合目前 PDF 下載需求，延伸至圖片管理可降低遷移成本 / Already satisfies current PDF download needs; extending it to image handling reduces migration cost

---

## 二、角色與權限模型 / Role & Permission Model

| 角色 / Role                       | 說明 / Description                                       | 資料存取 / Data Access                                                                 |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 訪客 / Guest                      | 未登入使用者 / Unauthenticated user                      | 僅可瀏覽首頁、登入、註冊 / Landing page, login, and registration only                  |
| 會員（未審核）/ Member (Pending)  | 已註冊，待管理員審核 / Registered, awaiting admin review | 可登入、編輯個人資料，不可瀏覽案件詳情 / Login and profile editing only                |
| 會員（已審核）/ Member (Approved) | 通過審核之會員 / Reviewed and approved member            | 可瀏覽公告、案件列表、案件詳情與部分聯絡資訊 / Access to announcements and properties |
| 系統管理員 / Admin                | 後台管理人員 / Backend administrator                     | 全功能存取 / Full system access                                                        |

### 權限補充規則 / Permission Notes

- 新帳號註冊後預設為未審核狀態 / New accounts default to Pending status after registration
- 未審核會員可登入，但不可使用案件瀏覽核心功能 / Pending members may log in, but cannot use core property browsing functions
- 已審核會員可瀏覽案件資料 / Approved members can browse property data
- 聯絡資訊存取不需額外審核流程，但特定案件類型（如公賣、公買）可另外限制 / Contact information does not require additional approval workflow, but specific categories such as public-sale / public-buy may have additional restrictions
- Admin 可管理會員、員工、公告與案件 / Admin can manage members, staff, announcements, and properties

---

## 三、功能模組邊界 / Functional Module Boundaries

### 3.1 首頁 / Landing Page

**範圍內 / In Scope**

- 顯示 Logo / Display logo
- 顯示首頁輪播圖片 / Homepage banner carousel
- 提供登入入口 / Login entry point
- 顯示服務大廳入口 / Service hall entry sections
- 顯示最新公告 / Latest announcements section

---

### 3.2 身份驗證系統 / Authentication System

**範圍內 / In Scope**

- 帳號登入 / Account login
- 忘記密碼 / Forgot password
- Google Social Login
- Email 註冊 / Email registration
- 註冊時填寫基本資料 / Basic profile form during registration
- 新帳號預設為未審核狀態 / New accounts default to Pending status
- Admin 手動審核通過機制 / Manual approval by Admin
- 登入成功後導回首頁 / Redirect to homepage after successful login

**範圍外 / Out of Scope**

- 其他第三方登入（如 Facebook、LINE）/ Other social logins (e.g. Facebook, LINE)
- 自動化審核邏輯 / Automated approval logic

---

### 3.3 公告系統 / Announcement System

**範圍內 / In Scope**

- 首頁最新公告區塊 / Homepage latest announcement block
- 公告列表 / Announcement list
- 公告內容查看 / Announcement detail view
- 公告置頂功能 / Pinned announcements
- 後台公告管理 / Admin announcement management
- 後台新增公告 / Admin create announcement
- 公告曝光度優化（首頁需更醒目）/ Higher visibility for announcements on homepage

**範圍外 / Out of Scope**

- 公告分級 / Announcement priority grading
- 公告自動下架 / Automatic expiration or unpublish logic

---

### 3.4 資料庫模組 / Database Modules

**範圍內 / In Scope**

- 用戶資料模組 (Users)：帳號、密碼雜湊、基本資訊、審核狀態 / Account, password hash, profile, approval status
- 公告模組 (Announcements)：公告標題、內容、置頂狀態、建立時間 / Announcement title, content, pinned flag, created time
- 案件模組 (Properties)：案件共用資料、類型、價格、面積、地址、圖片、附件 / Shared property data, type, price, area, address, images, attachments
- 案件類型模組 / Property category modules:
  - 同行開發 / Peer development
  - 建設土地 / Construction land
  - 大樓／社區 / Building / community
  - 透天 / Townhouse
  - 公寓 / Apartment
- 案件索取紀錄 / Property request records
- Access Log 稽核日誌 / Access logs

---

### 3.5 會員中心 / Member Center

**範圍內 / In Scope**

- 個人專區 / Member profile center
- 編輯會員資料 / Edit member profile
- 修改個人資訊 / Update personal information

**範圍外 / Out of Scope**

- 未審核會員不可使用案件核心瀏覽功能 / Pending members cannot use core property browsing functions

---

### 3.6 搜尋與篩選 / Search & Filter

**範圍內 / In Scope**

- 關鍵字搜尋 / Keyword search
- 條件篩選 / Conditional filtering
- 依案件類型切換 / Filter by property type
- 依價格、面積等欄位篩選 / Filter by price, area, and related fields

---

### 3.7 服務大廳 / Service Hall

**範圍內 / In Scope**

- 最新公告 / Latest announcements
- 建設土地 / Construction land entry
- 大樓 / Building entry
- 透天 / Townhouse entry
- 其他分類 / Other categories entry

---

### 3.8 物件瀏覽系統 / Property Browsing System

本系統依案件類型提供分層式瀏覽體驗，包含外層列表、內層詳情與完整資料檢視。

The system provides layered browsing experiences by property type, including outer list view, inner detail view, and full-detail view.

#### 3.8.1 同行開發 / Peer Development

**外層 / Outer Layer**

- 顯示案件圖片、地址、面積、價格、建物資訊 / Display image, address, area, price, and building info
- 提供查看詳細資料入口 / Entry to detailed view

**外層警告 / Outer Layer Warning**

- 若權限不足，顯示無法觀看詳細資料 / Show warning when user lacks permission to view detail

**內層 / Inner Layer**

- 顯示地圖、照片、詳細資料、取得聯絡方式 / Display map, images, detailed data, and contact access

**內層警告 / Inner Layer Warning**

- 若權限不足，禁止查看聯絡資訊 / Block contact info access when permission is insufficient

**完整資料 / Full Detail**

- 可查看所有圖片與完整資料 / View all images and complete data

#### 3.8.2 建設土地 / Construction Land

**外層 / Outer Layer**

- 顯示案件資訊、面積、價格、查看詳情 / Display property summary, area, price, and detail entry

**內層 / Inner Layer**

- 顯示土地照片、基本資訊、聯絡方式 / Display land images, basic information, and contact details

**完整資料 / Full Detail**

- 可瀏覽所有圖片 / View all images

#### 3.8.3 大樓／社區 / Building / Community

**外層 / Outer Layer**

- 顯示社區名稱、地址、價格、查看詳情 / Display community name, address, price, and detail entry

**內層 / Inner Layer**

- 顯示建案資訊、圖片、聯絡方式 / Display project info, images, and contact details

**完整資料 / Full Detail**

- 可查看全部圖片 / View all images

#### 3.8.4 透天 / Townhouse

**外層 / Outer Layer**

- 顯示案件資料、價格、面積 / Display property summary, price, and area

**內層 / Inner Layer**

- 顯示詳細資料與聯絡資訊 / Display detailed data and contact information

**完整資料 / Full Detail**

- 可取得聯絡方式 / Access contact information

#### 3.8.5 公寓 / Apartment

**外層 / Outer Layer**

- 顯示基本資料與圖片 / Display basic information and images

**內層 / Inner Layer**

- 顯示詳細資訊與聯絡方式 / Display detailed data and contact information

**完整資料 / Full Detail**

- 可取得完整聯絡資料 / Access full contact information

---

### 3.9 案件索取紀錄 / Property Request Records

**範圍內 / In Scope**

- 顯示已索取案件 / View requested properties
- 管理索取紀錄 / Manage request records
- 搜尋索取紀錄 / Search request records

**權限規則 / Permission Rule**

- 不需額外審核 / No additional approval required
- 不限制索取次數 / No request count limit
- 僅特定案件類型（如公賣、公買）可另行限制 / Only specific categories such as public-sale / public-buy may have separate restrictions

---

### 3.10 案件上架系統 / Property Listing Management

**範圍內 / In Scope**

- 上架案件（低總）/ Create low-total-price property listings
- 上架同行開發案件 / Create peer development listings
- 上架建設土地案件 / Create construction land listings
- 上架大樓／社區案件 / Create building / community listings
- 上架公寓案件 / Create apartment listings
- 上傳圖片 / Upload images
- 上傳附件 / Upload attachments
- 輸入地圖資訊 / Input map data
- 輸入聯絡資訊 / Input contact details
- 補上傳圖片與附件 / Delayed upload for images and attachments
- 支援 Excel 匯入基本資料 / Support Excel import for base data

**備註 / Notes**

- Excel 匯入規格另行定義 / Excel import specification will be defined separately
- 可先匯入基本資料，後續再補圖片與附件 / Base data can be imported first, followed by images and attachments later
- 第 30 與第 31 項公寓上架頁面可視為相近流程的不同 UI 版本 / Items 30 and 31 may be treated as alternate UI versions of apartment listing pages

---

### 3.11 後台管理系統 / Admin Dashboard

限 Admin 帳號 / Admin accounts only

**範圍內 / In Scope**

- 後台首頁：案件列表、管理功能、側邊選單 / Admin home with property list, management tools, and sidebar
- 會員管理：會員列表、啟用／停用、編輯、刪除 / Member management: list, enable/disable, edit, delete
- 員工管理：管理員帳號、編輯、新增 / Staff management: admin accounts, edit, create
- 公告編輯：公告列表、編輯公告 / Announcement management: list and edit
- 新增公告：編輯公告內容、發布公告 / Create and publish announcements
- 案件資料維護：新增、修改、刪除 / Property data management: create, update, delete
- Access Log 查看：全覽模式 + 依指定人員篩選 / Access Log viewer: full view + filter by user/admin
- 管理員分權標籤設定 / Admin role tag management:
  - 最高管理員 / Super Admin
  - 一般經理人 / Manager

**範圍外 / Out of Scope**

- Access Log 自動清理 / Automatic Access Log cleanup

---

## 四、稽核日誌觸發點 / Access Log Trigger Points

| 觸發事件 / Trigger Event               | 說明 / Description                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| 進入案件詳情頁 / Enter Property Detail | 進入內層或完整資料頁時可記錄存取 / Record access when entering inner or full-detail page |
| 下載 PDF / Download PDF                | 觸發 Dropbox 附件下載時自動寫入 / Written when Dropbox attachment download is triggered |
| 查看聯絡資訊 / View Contact Info       | 取得聯絡方式時可記錄 / May record when contact details are accessed                   |
| 索取案件 / Request Property            | 建立案件索取紀錄時可記錄 / May record when a property request record is created       |

---

## 五、UI 架構總覽 / UI Architecture Overview

### 公開區域 / Public Area

- 首頁 / Landing page
- 登入 / Login
- 註冊 / Registration
- 忘記密碼 / Forgot password

### 會員區域 / Member Area

- 服務大廳 / Service hall
- 公告查看 / Announcement viewing
- 各類案件列表 / Property lists by category
- 各類案件內層詳情 / Inner detail pages by category
- 完整資料頁 / Full-detail pages
- 搜尋與篩選 / Search and filter
- 個人專區 / Member profile center
- 案件索取紀錄 / Property request records

### 後台區域 / Admin Area

- 後台首頁 / Admin home
- 會員管理 / Member management
- 員工管理 / Staff management
- 公告管理 / Announcement management
- 案件上架與維護 / Property listing and maintenance
- Access Log 查閱 / Access log viewer

---

## 六、需求備註 / Requirement Notes

- Dropbox 持續作為附件與圖片儲存方案 / Dropbox remains the file storage solution for attachments and images
- Excel 匯入功能需支援標準格式，規格另行提供 / Excel import must support a standard format, to be provided separately
- 案件可先匯入基本資料，圖片與附件可後續補上傳 / Property base data may be imported first, with images and attachments uploaded later
- 公告欄需提高曝光度，並支援置頂 / Announcement area should be more prominent and support pinning
- 公賣與公買類型案件可設置額外限制 / Public-sale and public-buy categories may enforce additional restrictions