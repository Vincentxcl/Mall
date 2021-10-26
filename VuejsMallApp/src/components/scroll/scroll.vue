<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';//@1.15.2

  export default {
    name: 'scroll',
    data() {
      return {
        bs: null,
      };
    },
    props: {
      probeType: {
        type: Number,
        default() {
          return 0;
        },
      },
      pullUpLoad: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    methods: {
      scrollTo(x, y, time = 500) {
        this.bs.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.bs.finishPullUp();
      },
      refresh() {
        this.bs.refresh();
        console.log("滚动条高度",this.bs.scrollerHeight);
      },
      y() {
        return this.bs.y;
      },
    },
    mounted() {
      this.bs = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
        click: true,
      });
      if (this.probeType > 1 && this.probeType < 4) {
        this.bs.on('scroll', position => {
          this.$emit("position", position);
        });
      }
      if (this.pullUpLoad) {
        this.bs.on("pullingUp", () => {
          this.$emit("pullingUp");
        });
      }
    },
  };
</script>

<style scoped>
  .wrapper {
    overflow: hidden;
  }
</style>
