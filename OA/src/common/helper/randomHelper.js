//uuid生成器
import { nanoid } from 'nanoid';

export function uuid() {
  return nanoid();
}

// 带透明度的随机颜色RGBA
export function randomColor(alpha) {
  //透明度
  alpha = alpha == undefined ? ((Math.random() * 10) / 10).toFixed(1) : alpha;
  alpha = Number(alpha);
  if (isNaN(alpha)) alpha = 1; //非数字时为1
  // rgba（255,255,255，0.5）
  let color = 'rgba(';
  for (let i = 0; i < 3; i++) {
    color += parseInt(Math.random() * 256) + ',';
  }
  color += alpha + ')';
  return color;
}
