// example2_script.js
// 驗證 Email 與手機欄位，送出時檢查學校信箱，拋出自訂訊息

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');

// 共用驗證函式
function showValidity(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title || '格式不正確');
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

// 新增函式：檢查是否為學校信箱
function validateSchoolEmail() {
  const value = email.value.trim();
  if (!value.endsWith('@o365.tku.edu.tw')) {
    email.setCustomValidity('請使用學校信箱（@o365.tku.edu.tw）');
    return email.reportValidity();
  } else {
    email.setCustomValidity('');
    return true;
  }
}

// 表單送出事件
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const emailOk = showValidity(email) && validateSchoolEmail();
  const phoneOk = showValidity(phone);

  if (emailOk && phoneOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
  }
});

// 失焦時驗證（blur）
email.addEventListener('blur', () => {
  showValidity(email);
});

phone.addEventListener('blur', () => {
  showValidity(phone);
});
