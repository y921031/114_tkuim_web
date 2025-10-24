// example6_script.js
// 將使用者輸入的逗號分隔數字字串，轉成陣列並計算總和、平均、最大值、最小值

var raw = prompt('請輸入多個數字（以逗號,分隔）：');
var result = '';

if (!raw) {
  result = '未輸入資料';
} else {
  var parts = raw.split(',');
  var nums = [];

  // 過濾有效數字
  for (var i = 0; i < parts.length; i++) {
    var n = parseFloat(parts[i]);
    if (!isNaN(n)) {
      nums.push(n);
    }
  }

  if (nums.length === 0) {
    result = '沒有可用的數字';
  } else {
    var sum = 0;
    var max = nums[0];
    var min = nums[0];

    // 走訪陣列計算總和、找最大最小
    for (var j = 0; j < nums.length; j++) {
      sum += nums[j];
      if (nums[j] > max) max = nums[j];
      if (nums[j] < min) min = nums[j];
    }

    var avg = sum / nums.length;

    result = '有效數字：' + nums.join(', ') + '\n'
           + '總和：' + sum + '\n'
           + '平均：' + avg.toFixed(2) + '\n'
           + '最大值：' + max + '\n'
           + '最小值：' + min;
  }
}

document.getElementById('result').textContent = result;
