# Week 11 Lab：MERN Stack - Express API 實戰與 MongoDB CRUD

本專案實作了一個 Express.js 後端 API，搭配 MongoDB 進行報名系統的 CRUD 操作，並符合分頁與 Email 唯一性檢查等進階要求。

## 專案成果展示與 API 驗證

### 1. 服務啟動狀態
確認 MongoDB 容器和 Node.js 服務都已成功運行。

#### Docker 容器狀態 (`docker ps`)
* **啟動指令：** `docker compose up -d`
![Docker 容器運行狀態截圖](assets/docker_ps.png)

#### Node.js 伺服器啟動 Log
* **啟動指令：** `npm run dev`
> [DB] Connected to MongoDB
> Server running on http://localhost:3001
![Node.js伺服器啟動截圖](assets/Nodejs.png)

---

### 2. 環境變數說明 (`.env` 範例)
**【Lab 要求】** 說明專案的環境配置。

本專案的環境變數設定如下：
```env
PORT=3001
MONGODB_URI=mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11
ALLOWED_ORIGIN=http://localhost:5173
```


### 3. CRUD API 測試結果

#### 0 狀態檢查
GET http://localhost:3001/health

#### 1 建立報名 (Create) - 獲取 ID
POST http://localhost:3001/api/signup
Content-Type: application/json

{ "name": "Lab Test User", "email": "test-user-{{$randomInt}}@example.com", "phone": "0988777666", "interests": ["全端"] }

#### 2 Email 唯一性驗證 (409 Conflict)
# 請執行兩次，第二次應返回 409
POST http://localhost:3001/api/signup
Content-Type: application/json

{ "name": "重複測試", "email": "duplicate-test@example.com", "phone": "0911000111" }

#### 3 查看清單 - 分頁功能驗證
GET http://localhost:3001/api/signup?page=2&limit=2

#### 4 更新報名資料 (Update)
# 請將 [YOUR_ID_HERE] 替換成步驟 1 複製的 ID
PATCH http://localhost:3001/api/signup/[YOUR_ID_HERE]
Content-Type: application/json

{ "phone": "0900000000", "status": "confirmed" }

#### 5 刪除報名資料 (Delete)
# 請將 [YOUR_ID_HERE] 替換成步驟 1 複製的 ID
DELETE http://localhost:3001/api/signup/[YOUR_ID_HERE]

---

### 3. 資料持久化驗證 (MongoDB Compass)

確認資料已正確持久化到 MongoDB 集合中。

![MongoDB Compass 中的 participants 集合內容截圖] (./assets/mongo_compass.png)