<template>
  <nav class="mainToolBar">
    <nav-Group :items="items" @click="itemClick"></nav-Group>
  </nav>
</template>

<script>
import NavGroup from './parts/navGroup.vue';

export default {
  name: 'MainToolBar',
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  methods: {
    itemClick(val) {
      this.$emit('click', val);
    }
  },
  components: {
    NavGroup
  }
};
</script>

<style>
.mainToolBar {
  font-size: 14px;
}

.mainToolBar ul > li.navItem {
  display: inline-block;
  margin: 0px 5px;
}

.mainToolBar ul > li.navItem:hover {
  cursor: pointer;
  color: var(--color-high-text);
}

.mainToolBar ul > li > div.active {
  cursor: not-allowed;
  color: var(--color-high-text);
}

.mainToolBar div.icon {
  display: inline;
  margin: 0px 2px;
}

.mainToolBar div.icon > i {
  height: 40px;
  line-height: 40px;
}

.mainToolBar div.ttl {
  display: inline;
  height: 40px;
  line-height: 40px;
}
</style>
