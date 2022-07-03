// drag指令使用方法
// 在目标元素上添加v-drag指令，该元素就可以实现被拖拽
// 在目标元素的父元素上设置drawable属性，实现以目标元素为把手，拖动整个父元素的效果
// v-drag='{top:3,right:3,bottom:45,left:3}'，v-drag可以设置参数，参数为一个对象，用于调整边距
const drag = {
  inserted(element, binding) {
    //获取目标拖动元素
    let drawableEl = getDrawableElement(element);
    drawableEl.style.position = 'absolute';

    // 1.为使用drag指令的元素绑定 鼠标按下事件
    element.onmousedown = (e) => {
      // 阻止默认事件
      e.preventDefault();
      // 阻止事件冒泡
      e.stopPropagation();
      // 目标被拖动元素
      const drawableElRect = drawableEl.getBoundingClientRect();
      // 父框
      const parentRect = getParentNodeRect(drawableEl);

      //鼠标按下后，鼠标与被拖动元素的相对距离
      let disX = e.clientX - drawableEl.offsetLeft; //offset，距离父框left，getBoundingClientRect中的x，这是距离屏幕x
      let disY = e.clientY - drawableEl.offsetTop;
      // let disX=e.clientX-drawableElRect.x;//坐标系问题导致计算坐标不同,鼠标在视口坐标系的x，getBoundingClientRect中的x，元素在视口坐标系的x
      // let disY=e.clientY-drawableElRect.y;

      // 2.监听鼠标在document中的移动事件
      document.onmousemove = (e) => {
        //用当前鼠标的坐标值减去相对距离，得到被拖动元素的原点坐标
        let position = {
          left: e.clientX - disX,
          top: e.clientY - disY
        };
        let adjustedPostion = adjustPosition(drawableElRect, position, binding.value, parentRect);

        //设置当前元素的新坐标，如果父元素是相对坐标系,style.lefts是相对父框的坐标系，
        drawableEl.style.left = adjustedPostion.left + 'px';
        drawableEl.style.top = adjustedPostion.top + 'px';
      };

      // 3.结束事件
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};

//从当前元素的父级中，获取标有特性drawable的元素
function getDrawableElement(element) {
  //循环查找父级，获取标有特性drawable的目标拖动元素
  let drawableEl = element.parentNode;
  while (drawableEl.getAttribute('drawable') == null && drawableEl.nodeName != 'BODY') {
    drawableEl = drawableEl.parentNode;
  }

  if (drawableEl.nodeName == 'BODY') {
    drawableEl = element; //找不到特性为drawable的元素时，用绑定drag指令的元素
  }

  return drawableEl;
}

//遍历父元素，判断父元素是否为相对类型(对坐标系有影响)
function getParentNodeRect(element) {
  let flag = false;
  //遍历所有父级，是否为相对position
  let parentEl = element.parentNode;
  while (parentEl.nodeName != 'BODY') {
    if (window.getComputedStyle(parentEl, null)['position'] != 'static') {
      flag = true;
      break;
    }
    parentEl = parentEl.parentNode;
  }
  //获取父元素位置
  if (flag) {
    return element.parentNode.getBoundingClientRect();
  }
}

//获取调整后的XY坐标
//drawableElRect 移动对象, getBoundingClientRect()的值,就是要他的坐标值xy
//position 原生XY坐标对象
//boundary 窗口边界
//parentRect 父框是否为相对position
function adjustPosition(drawableElRect, position, boundary, parentRect) {
  let left = position.left;
  let top = position.top;

  //边距 设置边距值
  let redefinedBoundary = { top: 0, right: 0, bottom: 0, left: 0 };
  if (boundary) {
    for (let key of Object.keys(redefinedBoundary)) {
      if (boundary[key]) {
        redefinedBoundary[key] = boundary[key];
      }
    }
  }

  //当前区域宽高
  const windowWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const windowHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

  if (left < redefinedBoundary.left + document.documentElement.scrollLeft) {
    left = redefinedBoundary.left + document.documentElement.scrollLeft;
  }
  if (top < redefinedBoundary.top + document.documentElement.scrollTop) {
    top = redefinedBoundary.top + document.documentElement.scrollTop;
  }
  //
  if (parentRect) {
    if (left + drawableElRect.width + parentRect.x > windowWidth - redefinedBoundary.right) {
      left = windowWidth - redefinedBoundary.right - drawableElRect.width - parentRect.x;
    }
    if (top + drawableElRect.height + parentRect.y > windowHeight - redefinedBoundary.bottom) {
      top = windowHeight - redefinedBoundary.bottom - drawableElRect.height - parentRect.y;
    }
  } else {
    if (left + drawableElRect.width > windowWidth - redefinedBoundary.right) {
      left = windowWidth - redefinedBoundary.right - drawableElRect.width;
    }
    if (top + drawableElRect.height > windowHeight - redefinedBoundary.bottom) {
      top = windowHeight - redefinedBoundary.bottom - drawableElRect.height;
    }
  }

  return { left, top };
}

export { drag };
