<template>
  <div class="backTop">
    <slot>
      <i class="iconfont icon-backtop"></i>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'backTop',
  };
</script>

<style scoped>
  @import '~assets/css/backTop/iconfont.css';

  .backTop {
    position: fixed;
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 100%;
    z-index: 1000;
    text-align: center;
    color: var(--color-tint);
    background: white;
    right: 15px;
    bottom: 60px;
    box-shadow: 0px 0px 2px 2px #f1f1f1;
  }

  .iconfont {
    font-size: 25px;
  }
</style>
