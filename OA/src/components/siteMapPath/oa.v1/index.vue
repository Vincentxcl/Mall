<template>
  <div class="siteMapPath">
    <template v-for="item in siteMapPathNodes">
      <site-map-node :key="'smn' + item.id" :item="item">
        <span>{{ item.title }}</span>
      </site-map-node>
      <icon :key="'icon' + item.id" v-if="item != lastItem" icon="icon-xiayiyehouyiye"></icon>
    </template>
  </div>
</template>

<script>
//使用组合指南 1.Vuex module navigation.js记录使用的节点;

import Icon from 'components/widgets/icon.vue';
import SiteMapNode from './parts/siteMapNode.vue';

export default {
  name: 'SiteMapPath',
  computed: {
    siteMapPathNodes() {
      let siteNodes = [];
      if (this.$store.getters.path) {
        let arr = this.$store.getters.path.split('/');
        if (arr.length > 0) {
          for (let item of arr) {
            let temp = this.$store.getters.siteNodes.find((val) => val.title == item);
            if (temp) {
              siteNodes.push(temp);
            }
          }
        }
      }
      return siteNodes;
    },
    lastItem() {
      return this.siteMapPathNodes[this.siteMapPathNodes.length - 1];
    }
  },
  components: {
    SiteMapNode,
    Icon
  }
};
</script>

<style scoped>
.siteMapNode {
  display: inline-block;
  padding: 0px 5px;
}

.siteMapNode.route {
  text-decoration: underline;
  cursor: pointer;
}

.siteMapNode.active {
  color: var(--color-high-text);
  text-decoration: none;
  cursor:auto;
}
</style>
