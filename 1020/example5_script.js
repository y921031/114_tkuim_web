// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var start = parseInt(prompt('請輸入起始數字（1~9）：'), 10);
var end = parseInt(prompt('請輸入結束數字（1~9）：'), 10);
var output = '';

// 檢查輸入是否有效
if (isNaN(start) || isNaN(end) || start < 1 || end > 9 || start > end) {
  output = '請輸入正確的範圍（1~9，且起始 ≤ 結束）！';
} else {
  // 巢狀 for 迴圈
  for (var i = start; i <= end; i++) {
    for (var j = 1; j <= 9; j++) {
      output += i + ' x ' + j + ' = ' + (i * j) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
