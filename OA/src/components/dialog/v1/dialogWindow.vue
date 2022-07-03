<template>
  <container class="dialogWindow" v-show="isShowField" :style="dialogStyle">
    <div class="titleBar">
      <div @mousedown="drag">
        <slot name="title">Dialog Window Title</slot>
      </div>
      <div @click="close">
        <slot name="icon">
          <icon icon="icon-guanbi" title="关闭"></icon>
        </slot>
      </div>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </container>
</template>

<script>
import Icon from 'components/widgets/icon.vue';
import Container from '../parts/container.vue';

//可拖拽的对话框
export default {
  name: 'DialogWindow', //different from dialog in html5
  data() {
    return {
      isShowField: false,
      windowWidth: 0,
      windowHeight: 0,
      x: 0,
      y: 0,
      zindex: 0
    };
  },
  props: {
    //控制显示和隐藏，请使用v-model,不要使用isShow属性，v-model绑定的变量需要在变化时，组件才能watch到变化
    isShow: {
      type: Boolean,
      default() {
        return false;
      }
    },
    width: {
      type: Number,
      default() {
        return 500;
      }
    },
    height: {
      type: Number,
      default() {
        return 580;
      }
    },
    border: {
      //拖动时与视口的边距
      type: Object,
      default() {
        return { top: 0, right: 0, bottom: 0, left: 0 };
      }
    }
  },
  computed: {
    dialogStyle() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        left: this.x + 'px',
        top: this.y + 'px',
        'z-index': this.zindex
      };
    }
  },
  methods: {
    //监听拖动过程
    drag(e) {
      // 阻止默认事件
      e.preventDefault();
      // 阻止事件冒泡
      e.stopPropagation();
      // 目标被拖动元素
      const drawableEl = e.target.parentNode.parentNode;
      const drawableElRect = drawableEl.getBoundingClientRect(); //container为组件时不能使用原生js的getBoundingClentRect
      // 父框
      const parentRect = this.getParentNodeRect(drawableEl);

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
        let adjustedPostion = this.adjustPosition(drawableElRect, position, this.border, parentRect);

        //设置当前元素的新坐标，如果父元素是相对坐标系,style.lefts是相对父框的坐标系，
        drawableEl.style.left = adjustedPostion.left + 'px';
        drawableEl.style.top = adjustedPostion.top + 'px';
        this.x = adjustedPostion.left;
        this.y = adjustedPostion.top;
      };

      // 3.结束事件
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    getParentNodeRect(element) {
      //遍历父元素，判断父元素是否为相对类型(对坐标系有影响)
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
    },
    //获取调整后的XY坐标
    //drawableElRect 移动对象, getBoundingClientRect()的值,就是要他的坐标值xy
    //position 原生XY坐标对象
    //boundary 窗口边界
    //parentRect 父框是否为相对position
    adjustPosition(drawableElRect, position, boundary, parentRect) {
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

      if (left < redefinedBoundary.left + document.documentElement.scrollLeft) {
        left = redefinedBoundary.left + document.documentElement.scrollLeft;
      }
      if (top < redefinedBoundary.top + document.documentElement.scrollTop) {
        top = redefinedBoundary.top + document.documentElement.scrollTop;
      }
      //
      if (parentRect) {
        if (left + drawableElRect.width + parentRect.x > this.windowWidth - redefinedBoundary.right) {
          left = this.windowWidth - redefinedBoundary.right - drawableElRect.width - parentRect.x;
        }
        if (top + drawableElRect.height + parentRect.y > this.windowHeight - redefinedBoundary.bottom) {
          top = this.windowHeight - redefinedBoundary.bottom - drawableElRect.height - parentRect.y;
        }
      } else {
        if (left + drawableElRect.width > this.windowWidth - redefinedBoundary.right) {
          left = this.windowWidth - redefinedBoundary.right - drawableElRect.width;
        }
        if (top + drawableElRect.height > this.windowHeight - redefinedBoundary.bottom) {
          top = this.windowHeight - redefinedBoundary.bottom - drawableElRect.height;
        }
      }

      return { left, top };
    },
    close() {
      this.isShowField = false;
    }
  },
  watch: {
    isShow: {
      handler(current) {
        //赋值
        this.isShowField = current;
        //计算坐标
        if (current) {
          //当前区域宽高
          this.windowWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
          this.windowHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

          //此时控件的位置
          this.x = this.windowWidth / 2 - this.width / 2 + document.documentElement.scrollLeft;
          this.y = this.windowHeight / 2 - this.height / 2 + document.documentElement.scrollTop;
        }
        //遮罩
        if (this.$mask) {
          this.zindex = this.$mask.zindex + 1;
          current ? this.$mask.show() : this.$mask.hide();
        }
      }
    },
    isShowField: {
      handler(current) {
        this.$emit('change', current);
      }
    }
  },
  components: {
    Container,
    Icon
  },
  model: {
    prop: 'isShow',
    event: 'change'
  }
};
</script>

<style scoped>
/*弹出层*/
div.dialogWindow {
  border: 1px solid #999999;
}

/*弹出层横标*/
div.titleBar {
  display: flex;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  cursor: move;
  background-color: #f3f3f3;
}

div.titleBar > div {
  height: 30px;
  line-height: 30px;
}

div.titleBar div:first-child {
  padding-left: 20px;
  flex: 1;
}

div.titleBar div:last-child {
  width: 30px;
  text-align: center;
  cursor: pointer;
}

div.titleBar div:last-child:hover {
  color: var(--color-danger);
}

div.content {
  width: 100%;
  height: calc(100% - 30px);
}
</style>
