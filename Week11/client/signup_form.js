const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const successMsg = document.getElementById('success-msg');
const viewBtn = document.getElementById('view-btn'); // 新增查看清單按鈕
const listContainer = document.getElementById('signup-list'); // <pre> 顯示清單

const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('name-error') },
  email: { input: document.getElementById('email'), error: document.getElementById('email-error') },
  phone: { input: document.getElementById('phone'), error: document.getElementById('phone-error') },
  password: { input: document.getElementById('password'), error: document.getElementById('password-error') },
  confirm: { input: document.getElementById('confirm-password'), error: document.getElementById('confirm-error') },
  interests: { container: document.getElementById('interests'), error: document.getElementById('interests-error') },
  terms: { input: document.getElementById('terms'), error: document.getElementById('terms-error') }
};

// 表單驗證函式（沿用你原本邏輯）
function validateField(input, error) {
  let message = '';
  if (input.validity.valueMissing) message = '此欄位必填';
  else if (input.id === 'email' && !input.value.endsWith('@o365.tku.edu.tw')) message = '請使用學校信箱';
  else if (input.validity.typeMismatch) message = '格式不正確';
  else if (input.validity.patternMismatch) message = input.title || '格式不正確';
  input.setCustomValidity(message);
  error.textContent = message;
  return !message;
}

function validatePassword() {
  const pwd = fields.password.input.value.trim();
  const hasLetter = /[A-Za-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  let message = '';
  if (!pwd) message = '請輸入密碼';
  else if (pwd.length < 8) message = '密碼至少 8 碼';
  else if (!hasLetter || !hasNumber || !hasSymbol) message = '請同時包含英文字母、數字與符號';
  fields.password.input.setCustomValidity(message);
  fields.password.error.textContent = message;
  return !message;
}

function validateConfirm() {
  const pwd = fields.password.input.value.trim();
  const confirm = fields.confirm.input.value.trim();
  let message = '';
  if (!confirm) message = '請再次輸入密碼';
  else if (pwd !== confirm) message = '兩次密碼不一致';
  fields.confirm.input.setCustomValidity(message);
  fields.confirm.error.textContent = message;
  return !message;
}

function validateInterests() {
  const checked = fields.interests.container.querySelectorAll('input[type=checkbox]:checked');
  let message = checked.length === 0 ? '請至少選擇一個興趣' : '';
  fields.interests.error.textContent = message;
  return checked.length > 0;
}

function validateTerms() {
  const checked = fields.terms.input.checked;
  let message = !checked ? '必須同意服務條款' : '';
  fields.terms.error.textContent = message;
  return checked;
}

// 送出表單
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const validName = validateField(fields.name.input, fields.name.error);
  const validEmail = validateField(fields.email.input, fields.email.error);
  const validPhone = validateField(fields.phone.input, fields.phone.error);
  const validPassword = validatePassword();
  const validConfirm = validateConfirm();
  const validInterests = validateInterests();
  const validTerms = validateTerms();

  const allValid = validName && validEmail && validPhone && validPassword && validConfirm && validInterests && validTerms;

  if (!allValid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  successMsg.textContent = '';

  // 組成資料送給後端
  const data = {
    name: fields.name.input.value,
    email: fields.email.input.value,
    phone: fields.phone.input.value,
    password: fields.password.input.value,
    confirmPassword: fields.confirm.input.value,
    interests: Array.from(fields.interests.container.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value),
    terms: fields.terms.input.checked
  };

  try {
    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || '送出失敗');
    successMsg.textContent = '註冊成功！';
    form.reset();
    listContainer.textContent = '';
  } catch (err) {
    successMsg.textContent = err.message;
    successMsg.style.color = 'red';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});

// 查看報名清單
viewBtn.addEventListener('click', async () => {
  listContainer.textContent = '讀取中...';
  try {
    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();
    listContainer.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    listContainer.textContent = '無法取得清單';
  }
});

// 重設按鈕
resetBtn.addEventListener('click', () => {
  form.reset();
  listContainer.textContent = '';
  successMsg.textContent = '';
});
