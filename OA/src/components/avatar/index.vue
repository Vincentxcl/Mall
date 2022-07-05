<template>
  <div class="avatar" @click="click">
    <img :src="defaultImgSrc" v-realSrc="url" alt="avatar" @load="onload" />
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    url: {
      type: String
    },
    defaultImgSrc: {
      type: String,
      default() {
        return require('assets/imgs/avatar/default.png'); //此地址中的default为关键词，影响正则判断图片加载问题
      }
    }
  },
  methods: {
    click() {
      this.$emit('click');
    },
    onload(e) {
      let src = e.target.getAttribute('src');
      if (!/^.+(default).+$/g.test(src)) {
        this.$emit('loadComplete');///////////loadComplete 事件
      }
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar > img {
  width: 100%;
  height: 100%;
}
</style>
