import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
  console.error('請輸入要加密的密碼，例如: node hash-password.js mypassword123');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('原始密碼:', password);
  console.log('加密雜湊 (Password Hash):');
  console.log(hash); // 複製這串去資料庫或 mongo-init.js 用
});