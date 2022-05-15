<template>
  <nav class="navBar">
    <slot></slot>
  </nav>
</template>

<script>
  export default {
    name: "NavBar",
  };
</script>

<style scoped>
  .navBar {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    position: fixed;
    bottom: 0px;
    background: #f3f3f3;
    box-shadow: 0px -2px 1px rgba(128,128,128,0.1);
  }
</style>
