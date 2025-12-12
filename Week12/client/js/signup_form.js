const API_URL = 'http://localhost:3001/api/signup';

// 1. 取得 Token 的輔助函式
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('請先登入！');
    window.location.href = 'index.html';
    return null;
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// 2. 畫出表格的函式 (你剛剛缺少的那個)
function renderTable(data) {
  const tbody = document.getElementById('data-table-body');
  if (!tbody) return; 
  
  tbody.innerHTML = ''; // 清空舊資料

  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.phone}</td>
      <td>
        <button class="delete-btn" onclick="deleteParticipant('${item._id}')">刪除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 3. 載入資料
async function loadParticipants() {
  const headers = getAuthHeaders();
  if (!headers) return;

  try {
    const res = await fetch(API_URL, { headers });
    
    if (res.status === 401) {
      alert('登入過期，請重新登入');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
      return;
    }

    const data = await res.json();
    renderTable(data); // 呼叫畫表格函式
  } catch (err) {
    console.error('載入失敗', err);
  }
}

// 4. 刪除資料 (被 HTML 中的 onclick 呼叫)
window.deleteParticipant = async function(id) {
  const headers = getAuthHeaders();
  if (!headers) return;

  if (!confirm('確定要刪除嗎？')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });

    if (res.ok) {
      alert('刪除成功');
      loadParticipants(); // 重新載入
    } else {
      const errorData = await res.json();
      alert(`刪除失敗: ${errorData.error || '權限不足'}`);
    }
  } catch (err) {
    console.error('刪除錯誤', err);
  }
};

// 5. 綁定「新增資料」表單事件
const createForm = document.getElementById('create-form');
if (createForm) {
  createForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // <--- 關鍵！這行阻止了頁面「詭異重整」
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('phone').value;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name, email, phone })
      });
      
      if (res.ok) {
        alert('新增成功');
        createForm.reset();
        loadParticipants(); // 重新載入列表
      } else {
        alert('新增失敗');
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// 6. 頁面載入時自動執行
window.addEventListener('DOMContentLoaded', loadParticipants);