import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/users.js';

const router = express.Router();

// 登入 API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 0. 基本防呆：檢查有沒有傳資料
    if (!email || !password) {
      return res.status(400).json({ error: '請輸入 Email 與密碼' });
    }

    // 1. 找使用者
    const user = await findUserByEmail(email);
    if (!user) {
      // 為了安全，通常不告訴使用者是「帳號錯」還是「密碼錯」，統稱錯誤
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 2. 比對密碼
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    // 3. 簽發 Token
    const token = jwt.sign(
      { 
        sub: user._id, // 標準聲明：Subject (使用者 ID)
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ 
      message: '登入成功',
      token, 
      user: { email: user.email, role: user.role } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: '伺服器發生錯誤' });
  }
});

// 註冊 API
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '欄位不完整' });
    }

    // 1. [補充] 檢查 Email 是否已存在 (除了依賴 DB 索引，手動檢查更友善)
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: '此 Email 已被註冊' }); // 409 Conflict
    }
    
    // 2. 加密密碼
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 3. 存入資料庫
    const newUser = await createUser({ email, passwordHash });
    
    res.status(201).json({ 
      id: newUser._id, 
      email: newUser.email,
      message: '註冊成功'
    });

  } catch (error) {
    console.error('Signup Error:', error);
    // 如果 MongoDB 噴出 11000 錯誤碼，代表唯一索引衝突 (Email 重複)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email 已被使用' });
    }
    res.status(500).json({ error: '註冊失敗' });
  }
});

export default router;