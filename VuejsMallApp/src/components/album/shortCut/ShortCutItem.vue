<template>
  <li :class="{active:isActive}" @click="itemClick">
    <slot>
      <i></i>
    </slot>
  </li>
</template>

<script>
  export default {
    name: 'ShortCutItem',
    data() {
      return {
        callIndex: 0,
      };
    },
    props: {
      index: {
        type: Number,
        required: true,
      },
    },
    computed: {
      isActive() {
        return (this.index === this.callIndex);
      },
    },
    methods: {
      itemClick() {
        this.$emit("itemClick", this.index);
      },
    },
  };
</script>

<style scoped>
  li {
    display: inline-block;
  }

  i {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: white;
    margin: 0px 5px;
    cursor: pointer;
    transition: all 0.5s ease;
  }

  li.active i, li:hover i {
    background-color: #444;
  }
</style>
