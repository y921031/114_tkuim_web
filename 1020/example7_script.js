// example7_script.js
// 以函式封裝 BMI 計算、等級判斷與理想範圍檢查

// 計算 BMI
function calcBMI(heightCm, weightKg) {
  var h = heightCm / 100;
  var bmi = weightKg / (h * h);
  return bmi;
}

// 判斷 BMI 等級
function bmiLevel(bmi) {
  var level = '';
  if (bmi < 18.5) {
    level = '過輕';
  } else if (bmi < 24) {
    level = '正常';
  } else if (bmi < 27) {
    level = '過重';
  } else if (bmi < 30) {
    level = '輕度肥胖';
  } else if (bmi < 35) {
    level = '中度肥胖';
  } else {
    level = '重度肥胖';
  }
  return level;
}

// 延伸：判斷是否為理想 BMI 範圍（18.5–24）
function isIdeal(bmi) {
  return bmi >= 18.5 && bmi < 24;
}

// 主程式執行
var hStr = prompt('請輸入身高（公分）：');
var wStr = prompt('請輸入體重（公斤）：');
var hNum = parseFloat(hStr);
var wNum = parseFloat(wStr);

var text = '';
if (isNaN(hNum) || isNaN(wNum) || hNum <= 0 || wNum <= 0) {
  text = '輸入不正確，請重新整理網頁再試一次！';
} else {
  var bmi = calcBMI(hNum, wNum);
  var level = bmiLevel(bmi);
  var ideal = isIdeal(bmi) ? '✅ 在理想範圍內' : '⚠️ 不在理想範圍內';

  text = '身高：' + hNum + ' cm\n'
       + '體重：' + wNum + ' kg\n'
       + 'BMI：' + bmi.toFixed(2) + '\n'
       + '等級：' + level + '\n'
       + ideal;
}

document.getElementById('result').textContent = text;
