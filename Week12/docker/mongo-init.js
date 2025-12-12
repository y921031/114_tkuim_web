db = db.getSiblingDB('week12');

// 1. 建立資料庫連線用帳號
db.createUser({
  user: 'week12-admin',
  pwd: 'week12-pass',
  roles: [{ role: 'readWrite', db: 'week12' }]
});

// 2. 建立集合與索引
db.createCollection('participants');
db.participants.createIndex({ ownerId: 1 });

db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// 3. 建立 Admin 帳號 (使用你剛剛產生的雜湊)
db.users.insertOne({
  email: 'admin@example.com',
  // 這就是你剛剛跑出來的那串：
  passwordHash: '$2b$10$2AaMkn3JTshTJv0Hh1Tua.4X5fyCIq4TN0RHe9vp22hirHseh.JYS', 
  role: 'admin',
  createdAt: new Date()
});