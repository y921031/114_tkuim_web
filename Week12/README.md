# Week 12 - 使用者登入與權限控管 (Authentication & Authorization)

本專案為網頁程式設計 Week 12 課程實作，重點在於將 Express + MongoDB 系統加入完整的**身分驗證**與**權限管理**機制。

## 功能特色

1.  **安全性升級**：
    * 密碼使用 `bcrypt` 進行雜湊加密（Salt rounds: 10），資料庫不儲存明碼。
    * API 使用 `JWT (JSON Web Token)` 進行 stateless 驗證。
2.  **角色權限 (RBAC)**：
    * **一般學員 (Student)**：僅能查詢與刪除「自己建立」的資料。
    * **管理員 (Admin)**：擁有上帝視角，可查詢所有使用者的資料，並刪除任何資料。
3.  **前後端整合**：
    * 前端實作登入頁面、Token 儲存 (localStorage) 與自動帶入 Header。
    * Dashboard 根據角色顯示對應的資料內容。

---

## 🛠️ 啟動方式 (Startup)

### 1. 啟動資料庫
請在專案根目錄 (`Week12/`) 執行：
```bash
docker compose up -d
```

### 2. 啟動後端伺服器 (Server)

請進入 server 資料夾並啟動：

`cd server
npm install    # 若第一次執行需安裝套件
npm run dev`

- 伺服器將運行於：`http://localhost:3001`
- 確認終端機顯示 `Successfully connected to MongoDB`。

### 3. 啟動前端頁面 (Client)

由於瀏覽器 CORS 安全限制，**請勿直接雙擊開啟 HTML**。

1. 使用 VS Code 開啟 `client/index.html`。
2. 點擊右下角的 **"Go Live"** 按鈕 (需安裝 Live Server 套件)。
3. 或右鍵點擊檔案選擇 **"Open with Live Server"**。

---

## 👥 測試帳號列表 (Test Accounts)

本專案已建立以下兩組測試帳號，可用於驗收權限差異：

| **角色 (Role)** | **Email** | **密碼** | **權限說明** |
| --- | --- | --- | --- |
| **超級管理員** | `super@test.com` | `123` | ✅ 可看見所有人資料
✅ 可刪除任何人資料 |
| **一般學員** | `mytest@test.com` | `123` | 👁️ 僅能看見自己新增的資料
❌ 無法刪除他人資料 |

> 備註：若需新增其他測試帳號，可使用 Postman 發送 POST 請求至 /auth/signup。
> 

---

## 🧪 驗收測試流程

### 1. 學生權限測試 (Student)

1. 使用 `mytest@test.com` / `123` 登入。
2. 在儀表板上方「新增」一筆資料（例如：`我是學生建立的資料`）。
3. 確認列表出現該筆資料。
4. 按下右上角「登出」。

### 2. 管理員權限測試 (Admin)

1. 使用 `super@test.com` / `123` 登入。
2. **關鍵驗收點**：列表中應該要能看到剛剛學生建立的那筆資料（證明 Admin 可視範圍為全域）。
3. 點擊該筆資料旁的「刪除」按鈕。
4. **關鍵驗收點**：系統提示「刪除成功」，資料消失（證明 Admin 擁有最高管理權，可刪除他人資料）。

---

## 📂 專案結構說明

Plaintext

`Week12/
├── docker-compose.yaml      # MongoDB 容器設定
├── docker/
│   └── mongo-init.js        # 資料庫初始化 (建立索引、Admin 帳號)
├── server/
│   ├── .env                 # 環境變數 (含 JWT_SECRET, ALLOWED_ORIGIN)
│   ├── middleware/
│   │   └── auth.js          # JWT 驗證守門員 (解析 Token)
│   ├── routes/
│   │   ├── auth.js          # 認證路由 (Login / Signup)
│   │   └── signup.js        # 報名資料 CRUD (含 req.user 權限判斷)
│   ├── repositories/        # 資料庫存取層 (分離 DB 邏輯)
│   └── scripts/
│       └── hash-password.js # 密碼雜湊產生工具
└── client/
    ├── index.html           # 登入頁面
    ├── dashboard.html       # 資料管理儀表板
    └── js/
        ├── login.js         # 處理登入邏輯
        └── signup_form.js   # 處理 CRUD 與 Token Header`
