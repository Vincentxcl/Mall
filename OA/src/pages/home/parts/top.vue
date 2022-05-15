<template>
  <header>
    <tag-bar></tag-bar>
    <avatar-info></avatar-info>
  </header>
</template>

<script>
import TagBar from 'components/tag/oa.v2/tagBar.vue';
import AvatarInfo from './avatarInfo.vue';

export default {
  name: 'Top',
  components: {
    AvatarInfo,
    TagBar
  }
};
</script>

<style scoped>
header {
  display: flex;
  flex-flow: row;
  align-items: center;
  width: 100%;
  height: 45px;
  background: #333;
}

.tagBar {
  flex: 1;
  height: 45px;
  padding: 0px 30px;
}

.avatarInfo {
  margin-right: 50px;
}
</style>
