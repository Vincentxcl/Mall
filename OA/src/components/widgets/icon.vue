<template>
  <i class="iconfont" :class="font" :title="title"></i>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true,
      default() {
        return 'icon-zhanghao';
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    }
  },
  computed: {
    font() {
      let obj = {};
      obj[this.icon] = true;
      return obj;
    }
  }
};
</script>

<style scoped>
@import '~assets/cssBase/icons/iconfont.css';
</style>
