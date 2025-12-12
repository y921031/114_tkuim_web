import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

// 1. 引入原本的報名路由
import signupRouter from './routes/signup.js';
// 2. [新增] 引入認證路由 (Login/Signup)
import authRouter from './routes/auth.js';
// 3. [新增] 引入驗證 Middleware (守門員)
import { authMiddleware } from './middleware/auth.js';

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => {
  // 小修改：把服務名稱改成 Week12 方便識別
  res.status(200).json({ status: 'ok', service: 'Week12 Auth API' }); 
});

// 4. [新增] 掛載認證路由
// 這行要在 authMiddleware 之前，因為登入/註冊不需要驗證 Token
app.use('/auth', authRouter);

// 5. [修改] 保護報名路由
// 在 signupRouter 前面插入 authMiddleware
// 意思：要進入 /api/signup 之前，必須先通過 authMiddleware 的檢查
app.use('/api/signup', authMiddleware, signupRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

const port = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect MongoDB', error);
    process.exit(1);
  });