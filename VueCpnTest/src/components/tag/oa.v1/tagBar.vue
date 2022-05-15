<template>
  <div class="tagBar">
    <tag-item v-for="item in tagItemCount" :key="item" :item="getUsedSiteNode(item - 1)" :index="item-1" :style="tagItemStyle(item - 1)"></tag-item>
  </div>
</template>

<script>
import tagItem from '../oa.v1/tagItem.vue';
export default {
  name: 'TagBar',
  computed: {
    tagItemCount() {
      return this.$store.getters.usedSiteNodes.length;
    }
  },
  methods: {
    getUsedSiteNode(index) {
      return this.$store.getters.usedSiteNodes[index];
    },
    tagItemStyle(index) {
      return { 'margin-left': 65 * index + 'px' };
    }
  },
  components: { tagItem }
};
</script>

<style scoped>
.tagBar {
  background: #ccc;
  width: 100%;
  height: 25px;
}
</style>
