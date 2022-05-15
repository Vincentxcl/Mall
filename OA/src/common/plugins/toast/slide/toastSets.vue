<template>
  <div id="toastSets" :style="toastSetsStyle" v-show="items.length > 0">
    <div class="list" :style="listStyle">
      <toast v-for="item in items" :key="item.id" :type="item.type" :text="item.text" :duration="duration" @beforeFade="forward" @faded="delItems"></toast>
    </div>
  </div>
</template>

<script>
import toast from './toast.vue';

export default {
  name: 'ToastSets',
  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      scrollTop: 0,
      scrollLeft: 0,
      items: [],
      x: 50,
      handler: null,
      duration: 5000,
      width: 350
    };
  },
  methods: {
    //使用show方法将消息入队
    show(info = {}) {
      //取消清除items的线程
      clearTimeout(this.handler);

      //toast 容器
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.scrollTop = document.documentElement.scrollTop; //滚动条的高度
      this.scrollLeft = document.documentElement.scrollLeft;

      // 默认配置
      let defaultOptions = {
        type: 'normal',
        text: '<a>Hello World!</a>'
      };
      // 导入options
      if (typeof info === 'object') {
        for (let item in defaultOptions) {
          if (info[item] != undefined) {
            defaultOptions[item] = info[item];
          }
        }
      }
      // 入队
      this.items.push(defaultOptions);
    },
    delItems() {
      //等完全没有弹窗，3秒之后清除队列
      if (this.handler) {
        clearTimeout(this.handler); //如果3秒之内又有弹窗，取消清除
      }
      this.handler = setTimeout(() => {
        this.items = [];
        this.x = 50;
      }, 3000);
    },
    forward() {
      this.x -= 50;
    }
  },
  computed: {
    toastSetsStyle() {
      return {
        top: this.scrollTop + 'px',
        left: this.windowWidth / 2 - this.width / 2 + this.scrollLeft + 'px',
        height: this.windowHeight + 'px'
      };
    },
    listStyle() {
      return {
        width: this.width + 'px',
        top: this.x + 'px'
      };
    }
  },
  components: {
    toast
  }
};
</script>

<style>
#toastSets {
  position: absolute;
  overflow: hidden;
  pointer-events: none;
}

#toastSets .list {
  position: relative;
  transition: all 1s ease;
}
</style>
