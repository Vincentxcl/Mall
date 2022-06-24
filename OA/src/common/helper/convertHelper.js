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
  let _str = dateString.replace(/[^\d]/g, ''); //凡是非数字就替换掉
  let _time = new Date(parseInt(_str));
  return _time.format(format);
}

//时间格式转化，date为''时，为当前时间
export function dateFormat(dateStr, format = 'yyyy-MM-dddd hh:mm:ss') {
  let _time = dateStr.trim() == '' ? new Date() : new Date(dateStr);
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
    if (Object.prototype.hasOwnProperty.call(target, attr)) {
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

//从对象中提取属性后，组成一个对象返回，忽略为'undefined、空字符串'的成员
export function extractProps(obj, props) {
  if (typeof obj == 'object' && typeof props == 'object') {
    let newObj = {};
    for (let prop of props) {
      //明确为undefined 避免0或者''被作为了false
      if (Reflect.get(obj, prop) != undefined) {
        let val = Reflect.get(obj, prop).toString();
        if (val.trim() == '') {
          continue;
        }
        newObj[prop] = val;
      }
    }
    //
    return newObj;
  } else {
    throw new Error('function extractProps parameters obj and props type error');
  }
}

//将source的部分属性props，添加至target对象。
export function fillProps(source, target, props) {
  if (typeof source == 'object' && typeof target == 'object') {
    for (let prop of props) {
      if (Reflect.get(source, prop) != undefined) {
        target[prop] = Reflect.get(source, prop);
      }
    }
  } else {
    throw new Error('function fill parameter error,parameter source and target require type of object');
  }
}

// 做一层判断两个数组是否相同，不支持嵌套数组
export function equalArr(arr1, arr2) {
  //如有一个为非数组
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  //如果数组长度不一样
  if (arr1.length !== arr2.length) {
    return false;
  }
  //排序
  let sortedArr1 = arr1.sort();
  let sortedArr2 = arr2.sort();
  //判断同样的index所对应的值是否相同
  let count = arr1.length;
  for (let i = 0; i < count; i++) {
    //判断值是否相同
    if (sortedArr1[i] != sortedArr2[i]) {
      return false;
    }
  }
  return true;
}

export function equalObject(a, b) {
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  //
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]; //取a中的一个属性

    let aPropVal = a[propName];
    let bPropVal = b[propName];
    // 这里忽略了值为undefined的情况
    // 故先判断两边都有相同键名
    if (!Object.prototype.hasOwnProperty.call(b, propName)) {
      return false;
    }

    if (aPropVal instanceof Object) {
      if (equalObject(aPropVal, bPropVal)) {
        // return true     这里不能return ,后面的对象还没判断
      } else {
        return false;
      }
    }
    //如果要精确到类型不同时，比如2!='2'，使用!==
    else if (aPropVal != bPropVal) {
      return false;
    }
  }
  return true;
}
