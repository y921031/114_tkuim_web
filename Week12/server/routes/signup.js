import express from 'express';
import { 
  findAll, 
  findByOwner, 
  createParticipant, 
  deleteParticipant, 
  findById 
} from '../repositories/participants.js';

const router = express.Router();

// GET: 根據角色回傳對應資料
router.get('/', async (req, res) => {
  try {
    const { role, id: userId } = req.user; // 從 Token 解出來的資訊
    
    let data;
    if (role === 'admin') {
      data = await findAll(); // 管理員看全部
    } else {
      data = await findByOwner(userId); // 學生看自己
    }
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '讀取資料失敗' });
  }
});

// POST: 新增報名資料 (自動綁定 ownerId)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // 強制將建立者設為當前登入的使用者
    const newParticipant = await createParticipant({
      name,
      email,
      phone,
      ownerId: req.user.id // 關鍵：綁定擁有者
    });
    
    res.status(201).json(newParticipant);
  } catch (err) {
    res.status(500).json({ error: '新增資料失敗' });
  }
});

// DELETE: 刪除資料 (需檢查擁有權)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const participant = await findById(id);

    if (!participant) {
      return res.status(404).json({ error: '找不到該筆資料' });
    }

    // 權限檢查：只有「資料擁有者」或「管理員」可以刪除
    // 注意：MongoDB ID 比較建議轉成字串比對
    const isOwner = participant.ownerId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: '你沒有權限刪除這筆資料' });
    }

    await deleteParticipant(id);
    res.json({ message: '刪除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '刪除失敗' });
  }
});

export default router;