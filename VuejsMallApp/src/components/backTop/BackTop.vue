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
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 100%;
    text-align: center;
    color: var(--color-tint);
    background: white;
    position: fixed;
    z-index: 1000;
    right: 15px;
    bottom: 60px;
    box-shadow: 0px 0px 2px 2px #f1f1f1;
  }

  .iconfont {
    font-size: 25px;
  }
</style>
