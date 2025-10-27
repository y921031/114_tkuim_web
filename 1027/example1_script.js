// example1_script.js
// 統一在父層監聽事件，處理清單項目新增、刪除、完成切換

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// 新增項目
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `
    ${value}
    <div class="btn-group btn-group-sm">
      <button class="btn btn-outline-success" data-action="complete">完成</button>
      <button class="btn btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  list.appendChild(item);

  input.value = '';
  input.focus();
});

// 事件委派：處理「完成」與「刪除」
list.addEventListener('click', (event) => {
  const target = event.target;

  // 點擊「刪除」按鈕
  if (target.matches('[data-action="remove"]')) {
    const li = target.closest('li');
    li.remove();
    return;
  }

  // 點擊「完成」按鈕
  if (target.matches('[data-action="complete"]')) {
    const li = target.closest('li');
    li.classList.toggle('list-group-item-success');
    return;
  }
});

// 監聽輸入框的 keyup 事件（按下 Enter 會自動送出表單）
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    form.dispatchEvent(new Event('submit'));
  }
});