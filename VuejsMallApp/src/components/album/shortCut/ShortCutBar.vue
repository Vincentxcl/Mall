<template>
  <div class="shortCutBar">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "ShortCutBar",
    props: {
      currentIndex: {
        type: Number,
        default() {
          return 0;
        },
      },
    },
    methods: {
      callItem() {
        this.$children.forEach((value) => {
          value.callIndex = this.currentIndex;
        });
      },
    },
    watch: {
      currentIndex() {
        this.callItem();
      },
    },
    mounted() {
      this.callItem();
    },
  };
</script>

<style scoped>
  .shortCutBar {
    position: relative;
    width: 100%;
    height: auto;
    text-align: center;
    z-index: 1001;
  }
</style>
