// lab10.js
var output = '';

// -------- 溫度轉換器 --------
function tempConverter() {
  var tempStr = prompt('請輸入溫度數值：');
  var unit = prompt('請輸入單位（C 或 F）：').toUpperCase();
  var temp = parseFloat(tempStr);

  if (isNaN(temp) || (unit !== 'C' && unit !== 'F')) {
    return '溫度輸入有誤';
  }

  var result = '';
  if (unit === 'C') {
    var f = temp * 9 / 5 + 32;
    result = temp + '°C = ' + f.toFixed(2) + '°F';
  } else {
    var c = (temp - 32) * 5 / 9;
    result = temp + '°F = ' + c.toFixed(2) + '°C';
  }
  alert(result);
  return result;
}

output += '=== 溫度轉換器 ===\n' + tempConverter() + '\n\n';

// -------- 猜數字遊戲 --------
function guessNumberGame() {
  var answer = Math.floor(Math.random() * 100) + 1;
  var guess = 0;
  var count = 0;

  while (guess !== answer) {
    var input = prompt('請猜一個 1~100 的數字：');
    guess = parseInt(input, 10);
    count++;
    if (isNaN(guess) || guess < 1 || guess > 100) {
      alert('請輸入 1~100 的數字');
    } else if (guess < answer) {
      alert('再大一點');
    } else if (guess > answer) {
      alert('再小一點');
    } else {
      alert('恭喜你猜中了！共猜了 ' + count + ' 次');
    }
  }
  return '=== 猜數字遊戲 ===\n答案：' + answer + '\n共猜了 ' + count + ' 次';
}

output += guessNumberGame();

console.log(output);
document.getElementById('result').textContent = output;
