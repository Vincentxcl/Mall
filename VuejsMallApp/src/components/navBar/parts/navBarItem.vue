<template>
  <div class="navBarItem" @click="itemClick" :style="selectColor">
    <slot name="icon"></slot>
    <p>
      <slot name="title"></slot>
    </p>
  </div>
</template>

<script>
  export default {
    name: "NavBarItem",
    props: {
      routeName: {
        type: String,
        required: true
      },
      activeColor: {
        type: String,
        default: "red"
      }
    },
    computed: {
      isActive() {
        return (this.$route.name == this.routeName ? true : false);
      },
      selectColor() {
        return (this.isActive ? { color: this.activeColor } : {});
      }
    },
    methods: {
      itemClick() {
        if (!this.isActive) {
          this.$router.push({
            name: this.routeName
          });
        }
      },
    },
  };
</script>

<style scoped>
  .navBarItem {
    flex: 1;
    text-align: center;
  }

  i {
    height: 30px;
    font-size: 24px;
    line-height: 30px;
  }

  p {
    height: 15px;
    padding-bottom: 4px;
    font-size: 12px;
    line-height: 15px;
  }
</style>
