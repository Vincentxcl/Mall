//为Date对象添加format方法。
//format 格式"yyyyMMdd" "yyMMdddd"
Date.prototype.format = function (format) {
  const ele = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  if (new RegExp(/(y+)/).test(format)) {
    let _year = this.getFullYear()
      .toString()
      .substr(4 - RegExp.$1.length);
    format = format.replace(RegExp.$1, _year);
  }
  for (let k in ele) {
    if (new RegExp('(' + k + ')').test(format)) {
      let _f = RegExp.$1.length == 1 ? ele[k] : ('00' + ele[k]).substr(ele[k].toString().length);
      format = format.replace(RegExp.$1, _f);
    }
  }
  return format;
};

//转换数据库内的时间格式
//dateString原时间字符串数据 / Date(1597749325850) /
//format 时间格式
export function convertDateFormat(dateString, format = 'yyyy-MM-dddd hh:mm:ss') {
  var _str = dateString.replace(/[^\d]/g, ''); //凡是非数字就替换掉
  var _time = new Date(parseInt(_str));
  return _time.format(format);
}

// 去除对象成员属性的前后空格
export function trimInObj(val) {
  if (typeof val != 'object') {
    throw new Error('argument exception');
  }

  let temp = {};
  for (let prop in val) {
    let k = val[prop];
    if (typeof val[prop] == 'string') {
      k = val[prop].trim();
    }
    temp[prop] = k;
  }
  return temp;
}

//在旧对象上找出不同属性
export function getDifferent(oldObj, newObj) {
  if (typeof oldObj != 'object') {
    throw new Error('argument oldObj error');
  }
  if (typeof newObj != 'object') {
    throw new Error('argument newObj error');
  }
  let temp = {};
  for (let prop in oldObj) {
    if (newObj[prop] != undefined) {
      if (oldObj[prop] != newObj[prop]) {
        temp[prop] = newObj[prop];
      }
    }
  }
  return temp;
}
