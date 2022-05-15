<template>
  <transition name="slide-fade">
    <div id="toast" v-show="isShow"></div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      isShow: false,
      handle: null
    };
  },
  methods: {
    show(info = {}, duration = 2000) {
      clearTimeout(this.handle);

      // content&style
      let obj = {
        text: 'Hello World',
        width: 350,
        fontSize: 15,
        color: 'var(--color-text)',
        backGroundColor: '#fff',
        border: '1px solid var(--color-text)',
        borderRadius: '5px',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };

      let dom = document.getElementById('toast');
      dom.innerHTML = info.text ? info.text : obj.text;

      let width = info.width ? info.width : obj.width;
      let fontSize = info.fontSize ? info.fontSize : obj.fontSize;

      dom.style.width = width + 'px';
      dom.style.fontSize = fontSize + 'px';
      dom.style.color = info.color ? info.color : obj.color;
      dom.style.backgroundColor = info.backgroundColor ? info.backGroundColor : obj.backGroundColor;
      dom.style.border = info.border ? info.border : obj.border;
      dom.style.borderRadius = info.borderRadius ? info.borderRadius : obj.borderRadius;
      //
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let scrollTop = document.documentElement.scrollTop; //滚动条的高度
      let scrollLeft = document.documentElement.scrollLeft;

      dom.style.top = windowHeight / 2 - (fontSize + 24) / 2 + scrollTop + obj.top - obj.bottom + 'px';
      dom.style.left = windowWidth / 2 - width / 2 + scrollLeft + obj.right - obj.left + 'px';

      this.isShow = true;
      this.handle = setTimeout(() => {
        this.isShow = false;
      }, duration);
    }
  }
};
</script>

<style scoped>
#toast {
  position: absolute;
  padding: 12px 5px;
  text-align: center;
  opacity: 0.9;
  z-index: 3010;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave {
  opacity: 0.9;
}
</style>
