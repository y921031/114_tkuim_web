// signup_form.js
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const successMsg = document.getElementById('success-msg');

const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('name-error') },
  email: { input: document.getElementById('email'), error: document.getElementById('email-error') },
  phone: { input: document.getElementById('phone'), error: document.getElementById('phone-error') },
  password: { input: document.getElementById('password'), error: document.getElementById('password-error') },
  confirm: { input: document.getElementById('confirm-password'), error: document.getElementById('confirm-error') },
  interests: { container: document.getElementById('interests'), error: document.getElementById('interests-error') },
  terms: { input: document.getElementById('terms'), error: document.getElementById('terms-error') }
};

const touched = new Set();

// --------- localStorage 功能 ---------
function saveToStorage() {
  const data = {
    name: fields.name.input.value,
    email: fields.email.input.value,
    phone: fields.phone.input.value,
    password: fields.password.input.value,
    confirm: fields.confirm.input.value,
    interests: Array.from(fields.interests.container.querySelectorAll('input[type=checkbox]'))
                     .map(cb => ({id: cb.id, checked: cb.checked})),
    terms: fields.terms.input.checked
  };
  localStorage.setItem('signupFormData', JSON.stringify(data));
}

function loadFromStorage() {
  const data = JSON.parse(localStorage.getItem('signupFormData') || '{}');
  if (data.name) fields.name.input.value = data.name;
  if (data.email) fields.email.input.value = data.email;
  if (data.phone) fields.phone.input.value = data.phone;
  if (data.password) fields.password.input.value = data.password;
  if (data.confirm) fields.confirm.input.value = data.confirm;
  if (data.interests) {
    data.interests.forEach(item => {
      const cb = document.getElementById(item.id);
      if (cb) cb.checked = item.checked;
    });
  }
  if (data.terms !== undefined) fields.terms.input.checked = data.terms;

  updatePasswordStrength(); // 更新進度條
}

loadFromStorage(); // 頁面載入時恢復

// 每次輸入自動存
Object.values(fields).forEach(f => {
  if (f.input) {
    f.input.addEventListener('input', saveToStorage);
  }
});
fields.interests.container.addEventListener('change', saveToStorage);

// 共用驗證函式
function validateField(input, error) {
  let message = '';
  if (input.validity.valueMissing) {
    message = '此欄位必填';
  } else if (input.id === 'email' && !input.value.endsWith('@o365.tku.edu.tw')) {
    message = '請使用學校信箱（@o365.tku.edu.tw）';
  } else if (input.validity.typeMismatch) {
    message = '格式不正確';
  } else if (input.validity.patternMismatch) {
    message = input.title || '格式不正確';
  }
  input.setCustomValidity(message);
  error.textContent = message;
  return !message;
}

// 密碼驗證
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

// 確認密碼驗證
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

// 興趣驗證
function validateInterests() {
  const checked = fields.interests.container.querySelectorAll('input[type=checkbox]:checked');
  let message = checked.length === 0 ? '請至少選擇一個興趣' : '';
  fields.interests.error.textContent = message;
  return checked.length > 0;
}

// 服務條款驗證
function validateTerms() {
  const checked = fields.terms.input.checked;
  let message = !checked ? '必須同意服務條款' : '';
  fields.terms.error.textContent = message;
  return checked;
}

// 密碼強度進度條
function updatePasswordStrength() {
  const pwd = fields.password.input.value.trim();
  const bar = document.getElementById('password-strength-bar');
  const textEl = document.getElementById('password-strength-text');
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  let color = '', width = 0, text = '';
  if (score <= 1) { color = '#FF6B6B'; width = 33; text = '弱'; }
  else if (score === 2) { color = '#FFA94D'; width = 66; text = '中'; }
  else { color = '#51CF66'; width = 100; text = '強'; }

  bar.style.width = width + '%';
  bar.style.backgroundColor = color;
  textEl.textContent = pwd ? `密碼強度：${text}` : '';
  textEl.style.color = color;
}

// 事件監聽
fields.password.input.addEventListener('input', () => {
  if (touched.has('password')) validatePassword();
  updatePasswordStrength();
});
fields.password.input.addEventListener('blur', () => { touched.add('password'); validatePassword(); });
fields.confirm.input.addEventListener('blur', () => { touched.add('confirm'); validateConfirm(); });

fields.interests.container.addEventListener('change', validateInterests);

// 聚焦後即時驗證
Object.values(fields).forEach(f => {
  if (f.input) f.input.addEventListener('blur', () => touched.add(f.input.id));
});

// 表單送出
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const validName = validateField(fields.name.input, fields.name.error);
  const validEmail = validateField(fields.email.input, fields.email.error);
  const validPhone = validateField(fields.phone.input, fields.phone.error);
  const validPassword = validatePassword();
  const validConfirm = validateConfirm();
  const validInterests = validateInterests();
  const validTerms = validateTerms();

  const allValid = validName && validEmail && validPhone && validPassword && validConfirm && validInterests && validTerms;

  if (!allValid) {
    // 聚焦第一個錯誤欄位
    for (const key of ['name','email','phone','password','confirm','interests','terms']) {
      if (!eval(`valid${key.charAt(0).toUpperCase()+key.slice(1)}`)) {
        const el = key === 'interests' ? fields.interests.container : fields[key].input;
        el.focus();
        break;
      }
    }
    return;
  }

  // 防重送
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  setTimeout(() => {
    successMsg.textContent = '註冊成功！';
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    form.reset();
    document.getElementById('password-strength-bar').style.width = '0%';
    document.getElementById('password-strength-text').textContent = '';
  }, 1000);
});

// 重設按鈕
resetBtn.addEventListener('click', () => {
  form.reset();
  Object.values(fields).forEach(f => { if (f.error) f.error.textContent = ''; });
  document.getElementById('password-strength-bar').style.width = '0%';
  document.getElementById('password-strength-text').textContent = '';
});
