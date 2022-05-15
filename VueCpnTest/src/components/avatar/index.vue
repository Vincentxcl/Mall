<template>
  <div class="avatar">
    <img :src="defaultImgSrc" v-realSrc="url" alt="avatar" />
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
        return require('assets/imgs/avatar/default.png');
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
