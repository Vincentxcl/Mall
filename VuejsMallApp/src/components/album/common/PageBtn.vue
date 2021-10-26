<template>
  <div class="pageBtn">
    <div class="fl" @click="pre">
      <slot name="left">
        <span class="iconfont icon-qianhou1"></span>
      </slot>
    </div>

    <div class="fr" @click="next">
      <slot name="right">
        <span class="iconfont icon-qianhou2"></span>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PageBtn",
    methods: {
      pre() {
        this.$emit("flip", -1);
      },
      next() {
        this.$emit("flip", 1);
      },
    },
  };
</script>

<style scoped>
  @import '~assets/css/album/iconfont.css';

  .pageBtn {
    position: relative;
    z-index:1000;
  }

  .iconfont {
    width: 40px;
    height: 40px;
    font-size: 30px;
    font-weight: bolder;
    line-height: 40px;
    text-align: center;
    color: #c3c3c3;
    border: 1px solid #c3c3c3;
    border-radius: 4px;
    margin: 0px 3px;
    cursor: pointer;
  }

    .iconfont:hover {
      transition: all 0.5s ease;
      transform: scale(1.05);
      color: white;
      border: 1px solid white;
    }
</style>
