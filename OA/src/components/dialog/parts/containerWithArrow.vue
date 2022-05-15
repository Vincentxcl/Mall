<template>
  <container class="container-with-arrow">
    <div class="arrow"></div>
    <slot></slot>
  </container>
</template>

<script>
import container from './container.vue';

export default {
  name: 'ContainerWithArrow',
  components: {
    container
  }
};
</script>

<style scoped>
div.arrow {
  position: absolute;
  z-index: 2101;
  top: -6px;
  filter: drop-shadow(0px -3px 1px #d8d8d8);
}

div.arrow::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background: white;
  clip-path: polygon(0% 60%, 50% 0%, 100% 60%);
}
</style>
