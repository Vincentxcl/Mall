<template>
  <div id="toast" v-show="isShow" :style="theStyle">
    {{text}}
  </div>
</template>

<script>
  export default {
    name: 'Toast',
    data() {
      return {
        isShow: false,
        text: 'Hello World',
        width: 350,
        fontSize: 15,
        txtColor: 'red',
        backGround: '#fff',
        border: '1px solid #444',
        borderRadius: '5px',
        windowWidth: null,
        windowHeight: null,
        scrollTop: null,
        handle: null,
      };
    },
    computed: {
      theStyle() {
        return {
          'top': (this.windowHeight / 2 - (this.fontSize + 24) / 2) + this.scrollTop + 'px',
          'left': (this.windowWidth / 2 - this.width / 2) + 'px',
          'width': this.width + 'px',
          'font-size': this.fontSize + 'px',
          'color': this.txtColor,
          'background': this.backGround,
          'border': this.border,
          'border-radius': this.borderRadius,
        };
      },
    },
    methods: {
      show(msg, duration = 1500) {
        clearTimeout(this.handle);
        if (msg) {
          this.text = msg;
        }
        this.isShow = false;
        this.isShow = true;
        this.handle = setTimeout(() => {
          this.isShow = false;
          this.text = '';
        }, duration);
      },
    },
    mounted() {
      this.windowWidth = window.screen.availWidth;
      this.windowHeight = window.screen.availHeight;
    },
    beforeUpdate() {
      this.scrollTop = document.documentElement.scrollTop;//滚动条的高度
    },
  };
</script>

<style scoped>
  #toast {
    position: absolute;
    padding: 12px 5px;
    text-align: center;
    opacity: 0.9;
    transition: all 1s linear;
    z-index: 1010
  }
</style>
