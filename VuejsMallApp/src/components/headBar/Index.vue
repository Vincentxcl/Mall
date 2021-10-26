<template>
  <header class="headBar">
    <div>
      <slot name="left"></slot>
    </div>
    <div>
      <slot name="middle"></slot>
    </div>
    <div>
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
  export default {
    name: "HeadBar",
  }
</script>

<style scoped>
  .headBar {
    width: 100%;
    height: 44px;
    display: flex;
    line-height: 44px;
    text-align: center;
  }

    .headBar > div:nth-child(1), .headBar > div:nth-child(3) {
      width: 60px;
    }

    .headBar > div:nth-child(2) {
      flex: 1;
    }
</style>
