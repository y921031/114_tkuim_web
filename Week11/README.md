Week 11 Lab：MERN Stack - Express API 實戰與 MongoDB CRUD

本專案實作了一個 Express.js API，搭配 MongoDB 完成報名系統 CRUD，並具備 Email 唯一驗證、分頁功能與資料持久化。

專案啟動與環境需求
1️環境需求

Node.js 18+

Docker / Docker Compose

VS Code REST Client（API 測試用）

2️專案啟動指令

請確保位於專案根目錄，依序執行：

步驟	指令	說明
A	docker compose up -d	啟動 MongoDB（背景模式）
B	npm install	安裝後端相依套件
C	npm run dev	啟動 Express API（使用 nodemon）
3️服務啟動狀態驗證
服務	驗證方式	截圖（自行貼）
MongoDB	docker ps	[貼容器狀態]
Node.js	伺服器啟動 Log	[貼出 [DB] Connected to MongoDB ]
.env 配置

建立 .env 檔案並填入：

PORT=3001
MONGODB_URI=mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11
ALLOWED_ORIGIN=http://localhost:5173

變數說明
變數	說明
PORT	Express 伺服器啟用的 port
MONGODB_URI	MongoDB 連線字串（含帳密）
ALLOWED_ORIGIN	CORS 允許來源（前端）
REST Client API 測試（tests/api.http）

以下測試可直接複製到 tests/api.http 執行。

0️.Health Check
GET http://localhost:3001/health

1️.建立報名資料（Create）

預期：201 Created
請複製回傳的 ID 供後續使用。

POST http://localhost:3001/api/signup
Content-Type: application/json

{
  "name": "Lab Test User",
  "email": "test-user-{{$randomInt}}@example.com",
  "phone": "0988777666",
  "interests": ["全端"]
}


📸 [貼成功 201 截圖]

2️.更新報名資料（Update）

預期：200 OK
請將 [YOUR_ID_HERE] 換成步驟 1 的 ID。

PATCH http://localhost:3001/api/signup/[YOUR_ID_HERE]
Content-Type: application/json

{
  "phone": "0900000000",
  "status": "confirmed"
}


📸 [貼 PATCH 成功截圖]

3️.刪除報名資料（Delete）

預期：204 No Content

DELETE http://localhost:3001/api/signup/[YOUR_ID_HERE]


📸 [貼 DELETE 截圖]

Lab 必備驗證截圖
A. Email 唯一性驗證（409 Conflict）

測試方式：

提交相同 email 兩次

第二次預期 409 Conflict

📸 貼上 409 回應截圖

B. API 分頁功能驗證

測試：

GET http://localhost:3001/api/signup?page=2&limit=2


預期回傳：

{
  "items": [...],
  "total": 10,
  "page": 2,
  "limit": 2
}


📸 貼上分頁結果截圖

🗂️ MongoDB 持久化驗證
A. Compass 資料截圖

📸 貼上 participants collection 資料

B. 唯一索引（Email）驗證

建立唯一索引的指令：

db.participants.createIndex({ email: 1 }, { unique: true })


驗證索引：

db.participants.getIndexes()


📸 貼上 getIndexes 截圖

常見錯誤排查
問題	解決方式
API 回 500	檢查 Node.js Terminal log 堆疊訊息
重複 Email 沒報錯	沒建立唯一索引 → 執行 createIndex，或清掉重複資料
MongoDB 無法連線	檢查 docker ps、檢查 .env 內容是否一致


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