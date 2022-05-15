<template>
  <nav class="mobileNavBar">
    <nav-Group :items="$store.getters.siteMap"></nav-Group>
  </nav>
</template>

<script>
import NavGroup from './parts/navGroup.vue';

export default {
  name: 'MobileNavBar',
  components: {
    NavGroup
  }
};
</script>

<style>
.mobileNavBar {
  width: 100%;
  height: 45px;
  position: fixed;
  bottom: 0px;
  background: #f3f3f3;
  box-shadow: 0px -2px 1px rgba(128, 128, 128, 0.1);
}

.mobileNavBar ul {
  display: flex;
  flex-flow: row nowrap;
}

.mobileNavBar ul > li.navItem {
  flex: 1;
  text-align: center;
}

.mobileNavBar ul > li > div.active {
  color:var(--color-high-text);
}

.mobileNavBar div.icon {
  height: 27px;
  line-height: 27px;
}

.mobileNavBar div.icon > i {
  font-size: 22px;
}
.mobileNavBar div.ttl {
  height: 18px;
  padding-bottom: 6px;
  font-size: 12px;
  line-height: 14px;
}
</style>
