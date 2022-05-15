// resize指令使用方法
// 在目标元素上添加v-resize指令，该元素就可以实现被拖拽
// v-resize='{top:3,right:3,bottom:45,left:3,minWidth:200,minHeight:250}'，v-resize可以设置参数，参数为一个对象，用于调整边距
const resize = {
  inserted(element, binding) {
    element.style.position = 'absolute';
    appendCtrls(element, binding.value); // 添加拖拽控件到目标元素中
  }
};

//添加控件元素
function appendCtrls(element, boundary) {
  const ctrls = ['r', 'l', 't', 'b', 'br', 'bl', 'tr', 'tl'];
  for (let item of ctrls) {
    let div = document.createElement('div');
    div.className = item;
    //添加Style
    // #region
    div.style.position = 'absolute';
    div.style.zIndex = '1100';
    div.style.opacity = '0';

    //边
    if (item == 'l' || item == 'r') {
      div.style.width = '3px';
      div.style.height = '100%';
      div.style.cursor = 'col-resize';
    }
    if (item == 't' || item == 'b') {
      div.style.width = '100%';
      div.style.height = '3px';
      div.style.cursor = 'row-resize';
    }
    if (item == 't') {
      div.style.top = '0';
    }
    if (item == 'b') {
      div.style.bottom = '0';
    }
    if (item == 'l') {
      div.style.left = '0';
    }
    if (item == 'r') {
      div.style.right = '0';
    }
    //角
    if (item == 'tl' || item == 'bl') {
      div.style.left = '-3px';
      div.style.width = '6px';
      div.style.height = '6px';
    }
    if (item == 'tr' || item == 'br') {
      div.style.right = '-3px';
      div.style.width = '6px';
      div.style.height = '6px';
    }
    if (item == 'br' || item == 'bl') {
      div.style.bottom = '-3px';
      div.style.width = '6px';
      div.style.height = '6px';
    }
    if (item == 'tl' || item == 'tr') {
      div.style.top = '-3px';
      div.style.width = '6px';
      div.style.height = '6px';
    }
    if (item == 'bl' || item == 'tr') {
      div.style.cursor = 'nesw-resize';
      div.style.zIndex = '1101';
    }
    if (item == 'br' || item == 'tl') {
      div.style.cursor = 'nwse-resize';
      div.style.zIndex = '1101';
    }
    // #endregion
    //添加拖拽事件
    addDragFunc(element, div, boundary);
    //将拖拽控件插入到element的子元素的最前面
    if (!element.firstChild) {
      element.appendChild(div);
    } else {
      element.insertBefore(div, element.firstChild);
    }
  }
}

//为控件添加拖拽事件
//element 元素本体
//ctrl 拖拽控件
//临界值
function addDragFunc(element, ctrl, boundary) {
  // 鼠标按下事件
  ctrl.onmousedown = (e) => {
    // 阻止默认事件
    e.preventDefault();
    //   阻止事件的冒泡
    e.stopPropagation();
    // 获取移动前鼠标xy坐标，盒子的宽高、xy坐标
    let region = {
      x: e.clientX,
      y: e.clientY,
      width: element.offsetWidth,
      height: element.offsetHeight,
      left: element.offsetLeft,
      top: element.offsetTop
    };
    // 鼠标移动事件，计算出新的位置信息
    document.onmousemove = (e) => {
      if (ctrl.className == 'tl') {
        element.style.width = region.width - (e.clientX - region.x) + 'px';
        element.style.height = region.height - (e.clientY - region.y) + 'px';
        element.style.left = region.left + (e.clientX - region.x) + 'px';
        element.style.top = region.top + (e.clientY - region.y) + 'px';
      } else if (ctrl.className == 'bl') {
        element.style.width = region.width - (e.clientX - region.x) + 'px';
        element.style.height = region.height + (e.clientY - region.y) + 'px';
        element.style.left = region.left + (e.clientX - region.x) + 'px';
      } else if (ctrl.className == 'tr') {
        element.style.width = region.width + (e.clientX - region.x) + 'px';
        element.style.height = region.height - (e.clientY - region.y) + 'px';
        element.style.top = region.top + (e.clientY - region.y) + 'px';
      } else if (ctrl.className == 'br') {
        element.style.width = region.width + (e.clientX - region.x) + 'px';
        element.style.height = region.height + (e.clientY - region.y) + 'px';
      } else if (ctrl.className == 't') {
        element.style.height = region.height - (e.clientY - region.y) + 'px';
        element.style.top = region.top + (e.clientY - region.y) + 'px';
      } else if (ctrl.className == 'b') {
        element.style.height = region.height + (e.clientY - region.y) + 'px';
      } else if (ctrl.className == 'l') {
        element.style.width = region.width - (e.clientX - region.x) + 'px';
        element.style.left = region.left + (e.clientX - region.x) + 'px';
      } else if (ctrl.className == 'r') {
        element.style.width = region.width + (e.clientX - region.x) + 'px';
      }
      //调整边距
      adjustElementRegion(element, region, boundary);
    };
    //结束事件
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

//调整拖拽后的区域，其X/Y/width/height
function adjustElementRegion(element, beforeMovedRegion, boundary) {
  //边距 设置边距值
  let redefinedBoundary = { top: 0, right: 0, bottom: 0, left: 0, minWidth: 150, minHeight: 200 };
  if (boundary) {
    for (let key of Object.keys(redefinedBoundary)) {
      if (boundary[key]) {
        redefinedBoundary[key] = boundary[key];
      }
    }
  }

  //当前区域宽高
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  //重新设置
  //left
  if (element.offsetLeft < redefinedBoundary.left + document.documentElement.scrollLeft) {
    element.style.left = redefinedBoundary.left + document.documentElement.scrollLeft + 'px';
    element.style.width = beforeMovedRegion.width + beforeMovedRegion.left - redefinedBoundary.left + 'px';
  }
  if (element.offsetLeft >= beforeMovedRegion.left + beforeMovedRegion.width - redefinedBoundary.minWidth) {
    element.style.left = beforeMovedRegion.left + beforeMovedRegion.width - redefinedBoundary.minWidth + 'px';
  }
  //width
  if (element.offsetWidth + element.offsetLeft > windowWidth - redefinedBoundary.right) {
    element.style.width = windowWidth - element.offsetLeft - redefinedBoundary.right + 'px';
  }
  if (element.offsetWidth < redefinedBoundary.minWidth) {
    element.style.width = redefinedBoundary.minWidth + 'px';
  }
  //top
  if (element.offsetTop < redefinedBoundary.top + document.documentElement.scrollTop) {
    element.style.top = redefinedBoundary.top + document.documentElement.scrollTop + 'px';
    element.style.height = beforeMovedRegion.height + beforeMovedRegion.top - redefinedBoundary.top + 'px';
  }
  if (element.offsetTop >= beforeMovedRegion.top + beforeMovedRegion.height - redefinedBoundary.minHeight) {
    element.style.top = beforeMovedRegion.top + beforeMovedRegion.height - redefinedBoundary.minHeight + 'px';
  }
  //height
  if (element.offsetHeight + element.offsetTop > windowHeight - redefinedBoundary.bottom) {
    element.style.height = windowHeight - element.offsetTop - redefinedBoundary.bottom + 'px';
  }
  if (element.offsetHeight < redefinedBoundary.minHeight) {
    element.style.height = redefinedBoundary.minHeight + 'px';
  }
}

export { resize };
