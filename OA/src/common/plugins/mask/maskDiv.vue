<template>
  <div id="maskDiv" v-show="isShow" :style="style"></div>
</template>

<script>
export default {
  name: 'MaskDiv',
  data() {
    return {
      isShow: false,
      color: '#e0e0e0',
      domHeight: 0,
      domWidth: 0,
      zindex: 2000
    };
  },
  computed: {
    style() {
      return {
        height: this.domHeight + 'px',
        width: this.domWidth + 'px',
        'background-color': this.color,
        'z-index': this.zindex
      };
    }
  },
  methods: {
    show() {
      //所有元素的高度和宽度的最大值
      this.domHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      this.domWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      this.isShow = true;
      document.querySelector('body').style.overflow = 'hidden';
    },
    hide() {
      this.isShow = false;
      document.querySelector('body').style.overflow = 'auto';
    }
  }
};
</script>

<style scoped>
#maskDiv {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}
</style>
