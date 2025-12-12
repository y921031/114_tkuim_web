const loginForm = document.getElementById('login-form'); // 假設你的 form id="login-form"

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 獲取輸入值 (假設 input id 為 email, password)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 登入成功：儲存 Token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // 選存，方便顯示歡迎訊息
        
        alert('登入成功！');
        window.location.href = 'dashboard.html'; // 跳轉到報名頁
      } else {
        alert(`登入失敗: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('連線錯誤，請稍後再試');
    }
  });
}