// server/routes/signup.js
import express from 'express';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant,
  countParticipants 
} from '../repositories/participants.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }
    const id = await createParticipant({ name, email, phone });
    res.status(201).json({ id });
  } catch (error) {
        console.error('--- 發生錯誤，追蹤如下 ---');
        console.error(error);
        
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({
                error: '該 Email 已被註冊，請勿重複報名。'
            });
        }
    next(error);
  }
});

// 修正 GET 路由以實作分頁 (GET /api/signup?page=x&limit=y)
router.get('/', async (req, res, next) => {
  try {
    // 1. 取得並解析 page 和 limit 參數，設定預設值
    // page 預設第 1 頁，limit 預設 10 筆
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    // 2. 計算 skip (跳過筆數): skip = (page - 1) * limit
    const skip = (page - 1) * limit;

    // 3. 獲取總筆數 (用於前端顯示總頁數)
    const totalItems = await countParticipants(); 

    // 4. 調用 repository 函式，傳入分頁參數 (skip/limit)
    const participants = await listParticipants(skip, limit); 
    
    // 5. 返回包含分頁資訊的數據
    res.json({ 
      items: participants, 
      total: totalItems,
      page: page,
      limit: limit
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const result = await updateParticipant(req.params.id, req.body);
    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteParticipant(req.params.id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;