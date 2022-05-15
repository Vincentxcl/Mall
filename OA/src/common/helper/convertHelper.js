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

//对比新对象，在旧对象上找出不同的属性，组成一个对象，返回该对象
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

// 深度拷贝对象
export function deepClone(target) {
  // 判断要处理的目标是数组还是对象
  let newObj = target.constructor === Array ? [] : {};
  // 遍历目标：in运算符会拿到原型上继承到的属性
  for (let attr in target) {
    // 判断属性是否在当前对象自身
    if (target.hasOwnProperty(attr)) {
      // 如果值是对象或数组，就递归一下
      if (target[attr] && typeof target[attr] === 'object') {
        newObj[attr] = target[attr].constructor === Array ? [] : {};
        newObj[attr] = deepClone(target[attr]);
      } else if (typeof target[attr] === 'function') {
        // 如果是函数，就复制一个新函数
        newObj[attr] = target[attr].bind(target);
      } else {
        // 如果不是对象，数组，函数，就直接赋值
        newObj[attr] = target[attr];
      }
    }
  }
  return newObj;
}
