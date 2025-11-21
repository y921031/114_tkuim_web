# Week09 會員報名系統（Node.js + Express）

本專案是一個簡單的會員報名 API 系統，提供前端表單送出資料、後端驗證、報名資料存取功能，並包含基本測試指令範例。

---

## 環境需求

- Node.js v18 以上
- npm v9 以上
- 可選工具：
  - VS Code（建議搭配 REST Client 外掛）
  - curl（命令列測試 API）

---

## 測試指令

# 狀態檢查
curl http://localhost:3001/health

# 新增報名
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"REST","email":"rest@o365.tku.edu.tw","phone":"0988777666","password":"Abc123!@#","confirmPassword":"Abc123!@#","interests":["閱讀"],"terms":true}'

# 查看報名清單
curl http://localhost:3001/api/signup

# 刪除報名
curl -X DELETE http://localhost:3001/api/signup/<id>
