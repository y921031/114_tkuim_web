# Week 11 Lab：MERN Stack - Express API 實戰與 MongoDB CRUD

本專案實作了一個 Express.js 後端 API，搭配 MongoDB 進行報名系統的 CRUD 操作，並符合分頁與 Email 唯一性檢查等進階要求。

## 環境需求
- Node.js 18+
- Docker / Docker Compose
- VS Code REST Client（API 測試用）


## 專案成果展示與 API 驗證

### 1. 服務啟動狀態
確認 MongoDB 容器和 Node.js 服務都已成功運行。

#### Docker 容器狀態 (`docker ps`)
* **啟動指令：** `docker compose up -d`
![Docker 容器運行狀態截圖](assets/docker_ps.png)

#### Node.js 伺服器啟動 Log
* **啟動指令：** `npm run dev`
![Node.js伺服器啟動截圖](assets/Nodejs.png)

---

### 2. 環境變數說明 (`.env` 範例)

```env
PORT=3001
MONGODB_URI=mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11
ALLOWED_ORIGIN=http://localhost:5173
```

---

### 3. CRUD API 測試腳本

#### 0 狀態檢查
```markdown
GET http://localhost:3001/health
```

#### 1 建立報名 (Create) - 獲取 ID
```markdown
POST http://localhost:3001/api/signup
Content-Type: application/json

{ "name": "Lab Test User", "email": "test-user-{{$randomInt}}@example.com", "phone": "0988777666", "interests": ["全端"] }
```

#### 2 Email 唯一性驗證 (409 Conflict)
##### 請執行兩次，第二次應返回 409
```markdown
POST http://localhost:3001/api/signup
Content-Type: application/json

{ "name": "重複測試", "email": "duplicate-test@example.com", "phone": "0911000111" }
```

#### 3 查看清單 - 分頁功能驗證
```markdown
GET http://localhost:3001/api/signup?page=2&limit=2
```


#### 4 更新報名資料 (Update)
```markdown
PATCH http://localhost:3001/api/signup/
Content-Type: application/json

{ "phone": "0900000000", "status": "confirmed" }
```

#### 5 刪除報名資料 (Delete)
```markdown
DELETE http://localhost:3001/api/signup/[YOUR_ID_HERE]
```

---

### 5. 資料持久化驗證 (MongoDB Compass)

確認資料已正確持久化到 MongoDB 集合中。

![MongoDB Compass 中的 participants 集合內容截圖](assets/mongo_compass.png)

#### Mongo Shell 唯一索引驗證 (Lab 要求)
證明 participants 集合已成功建立 Email 唯一索引。

	
| 目的 | 指令範例 |
| --- | --- |
| 進入 Shell | docker exec -it week11-mongo mongosh -u week11-user -p week11-pass --authenticationDatabase week11 |
| 建立 Email 唯一索引 | db.participants.createIndex({ email: 1 }, { unique: true }) |

截圖： [貼入 db.participants.getIndexes() 顯示 email_1 唯一索引的截圖]

---

### 6. 常見問題與除錯 (FAQ)
| 問題 | 解決方式 |
| --- | --- |
| API 返回 500 Internal Server Error | 檢查運行 npm run dev 的終端機，查找 Stack Trace 訊息，並針對錯誤行數進行修正。 |
| POST 重複 Email 仍是 201 | **Email 唯一索引未生效。** 需進入 Mongo Shell 執行 `db.participants.createIndex({ email: 1 }, { unique: true })`，並確認已清除所有重複資料。 |
| MongoDB 連線失敗 | 檢查 `docker ps` 確認 `week11-mongo` 容器是否處於 **Up** 狀態，並確認 `.env` 配置是否正確。 |