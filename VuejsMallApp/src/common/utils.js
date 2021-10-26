
//防抖函数
export function debounce(func, delay = 300) {
  let handler = null;
  return function (...args) {
    if (handler) {
      clearTimeout(handler);
    }
    handler = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

//JS控制图片按比例缩放并不超过一定宽度和高度
export function adjustImgWH(imgObj, iwidth, iheight) {
  var minwidth = iwidth//图片最小宽度小于定义百分比
  var minheight = iheight//图片最小高度小于定义百分比

  if (imgObj.naturalWidth > 0 && imgObj.naturalHeight > 0) {
    //通过正弦值判断图片缩放后是否偏高
    if (imgObj.naturalHeight / imgObj.naturalWidth >= iheight / iwidth) {
      //如果图片比设定的要高
      if (imgObj.naturalHeight > iheight) {
        imgObj.height = iheight;
        imgObj.width = (imgObj.naturalWidth * iheight) / imgObj.naturalHeight;
      }
      //假如图片width<70%(设定)&&heitht<70%(设定)
      else {
        if (imgObj.naturalHeight < minheight) {
          imgObj.height = minheight;
          imgObj.width = (imgObj.naturalWidth * minheight) / imgObj.naturalHeight;
        }
        else {
          imgObj.width = imgObj.naturalWidth;
          imgObj.height = imgObj.naturalHeight;
        }
      }
    }
    //如果图片比例 小于 设定的比例
    else {
      if (imgObj.naturalWidth > iwidth) {
        imgObj.width = iwidth;
        imgObj.height = (imgObj.naturalHeight * iwidth) / imgObj.naturalWidth;
      }
      //假如图片width<70%(设定)&&heitht<70%(设定)
      else {
        if (imgObj.naturalWidth <= minwidth) {
          imgObj.width = minwidth;
          imgObj.height = (imgObj.naturalHeight * minwidth) / imgObj.naturalWidth;
        }
        else {
          imgObj.width = imgObj.naturalWidth;
          imgObj.height = imgObj.naturalHeight;
        }
      }
    }
  }
}


//为Date对象添加format方法。
//format 格式"yyyyMMdd" "yyMMdddd"
Date.prototype.format = function (format) {
  const ele = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (new RegExp(/(y+)/).test(format)) {
    let _year = this.getFullYear().toString().substr(4 - RegExp.$1.length)
    format = format.replace(RegExp.$1, _year);
  }
  for (let k in ele) {
    if (new RegExp("(" + k + ")").test(format)) {
      let _f = RegExp.$1.length == 1 ? (ele[k]) : (("00" + ele[k]).substr(ele[k].toString().length));
      format = format.replace(RegExp.$1, _f);
    }
  }
  return format;
}

//转换数据库内的时间格式
//dateString原时间字符串数据 / Date(1597749325850) /
//format 时间格式
export function convertDateFormat(dateString, format = "yyyy-MM-dddd hh:mm:ss") {
  var _str = dateString.replace(/[^\d]/g, "");//凡是非数字就替换掉
  var _time = new Date(parseInt(_str));
  return _time.format(format);
}
