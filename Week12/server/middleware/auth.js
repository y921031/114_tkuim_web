import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // 1. 檢查有沒有帶 Header (格式: Bearer <token>)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授權：請先登入' });
  }

  const token = authHeader.split(' ')[1]; // 取出 Bearer 後面的那串字

  try {
    // 2. 驗證 Token 是否有效
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. 把解析出來的使用者資料掛在 req 上，讓後面的 API 可以用
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token 無效或已過期' });
  }
}