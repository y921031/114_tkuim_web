// lab_score_calculator.js
// 讀入 5 科成績，計算平均、等第，並檢查是否有不及格科目

// 將輸入轉成數字，若非數字回傳 null
function toNumber(str) {
  var n = parseFloat(str);
  return isNaN(n) ? null : n;
}

// 依平均分數回傳等第
function gradeFrom(avg) {
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

// 讀取姓名
var name = prompt('請輸入姓名：');
if (!name) name = '同學';

// 讀取 5 科成績
var subjects = ['國文', '英文', '數學', '自然', '社會'];
var scores = [];

for (var i = 0; i < subjects.length; i++) {
  var s = toNumber(prompt('請輸入 ' + subjects[i] + ' 成績：'));
  scores.push(s);
}

// 檢查輸入是否有效
var invalid = scores.some(function(s){ return s === null; });
var text = '';

if (invalid) {
  text = '輸入有誤，請重新整理後再試。';
} else {
  var sum = 0;
  var fail = false;

  for (var i = 0; i < scores.length; i++) {
    sum += scores[i];
    if (scores[i] < 60) fail = true;
  }

  var avg = sum / scores.length;
  text = '姓名：' + name + '\n';
  for (var i = 0; i < subjects.length; i++) {
    text += subjects[i] + '：' + scores[i] + '\n';
  }
  text += '平均：' + avg.toFixed(2) + '\n';
  text += '等第：' + gradeFrom(avg) + '\n';
  if (fail) text += '⚠️ 有不及格科目';
}

console.log(text);
document.getElementById('result').textContent = text;
