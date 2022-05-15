<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Container'
};
</script>

<style scoped>
div.container {
  position: absolute;
  z-index: 2100;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px 2px #d1d1d1;
}
</style>
