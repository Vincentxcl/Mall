<template>
  <nav class="assistanceToolBar">
    <nav-Group :items="items" @click="itemClick"></nav-Group>
  </nav>
</template>

<script>
import NavGroup from './parts/navGroup.vue';

export default {
  name: 'AssistanceToolBar',
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
.assistanceToolBar ul > li.navItem {
  display: inline-block;
  margin: 0px 3px;
}

.assistanceToolBar ul > li.navItem:hover {
  cursor: pointer;
  color: var(--color-high-text);
}

.assistanceToolBar ul > li > div.active {
  cursor: not-allowed;
  color: var(--color-high-text);
}

.assistanceToolBar div.icon {
  display: inline;
  margin: 0px 2px;
}

.assistanceToolBar div.icon > i {
  height: 25px;
  line-height: 25px;
  font-size: 14px;
}

.assistanceToolBar div.ttl {
  display: inline;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
</style>
