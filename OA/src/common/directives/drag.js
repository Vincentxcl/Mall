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
			//目标被拖动元素
			const drawableElRect = drawableEl.getBoundingClientRect();

			//鼠标按下后，鼠标与被拖动元素的相对距离
			let disX = e.clientX - drawableEl.offsetLeft;
			let disY = e.clientY - drawableEl.offsetTop;

			// 2.监听鼠标在document中的移动事件
			document.onmousemove = (e) => {
				//用当前鼠标的坐标值减去相对距离，得到被拖动元素的原点坐标
				let position = {
					left: e.clientX - disX,
					top: e.clientY - disY,
				};
				let adjustedPostion = adjustPosition(drawableElRect, position, binding.value);

				//设置当前元素的新坐标
				drawableEl.style.left = adjustedPostion.left + 'px';
				drawableEl.style.top = adjustedPostion.top + 'px';
			};

			// 3.结束事件
			document.onmouseup = () => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};
	},

}

//从当前元素的父级中，获取标有特性drawable的元素
function getDrawableElement(element) {
	//循环查找父级，获取标有特性drawable的目标拖动元素
	let drawableEl = element.parentNode;
	while (drawableEl.getAttribute('drawable') == null && drawableEl.nodeName != 'BODY') {
		drawableEl = drawableEl.parentNode;
	}

	if (drawableEl.nodeName == 'BODY') {
		drawableEl = element;//找不到特性为drawable的元素时，用绑定drag指令的元素
	}

	return drawableEl;
}

//获取调整后的XY坐标
//drawableElRect 移动对象, getBoundingClientRect()的值,就是要他的坐标值xy
//position 原生XY坐标对象
//boundary 窗口边界
function adjustPosition(drawableElRect, position, boundary) {
	let left = position.left;
	let top = position.top;

	//边距 设置边距值
	let redefinedBoundary = { top: 0, right: 0, bottom: 0, left: 0, };
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
	if (left + drawableElRect.width > windowWidth - redefinedBoundary.right) {
		left = windowWidth - redefinedBoundary.right - drawableElRect.width;
	}
	if (top < redefinedBoundary.top + document.documentElement.scrollTop) {
		top = redefinedBoundary.top + document.documentElement.scrollTop;
	}
	if (top + drawableElRect.height > windowHeight - redefinedBoundary.bottom) {
		top = windowHeight - redefinedBoundary.bottom - drawableElRect.height;
	}

	return { left, top };
}

export { drag };
