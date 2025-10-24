// example8_script.js
// 宣告一個學生物件，包含屬性與方法，並加上平均分數等第

var student = {
  name: '小明',
  id: 'A123456789',
  scores: [85, 90, 78],
  
  // 計算平均分數
  getAverage: function() {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }
    return sum / this.scores.length;
  },

  // 印出基本資訊
  info: function() {
    return '姓名：' + this.name + '\n學號：' + this.id;
  },

  // 延伸：依平均分數回傳等第
  getGrade: function() {
    var avg = this.getAverage();
    if (avg >= 90) return 'A';
    else if (avg >= 80) return 'B';
    else if (avg >= 70) return 'C';
    else if (avg >= 60) return 'D';
    else return 'F';
  }
};

// 組合輸出文字
var text = student.info() + '\n'
         + '平均分數：' + student.getAverage().toFixed(2) + '\n'
         + '等第：' + student.getGrade();

document.getElementById('result').textContent = text;
