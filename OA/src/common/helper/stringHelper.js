//去除字符串头尾空格或指定字符
export function trim(s, c) {
  if (c == null || c == '') {
    var str = s.replace(/^s*/, '');
    var rg = /s/;
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  } else {
    var rg = new RegExp('^' + c + '*');
    var str = s.replace(rg, '');
    rg = new RegExp(c);
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  }
}
//去除字符串头部空格或指定字符
export function trimStart(s, c) {
  if (c == null || c == '') {
    var str = s.replace(/^s*/, '');
    return str;
  } else {
    var rg = new RegExp('^' + c + '*');
    var str = s.replace(rg, '');
    return str;
  }
}

//去除字符串尾部空格或指定字符
export function trimEnd(s, c) {
  if (c == null || c == '') {
    var str = s;
    var rg = /s/;
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  } else {
    var str = s;
    var rg = new RegExp(c);
    var i = str.length;
    while (rg.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  }
}
