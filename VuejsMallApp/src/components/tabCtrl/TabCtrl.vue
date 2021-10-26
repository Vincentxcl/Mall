<template>
  <div class="tabCtrl">
    <div v-for="item in list" :key="item.index" :class="{active:isActive(item.index)}" @click="echoInput(item.index)" class="item">
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
  import { vmodel } from 'common/mixins.js';

  export default {
    name: 'TabCtrl',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    mixins: [vmodel],
  };
</script>

<style scoped>
  .tabCtrl {
    display: flex;
    flex-flow: row nowrap;
    background-image: linear-gradient(white,#f7f7f7);
  }

  .item {
    flex: 1;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: var(--color-text);
  }

  .active {
    color: var(--color-high-text);
  }

    .active span {
      padding: 3px;
      border-bottom: 2px solid var(--color-high-text);
    }
</style>
