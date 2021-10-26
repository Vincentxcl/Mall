<template>
  <div class="goodsList" v-if="Object.keys(list).length!=0">
    <ul>
      <goods-item v-for="item in list" :key="item.id" :info="item" />
    </ul>
  </div>
</template>

<script>
  import GoodsItem from './goodsItem';

  export default {
    name: 'GoodList',
    props: {
      list: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: {
      GoodsItem,
    },
  };
</script>

<style scoped>
  .goodsList {
    width: 100%;
    padding: 0px 3px;
  }

  ul {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }
</style>
