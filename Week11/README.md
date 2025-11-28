# Week 11 Lab：MERN Stack - Express API 實戰與 MongoDB CRUD

本專案實作了一個 Express.js 後端 API，搭配 MongoDB 進行報名系統的 CRUD 操作，並符合分頁與 Email 唯一性檢查等進階要求。
## 專案成果展示與 API 驗證

### 1. 服務啟動狀態
確認 MongoDB 容器和 Node.js 服務都已成功運行。

#### Docker 容器狀態 (`docker ps`)

![Docker 容器運行狀態截圖](assets/docker_ps.png)

#### Node.js 伺服器啟動 Log
> [DB] Connected to MongoDB
> Server running on http://localhost:3001
![Node.js伺服器啟動截圖](assets/Nodejs.png)

---

### 環境變數說明 (`.env` 範例)
本專案的環境變數設定如下：
```env
PORT=3001
MONGODB_URI=mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11
ALLOWED_ORIGIN=http://localhost:5173

---

### 2. CRUD API 測試結果

以下是使用 REST Client 測試 API 接口的截圖：
![GET 請求成功返回 200 狀態碼](assets/gett_200.png)

#### A. Create (POST /api/signup)
證明成功寫入資料庫並返回新 ID。
![POST 請求成功返回 201 狀態碼](assets/post_201.png)

#### B. Read (GET /api/signup)
證明成功讀取清單，包含 items 和 total 欄位。
![aGET 請求成功返回 200 狀態碼和清單](assets/get_200.png)

#### C. Update (PATCH /api/signup/:id)
證明可更新資料欄位 (例如 phone/status)。
![PATCH 請求成功返回 200 和 updated: 1] (./assets/patch_200.png)

---

### 3. 資料持久化驗證 (MongoDB Compass)

確認資料已正確持久化到 MongoDB 集合中。

![MongoDB Compass 中的 participants 集合內容截圖] (./assets/mongo_compass.png)