<template>
  <head-bar>
    <i slot="left" class="iconfont icon-31fanhui1" @click="goBack"></i>
    <template slot="middle">
      <ul>
        <li v-for="item in list" :key="item.index" :class="{active:isActive(item.index)}" @click="echoInput(item.index)">{{item.ttl}}</li>
      </ul>
    </template>
  </head-bar>
</template>

<script>
  import { vmodel } from 'common/mixins.js';
  import HeadBar from 'components/headBar/Index.vue';

  export default {
    name: 'DetailHeadBar',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      goBack() {
        this.$router.back();
      },
    },
    components: {
      HeadBar
    },
    mixins: [vmodel],
  };
</script>

<style scoped>
  @import '~assets/css/detailHeadBar/iconfont.css';

  header {
    box-shadow: 0px -2px 2px 2px #f8f8f8 inset;
  }

  .iconfont {
    font-size: 25px;
  }

  ul {
    display: flex;
    flex-flow: row;
  }

  li {
    flex: 1;
    font-size: 14px;
    color: var(--color-text);
  }

  .active {
    color: var(--color-high-text);
  }
</style>
